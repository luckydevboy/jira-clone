import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "@/lib/server/appwrite";

// Define routes that require authentication
const protectedRoutes = [
  "/", // home page
  // add more protected routes here
];

// Define routes that should redirect if user is logged in
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let user = null;
  try {
    const { account } = await createSessionClient();
    user = await account.get();
  } catch {
    user = null;
  }

  // If route is protected and user is not logged in, redirect to sign-in
  if (protectedRoutes.some((route) => pathname === route)) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // If route is auth and user is logged in, redirect to home
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
