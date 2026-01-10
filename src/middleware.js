import { NextResponse } from "next/server";

export function middleware(request) {
  // // Store current path-url in a special header, so that
  // // it can be accessed from server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const { nextUrl } = request;
  // Get the accessToken value
  const isLoggedIn = request.cookies.get("yalla_Dashboard_token")?.value;
  const isAuthRoute =
    nextUrl.pathname === "/login" ||
    nextUrl.pathname === "/forgot-password" ||
    nextUrl.pathname === "/otp-verification" ||
    nextUrl.pathname === "/set-new-password";
  nextUrl.pathname === "/audio/themesong.mp3" ? "" : "";
  // If user exists, redirect to `/` from `login`
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // If user not found, redirect to `/login` from protected routes
  // no redirect happen if already in `/login`
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|audio|images|fonts).*)",
    "/admin/:path*",
  ],
};
