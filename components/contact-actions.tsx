"use client";

import { useState } from "react";
import { Eye, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

type ContactActionsProps = {
  email: string;
  phone: string;
};

export function ContactActions({ email, phone }: ContactActionsProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const hasContact = Boolean(email || phone);

  if (!hasContact) {
    return <p className="text-sm text-muted-foreground">Coordonnées non renseignées</p>;
  }

  if (!isRevealed) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setIsRevealed(true)}
      >
        <Eye className="size-4" />
        Afficher les coordonnées
      </Button>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {phone ? (
        <Button asChild variant="secondary" className="justify-start overflow-hidden">
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
            <Phone className="size-4 shrink-0" />
            <span className="truncate">{phone}</span>
          </a>
        </Button>
      ) : null}
      {email ? (
        <Button asChild variant="secondary" className="justify-start overflow-hidden">
          <a href={`mailto:${email}`}>
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{email}</span>
          </a>
        </Button>
      ) : null}
    </div>
  );
}

