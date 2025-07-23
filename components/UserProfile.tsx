"use client";

import { useUser } from "./UserContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function UserProfile() {
  const { user, loading, logout } = useUser();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.email}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.email}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-gray-500 hover:text-gray-700"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
