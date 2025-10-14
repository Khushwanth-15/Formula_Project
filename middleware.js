import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/welcome",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/login",
  "/api/register",
  "/api/forgot",
  "/api/reset",
  "/favicon.ico",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  // allow Next internals and static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/assets") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }
  // public paths bypass
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    const url = new URL("/welcome", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};


