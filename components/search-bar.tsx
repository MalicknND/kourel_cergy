"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="Rechercher un membre"
        className="h-12 rounded-lg bg-background pl-9 text-base font-medium shadow-xs"
        placeholder="Rechercher par nom, ville, métier, entreprise..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
