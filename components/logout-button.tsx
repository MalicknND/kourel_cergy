import { LogOut } from "lucide-react";

import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";

        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button
        type="submit"
        variant="secondary"
        className="h-10 border border-white/15 bg-white/10 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
      >
        <LogOut className="size-4" />
        Se déconnecter
      </Button>
    </form>
  );
}
