import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateCloudflareJWT, parseCloudflareUser } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Skip auth for public routes and static assets
  if (
    request.nextUrl.pathname.startsWith("/api/public") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get CF_Authorization cookie
  const authCookie = request.cookies.get("CF_Authorization");

  if (!authCookie?.value) {
    // Redirect to Cloudflare Access login
    return NextResponse.redirect(new URL("/.cloudflareaccess/", request.url));
  }

  // Validate JWT token
  const cloudflareUser = validateCloudflareJWT(authCookie.value);

  if (!cloudflareUser) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL("/.cloudflareaccess/", request.url));
  }

  // Parse user data
  const user = parseCloudflareUser(cloudflareUser);

  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-name", user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/api/((?!public).*)",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
