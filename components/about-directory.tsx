import { FilePenLine, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AboutDirectoryProps = {
  formUrl?: string;
};

export function AboutDirectory({ formUrl }: AboutDirectoryProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
      <Card className="rounded-lg bg-card/95 shadow-sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Un annuaire réservé aux membres consentants</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Seules les personnes ayant accepté d&apos;apparaître dans l&apos;annuaire sont affichées. Les
              coordonnées restent masquées jusqu&apos;à l&apos;action volontaire d&apos;un visiteur.
            </p>
          </div>
        </CardContent>
      </Card>

      {formUrl ? (
        <Button asChild className="h-11 justify-center">
          <a href={formUrl} target="_blank" rel="noreferrer">
            <FilePenLine className="size-4" />
            Mettre à jour mes informations
          </a>
        </Button>
      ) : null}
    </section>
  );
}
