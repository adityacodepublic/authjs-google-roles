import "server-only";

import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { revalidateTag } from "next/cache";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prismadb from "./lib/prismadb";
import { getUserById } from "./actions/auth-config-actions";

// v2
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prismadb),
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (existingUser === false) {
        token.role = "invalid";
        console.log("signed out in the auth config");
        return token;
      } // user not found
      if (existingUser === null) return token; // edge error null
      token.role = existingUser.role;
      return token;
    },
    async session({ token, session }) {
      // if(token.sub && session.user) {
      //   session.user.id = token.sub;
      // }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn() {
      revalidateTag("user");
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  ...authConfig,
});
