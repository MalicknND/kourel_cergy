import { BriefcaseBusiness, GraduationCap, Handshake, SearchCheck, UsersRound } from "lucide-react";

import type { Member } from "@/types/member";
import { Card, CardContent } from "@/components/ui/card";

type StatsCardsProps = {
  members: Member[];
};

export function StatsCards({ members }: StatsCardsProps) {
  const stats = getStats(members);

  const items = [
    { label: "Membres", value: members.length, icon: UsersRound },
    { label: "Salariés", value: stats.salaries, icon: BriefcaseBusiness },
    { label: "Étudiants", value: stats.etudiants, icon: GraduationCap },
    { label: "Freelances", value: stats.freelances, icon: Handshake },
    { label: "Recherche CDI", value: stats.cdi, icon: SearchCheck },
    { label: "Recherche stage", value: stats.stage, icon: SearchCheck },
    { label: "Recherche alternance", value: stats.alternance, icon: SearchCheck },
  ];

  return (
    <section aria-label="Statistiques des membres" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {items.map((item) => (
        <Card key={item.label} className="rounded-lg">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-4" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function getStats(members: Member[]) {
  return {
    salaries: countBySituation(members, ["salari", "employe", "en poste"]),
    etudiants: countBySituation(members, ["etudiant", "étudiant", "ecole", "école"]),
    freelances: countBySituation(members, ["freelance", "independant", "indépendant"]),
    cdi: members.filter((member) => {
      const situation = normalize(member.situation);
      return situation.includes("cdi") && ["recherche", "cherche", "opportunite", "disponible"].some((keyword) =>
        situation.includes(keyword),
      );
    }).length,
    stage: countBySituation(members, ["stage"]),
    alternance: countBySituation(members, ["alternance"]),
  };
}

function countBySituation(members: Member[], keywords: string[]): number {
  return members.filter((member) => {
    const value = normalize(member.situation);
    return keywords.some((keyword) => value.includes(normalize(keyword)));
  }).length;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
