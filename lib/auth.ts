interface CloudflareUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
}

// Simple JWT decoder for browser environment
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

export function validateCloudflareJWT(token: string): CloudflareUser | null {
  try {
    // Decode JWT without verification (Cloudflare handles verification)
    const decoded = decodeJWT(token) as CloudflareUser;

    if (!decoded || !decoded.sub || !decoded.email) {
      return null;
    }

    // Validate required fields
    if (!decoded.aud || !decoded.iss || !decoded.exp) {
      return null;
    }

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("JWT validation error:", error);
    return null;
  }
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export function parseCloudflareUser(cloudflareUser: CloudflareUser): User {
  return {
    id: cloudflareUser.sub,
    email: cloudflareUser.email,
    name: cloudflareUser.name,
    picture: cloudflareUser.picture,
  };
}
