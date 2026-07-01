"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-xl space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Impossible de charger l’annuaire</AlertTitle>
          <AlertDescription>
            Vérifie la configuration Google Sheets ou réessaie dans quelques instants.
          </AlertDescription>
        </Alert>
        <Button onClick={() => unstable_retry()}>Réessayer</Button>
      </div>
    </main>
  );
}

