import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import authConfig  from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismadb from "./lib/prismadb"
import { getUserById } from "./actions/get-user"


export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session}) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }
      if(token.role && session.user) {
        session.user.role = token.role as string; 
      }
      return session;
    },
    async jwt({ token }) {
      if(!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;
      token.role = existingUser.role || "null"
      return token;
    }
  },
  adapter: PrismaAdapter(prismadb),
  session: {strategy: "jwt"},
  pages: {
    signIn: "/signin",
  },
  ...authConfig,
})