# Kourel Cergy

Annuaire prive des membres du Kourel Cergy.

Le site permet de retrouver les membres, leurs metiers, leurs villes et leurs coordonnees afin de faciliter l'entraide et les opportunites professionnelles.

## Fonctionnalites

- Annuaire des membres synchronise avec Google Sheets.
- Authentification Google via Auth.js / NextAuth.
- Acces autorise uniquement si l'email Google existe dans la Google Sheet.
- Filtrage des membres selon leur consentement d'apparaitre dans l'annuaire.
- Recherche en temps reel par nom, ville, metier, entreprise et situation.
- Filtres par ville, situation et metier.
- Coordonnees masquees jusqu'au clic.
- Statistiques automatiques.
- Interface responsive avec Tailwind CSS et shadcn/ui.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Auth.js / NextAuth
- Google Sheets API

## Variables d'environnement

Creer un fichier `.env.local` a la racine du projet :

```env
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

GOOGLE_SHEETS_RANGE=
NEXT_PUBLIC_GOOGLE_FORM_URL=
```

### Google Sheets

`GOOGLE_SHEETS_ID` correspond a l'identifiant dans l'URL de la Google Sheet :

```text
https://docs.google.com/spreadsheets/d/GOOGLE_SHEETS_ID/edit
```

`GOOGLE_SERVICE_ACCOUNT_EMAIL` et `GOOGLE_PRIVATE_KEY` viennent du fichier JSON du compte de service Google.

La Google Sheet doit etre partagee avec l'email du compte de service.

`GOOGLE_SHEETS_RANGE` est optionnel. Par defaut, le site lit `A:Z`.

Exemple :

```env
GOOGLE_SHEETS_RANGE=Reponses au formulaire 1!A:Z
```

### Auth Google

L'authentification utilise Google OAuth.

Dans Google Cloud Console, creer un client OAuth de type **Application Web** puis ajouter les URI de redirection :

```text
http://localhost:3000/api/auth/callback/google
https://kourel-cergy.vercel.app/api/auth/callback/google
```

Google fournit ensuite :

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Generer `AUTH_SECRET` avec :

```bash
npm exec auth secret
```

ou :

```bash
openssl rand -base64 33
```

## Controle d'acces

Le site verifie l'email du compte Google connecte.

L'utilisateur peut acceder a l'annuaire seulement si son email est present dans la colonne :

```text
Adresse e-mail
```

Les membres affiches dans l'annuaire doivent aussi avoir accepte d'apparaitre dans la colonne :

```text
Souhaitez-vous apparaître dans l'annuaire des membres du Kourel ?
```

Reponses positives acceptees :

```text
oui
yes
true
1
```

## Lancer le projet

Installer les dependances :

```bash
npm install
```

Lancer le serveur local :

```bash
npm run dev
```

Ouvrir :

```text
http://localhost:3000
```

## Verifications

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deploiement Vercel

Ajouter les memes variables d'environnement dans Vercel :

```text
Project Settings -> Environment Variables
```

Puis redeployer le projet.

Apres deploiement, verifier que l'URI suivante est bien ajoutee dans Google Cloud OAuth :

```text
https://kourel-cergy.vercel.app/api/auth/callback/google
```

