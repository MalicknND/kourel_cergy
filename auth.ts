import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { isAuthorizedMemberEmail } from "@/lib/google-sheets";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;

      if (!email) {
        return false;
      }

      return isAuthorizedMemberEmail(email);
    },
  },
});
