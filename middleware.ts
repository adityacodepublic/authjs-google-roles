import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_lOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/routes"
import { NextResponse } from "next/server";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) ;
  
  console.log(req.auth);

  if(isApiRoute){
    return;
  }

  if(isAuthRoute){
    if(isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_lOGIN_REDIRECT, nextUrl));
    }
    return ;
  };
  
  if(!isLoggedIn && !isPublicRoute){
    return NextResponse.redirect(new URL("/signin", nextUrl));
  };

  console.log("LoggedIn: " + isLoggedIn);
  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};