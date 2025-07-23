"use client";

import { useUser } from "./UserContext";
import SimpleImageGenerator from "./ImageGenerator";

export default function AuthenticatedImageGenerator() {
  const { user, loading } = useUser();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sign in to Generate Images
              </h2>
              <p className="text-gray-600 mb-6">
                Please sign in with your Google account to access the AI image
                generator.
              </p>
              <a
                href="/.cloudflareaccess/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
              >
                Sign In with Google
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the image generator for authenticated users
  return (
    <div>
      <SimpleImageGenerator />
    </div>
  );
}
