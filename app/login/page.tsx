import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/");
  }

  const { error } = await searchParams;
  const isAccessDenied = error === "AccessDenied" || error === "OAuthCallback";

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole className="size-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Accès Kourel Cergy</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              L&apos;annuaire est réservé aux membres autorisés.
            </p>
          </div>
        </div>

        {isAccessDenied ? (
          <Alert variant="destructive">
            <AlertTitle>Accès refusé</AlertTitle>
            <AlertDescription>
              Cet email n&apos;est pas présent dans la Google Sheet des membres autorisés.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <form
                action={async () => {
                  "use server";

                  await signIn("google", { redirectTo: "/" });
                }}
              >
                <Button type="submit" className="h-11 w-full">
                  Continuer avec Google
                </Button>
              </form>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Seuls les emails présents dans la Google Sheet peuvent accéder à l&apos;annuaire.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
