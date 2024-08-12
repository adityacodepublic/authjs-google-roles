import { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismadb from "./lib/prismadb"
import { getUserById } from "./actions/get-user"
import { revalidateTag } from "next/cache"


export default {
  providers: [Google],
  adapter: PrismaAdapter(prismadb),
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
      if(!existingUser) {token.role="null"; return token};
      token.role = existingUser.role
      return token;
    },
    async signIn(){
      revalidateTag("user");
      return true;
    },
  },
  session: {strategy: "jwt"},

} satisfies NextAuthConfig;