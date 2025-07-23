"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  validateCloudflareJWT,
  parseCloudflareUser,
  User,
  isLocalTestingMode,
} from "@/lib/auth";

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for CF_Authorization cookie on client side
    const checkAuth = () => {
      // Check for local testing mode first
      if (isLocalTestingMode()) {
        const testToken = process.env.NEXT_PUBLIC_LOCAL_TEST_TOKEN;
        if (testToken) {
          const cloudflareUser = validateCloudflareJWT(testToken);
          if (cloudflareUser) {
            setUser(parseCloudflareUser(cloudflareUser));
          }

          console.log("cloudflareUser: ", cloudflareUser);
        }
        setLoading(false);
        return;
      }

      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("CF_Authorization=")
      );

      if (authCookie) {
        const token = authCookie.split("=")[1];
        const cloudflareUser = validateCloudflareJWT(token);
        if (cloudflareUser) {
          setUser(parseCloudflareUser(cloudflareUser));
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    // Handle local testing mode
    if (isLocalTestingMode()) {
      setUser(null);
      return;
    }

    // Clear CF_Authorization cookie
    document.cookie =
      "CF_Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "CF_Binding=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "CF_AppSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear user state
    setUser(null);

    // Redirect to Cloudflare Access logout
    window.location.href = "/.cloudflareaccess/logout";
  };

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
