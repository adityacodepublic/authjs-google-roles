import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_lOGIN_REDIRECT,
  allowedCities,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiRoute = nextUrl.pathname.includes(apiAuthPrefix);
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.includes(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.includes(route)
  );

  if (isApiRoute) {
    return;
  }

  console.log(req.auth);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_lOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  console.log("LoggedIn: " + isLoggedIn);
  return;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
