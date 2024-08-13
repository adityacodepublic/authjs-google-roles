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
    async jwt({ token}) {
      if(!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
    async session({ token, session }) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }
      if(token.role && session.user) {
        session.user.role = token.role as string; 
      }
      return session;
    },
    async signIn(){
      revalidateTag("user");
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 1 day (6 hours)
  },

} satisfies NextAuthConfig;