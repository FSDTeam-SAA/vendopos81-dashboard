import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/forget-password",
    "/reset-password",
    "/verify-otp",
  ];
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(`/(auth)${path}`) || pathname === path,
  );

  // If user is authenticated and tries to access auth pages
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is not authenticated and tries to access protected paths
  if (!token && !isPublicPath && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|images|public|favicon.ico).*)",
  ],
};
