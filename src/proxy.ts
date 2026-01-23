import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const publicPaths = [
    "/login",
    "/forget-password",
    "/reset-password",
    "/verify-otp",
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(`/(auth)${path}`) || pathname === path
  );

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

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
