import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE } from "./features/auth/constants";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const isAuthenticated = Boolean(token);

  const isDashboard = url.pathname.startsWith("/dashboard");
  const isAuthPages = url.pathname.startsWith("/auth");

  if (isDashboard && !isAuthenticated) {
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuthPages && isAuthenticated) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
};
