"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import type { Member } from "@/types/member";
import { Filters, type MemberFilters } from "@/components/filters";
import { MemberCard } from "@/components/member-card";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type MemberDirectoryProps = {
  members: Member[];
};

const initialFilters: MemberFilters = {
  ville: "",
  situation: "",
  profession: "",
};

export function MemberDirectory({ members }: MemberDirectoryProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<MemberFilters>(initialFilters);

  const filteredMembers = useMemo(
    () => members.filter((member) => matchesQuery(member, query) && matchesFilters(member, filters)),
    [filters, members, query],
  );

  const filterOptions = useMemo(
    () => ({
      cities: getUniqueValues(members, "ville"),
      situations: getUniqueValues(members, "situation"),
      professions: getUniqueValues(members, "profession"),
    }),
    [members],
  );

  const hasActiveFilters = Boolean(query || filters.ville || filters.situation || filters.profession);

  return (
    <section className="space-y-5">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4">
          <SearchBar value={query} onChange={setQuery} />
          <Separator />
          <Filters
            filters={filters}
            cities={filterOptions.cities}
            situations={filterOptions.situations}
            professions={filterOptions.professions}
            onChange={setFilters}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filteredMembers.length} résultat{filteredMembers.length > 1 ? "s" : ""}
        </p>
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setFilters(initialFilters);
            }}
          >
            Réinitialiser
          </Button>
        ) : null}
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Aucun membre trouvé</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Essaie une autre recherche ou retire un filtre pour afficher plus de résultats.
          </p>
        </div>
      )}
    </section>
  );
}

function matchesQuery(member: Member, query: string): boolean {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return true;
  }

  return [
    member.nom,
    member.prenom,
    member.ville,
    member.profession,
    member.entreprise,
    member.situation,
  ]
    .map(normalize)
    .some((value) => value.includes(normalizedQuery));
}

function matchesFilters(member: Member, filters: MemberFilters): boolean {
  return (
    matchesFilterValue(member.ville, filters.ville) &&
    matchesFilterValue(member.situation, filters.situation) &&
    matchesFilterValue(member.profession, filters.profession)
  );
}

function matchesFilterValue(value: string, filter: string): boolean {
  return !filter || normalize(value) === normalize(filter);
}

function getUniqueValues(members: Member[], key: keyof Pick<Member, "ville" | "situation" | "profession">): string[] {
  return Array.from(new Set(members.map((member) => member[key]).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

