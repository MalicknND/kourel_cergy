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
    <main className="min-h-svh bg-background">
      <div className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
            Kourel Cergy
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Annuaire du Kourel
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                Retrouvez facilement les membres du Kourel, leurs métiers et
                leurs coordonnées afin de favoriser l&apos;entraide et les
                opportunités professionnelles.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/80 shadow-sm">
              Données synchronisées depuis Google Sheets.
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <StatsCards members={members} />
        <AboutDirectory formUrl={formUrl} />
        <Separator />

        {members.length > 0 ? (
          <MemberDirectory members={members} />
        ) : (
          <Alert>
            <AlertTitle>Aucun membre pour le moment</AlertTitle>
            <AlertDescription>
              Les données Google Sheets sont accessibles, mais aucune ligne
              exploitable n&apos;a été trouvée.
            </AlertDescription>
          </Alert>
        )}

        <footer className="border-t py-6 text-center text-sm font-medium text-muted-foreground">
          Annuaire du Kourel - Fait pour faciliter l&apos;entraide et les
          opportunités.
        </footer>
      </div>
    </main>
  );
}
