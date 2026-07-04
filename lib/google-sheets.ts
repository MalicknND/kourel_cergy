import { createSign } from "node:crypto";

import type { Member } from "@/types/member";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const GOOGLE_SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const DEFAULT_MEMBERS_RANGE = "A:Z";
const REVALIDATE_SECONDS = 300;

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
};

type GoogleSheetsValuesResponse = {
  range: string;
  majorDimension: "ROWS" | "COLUMNS";
  values?: string[][];
};

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

const columnMap = {
  nom: ["Nom"],
  prenom: ["Prénom", "Prenom"],
  telephone: ["Numéro de téléphone", "Numero de telephone", "Téléphone", "Telephone"],
  email: ["Adresse e-mail", "Adresse email", "Email", "E-mail"],
  ville: ["Ville de résidence", "Ville de residence", "Ville"],
  profession: ["Profession / Métier", "Profession / Metier", "Métier", "Metier", "Profession"],
  entreprise: ["Entreprise / École", "Entreprise / Ecole", "Entreprise", "École", "Ecole"],
  situation: ["Votre situation actuelle", "Situation actuelle", "Situation"],
  linkedIn: ["Lien LinkedIn", "LinkedIn", "Lien Linkedin", "Profil LinkedIn", "Profil Linkedin"],
  consentement: ["Souhaitez-vous apparaître dans l'annuaire des membres du Kourel ?", "Apparaître dans l'annuaire", "Apparaitre dans l'annuaire", "Consentement"],
} satisfies Record<keyof Omit<Member, "id"> | "consentement", string[]>;

export async function getMembers(): Promise<Member[]> {
  const spreadsheetId = getRequiredEnv("GOOGLE_SHEETS_ID");
  const range = process.env.GOOGLE_SHEETS_RANGE || DEFAULT_MEMBERS_RANGE;
  const accessToken = await getAccessToken();

  const url = `${GOOGLE_SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, getSheetsFetchOptions(accessToken));

  if (!response.ok) {
    throw new Error("Impossible de récupérer les membres depuis Google Sheets.");
  }

  const data = (await response.json()) as GoogleSheetsValuesResponse;
  return mapRowsToMembers(data.values ?? []);
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }

  const assertion = createJwtAssertion();
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible d'authentifier le compte de service Google.");
  }

  const token = (await response.json()) as GoogleTokenResponse;
  tokenCache = {
    accessToken: token.access_token,
    expiresAt: now + token.expires_in * 1000,
  };

  return token.access_token;
}

function getSheetsFetchOptions(accessToken: string): RequestInit & {
  next?: { revalidate: number; tags: string[] };
} {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (process.env.NODE_ENV === "development") {
    return {
      headers,
      cache: "no-store",
    };
  }

  return {
    headers,
    next: {
      revalidate: REVALIDATE_SECONDS,
      tags: ["members"],
    },
  };
}

function createJwtAssertion(): string {
  const serviceAccountEmail = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getRequiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: serviceAccountEmail,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: nowInSeconds + 3600,
    iat: nowInSeconds,
  };

  const unsignedToken = [
    base64UrlEncode(JSON.stringify(header)),
    base64UrlEncode(JSON.stringify(payload)),
  ].join(".");

  const signature = createSign("RSA-SHA256").update(unsignedToken).sign(privateKey, "base64url");

  return `${unsignedToken}.${signature}`;
}

function mapRowsToMembers(rows: string[][]): Member[] {
  const [headers = [], ...bodyRows] = rows;
  const headerIndexes = createHeaderIndexes(headers);

  return bodyRows
    .filter((row) => hasDirectoryConsent(row, headerIndexes))
    .map((row, index) => createMember(row, headerIndexes, index))
    .filter(hasMemberIdentity);
}

function createHeaderIndexes(headers: string[]): Record<string, number> {
  return headers.reduce<Record<string, number>>((indexes, header, index) => {
    indexes[normalizeHeader(header)] = index;
    return indexes;
  }, {});
}

function createMember(
  row: string[],
  headerIndexes: Record<string, number>,
  index: number,
): Member {
  const nom = getCell(row, headerIndexes, columnMap.nom);
  const prenom = getCell(row, headerIndexes, columnMap.prenom);
  const email = getCell(row, headerIndexes, columnMap.email);

  return {
    id: email.toLowerCase() || `${normalizeHeader(prenom)}-${normalizeHeader(nom)}-${index}`,
    nom,
    prenom,
    telephone: getCell(row, headerIndexes, columnMap.telephone),
    email,
    ville: getCell(row, headerIndexes, columnMap.ville),
    profession: getCell(row, headerIndexes, columnMap.profession),
    entreprise: getCell(row, headerIndexes, columnMap.entreprise),
    situation: getCell(row, headerIndexes, columnMap.situation),
    linkedIn: getCell(row, headerIndexes, columnMap.linkedIn),
  };
}

function getCell(row: string[], headerIndexes: Record<string, number>, columnNames: string[]): string {
  const index = findHeaderIndex(headerIndexes, columnNames);

  return typeof index === "number" ? (row[index] ?? "").trim() : "";
}

function findHeaderIndex(
  headerIndexes: Record<string, number>,
  columnNames: string[],
): number | undefined {
  for (const columnName of columnNames) {
    const exactIndex = headerIndexes[normalizeHeader(columnName)];

    if (typeof exactIndex === "number") {
      return exactIndex;
    }
  }

  const normalizedColumnNames = columnNames.map(normalizeHeader);
  const partialMatch = Object.entries(headerIndexes).find(([header]) =>
    normalizedColumnNames.some((columnName) => header.includes(columnName)),
  );

  return partialMatch?.[1];
}

function hasMemberIdentity(member: Member): boolean {
  return Boolean(member.nom || member.prenom || member.email);
}

function hasDirectoryConsent(row: string[], headerIndexes: Record<string, number>): boolean {
  const consent = getCell(row, headerIndexes, columnMap.consentement);

  if (!consent) {
    return false;
  }

  return ["oui", "yes", "true", "1"].includes(normalizeHeader(consent));
}

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }

  return value;
}
