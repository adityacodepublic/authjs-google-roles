import "server-only";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// v2
export default {
  providers: [Google],
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthConfig;
