// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and any static assets
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Protect /admin/** routes
  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get("admin_demo");

    const isLoggedIn = cookie?.value === "1";
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", request.url);
      // Optional: remember where they wanted to go
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
