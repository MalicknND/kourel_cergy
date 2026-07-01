import { AboutDirectory } from "@/components/about-directory";
import { MemberDirectory } from "@/components/member-directory";
import { StatsCards } from "@/components/stats-cards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getMembers } from "@/services/members";

export default async function Home() {
  const members = await getMembers();
  const formUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;

  return (
    <main className="min-h-svh bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-5">
          <div className="inline-flex rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
            Kourel Cergy
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Annuaire du Dahira
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Retrouvez facilement les membres du dahira, leurs métiers et leurs coordonnées afin de
                favoriser l&apos;entraide et les opportunités professionnelles.
              </p>
            </div>
            <div className="rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
              Données synchronisées depuis Google Sheets.
            </div>
          </div>
        </header>

        <StatsCards members={members} />
        <AboutDirectory formUrl={formUrl} />
        <Separator />

        {members.length > 0 ? (
          <MemberDirectory members={members} />
        ) : (
          <Alert>
            <AlertTitle>Aucun membre pour le moment</AlertTitle>
            <AlertDescription>
              Les données Google Sheets sont accessibles, mais aucune ligne exploitable n&apos;a été trouvée.
            </AlertDescription>
          </Alert>
        )}

        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          Annuaire du Dahira - Fait pour faciliter l&apos;entraide et les opportunités.
        </footer>
      </div>
    </main>
  );
}
