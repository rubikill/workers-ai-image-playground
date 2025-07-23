import { NextRequest } from "next/server";
import { validateCloudflareJWT, parseCloudflareUser, User } from "@/lib/auth";

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

export function getAuthenticatedUser(request: NextRequest): User | null {
  const authCookie = request.cookies.get("CF_Authorization");

  if (!authCookie?.value) {
    return null;
  }

  const cloudflareUser = validateCloudflareJWT(authCookie.value);
  if (!cloudflareUser) {
    return null;
  }

  return parseCloudflareUser(cloudflareUser);
}

export function requireAuth(request: NextRequest): AuthenticatedRequest {
  const user = getAuthenticatedUser(request);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return request as AuthenticatedRequest;
}
