import { Building2, ExternalLink, MapPin } from "lucide-react";

import type { Member } from "@/types/member";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactActions } from "@/components/contact-actions";
import { cn } from "@/lib/utils";

type MemberCardProps = {
  member: Member;
};

export function MemberCard({ member }: MemberCardProps) {
  const fullName = [member.prenom, member.nom].filter(Boolean).join(" ");
  const linkedInHref = toExternalHref(member.linkedIn);

  return (
    <Card className="h-full rounded-lg bg-card/95 transition-colors hover:bg-card">
      <CardHeader className="gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-11 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(member)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{fullName || "Membre du dahira"}</CardTitle>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {member.profession || "Profession non renseignée"}
            </p>
          </div>
        </div>
        <SituationBadge situation={member.situation} />
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <InfoRow icon={Building2} value={member.entreprise || "Entreprise / école non renseignée"} />
        <InfoRow icon={MapPin} value={member.ville || "Ville non renseignée"} />
        <ContactActions email={member.email} phone={member.telephone} />

        {linkedInHref ? (
          <Button asChild variant="outline" className="mt-2 w-full">
            <a href={linkedInHref} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              LinkedIn
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SituationBadge({ situation }: { situation: string }) {
  const normalized = situation.toLowerCase();
  const className = normalized.includes("cdi")
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : normalized.includes("stage")
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : normalized.includes("alternance")
        ? "bg-violet-50 text-violet-700 ring-violet-200"
        : normalized.includes("freelance")
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-secondary text-secondary-foreground ring-border";

  return (
    <Badge variant="outline" className={cn("w-fit ring-1", className)}>
      {situation || "Situation non renseignée"}
    </Badge>
  );
}

function InfoRow({
  icon: Icon,
  value,
}: {
  icon: typeof Building2;
  value: string;
}) {
  return (
    <div className="flex gap-2 text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );
}

function getInitials(member: Member): string {
  const initials = [member.prenom, member.nom]
    .filter(Boolean)
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "DA";
}

function toExternalHref(url: string): string | undefined {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return undefined;
  }

  return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
}
