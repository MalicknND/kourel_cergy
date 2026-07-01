"use client";

import { SlidersHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MemberFilters = {
  ville: string;
  situation: string;
  profession: string;
};

type FiltersProps = {
  filters: MemberFilters;
  cities: string[];
  situations: string[];
  professions: string[];
  onChange: (filters: MemberFilters) => void;
};

const ALL_VALUE = "all";

export function Filters({ filters, cities, situations, professions, onChange }: FiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[auto_1fr_1fr_1fr] md:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <SlidersHorizontal className="size-4" />
        Filtres
      </div>
      <FilterSelect
        label="Ville"
        value={filters.ville}
        values={cities}
        onValueChange={(ville) => onChange({ ...filters, ville })}
      />
      <FilterSelect
        label="Situation"
        value={filters.situation}
        values={situations}
        onValueChange={(situation) => onChange({ ...filters, situation })}
      />
      <FilterSelect
        label="Métier"
        value={filters.profession}
        values={professions}
        onValueChange={(profession) => onChange({ ...filters, profession })}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  values,
  onValueChange,
}: {
  label: string;
  value: string;
  values: string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value || ALL_VALUE} onValueChange={(nextValue) => onValueChange(nextValue === ALL_VALUE ? "" : nextValue)}>
      <SelectTrigger className="h-10 w-full rounded-lg">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>Tous</SelectItem>
        {values.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

