import { NextRequest } from "next/server";
import {
  validateCloudflareJWT,
  parseCloudflareUser,
  User,
  isLocalTestingMode,
} from "@/lib/auth";

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

export function getAuthenticatedUser(request: NextRequest): User | null {
  // console.log("CF_Authorization: ", request.cookies.get("CF_Authorization"));
  // Check for local testing mode
  if (isLocalTestingMode()) {
    return {
      id: "local-test-user",
      email: "test@example.com",
      name: "Local Test User",
      picture: undefined,
    };
  }

  const authCookie = request.cookies.get("CF_Authorization");

  if (!authCookie?.value) {
    return null;
  }

  const cloudflareUser = validateCloudflareJWT(authCookie.value);

  console.log(cloudflareUser);
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

  return {
    ...request,
    user,
  } as AuthenticatedRequest;
}
