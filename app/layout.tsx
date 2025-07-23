import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/UserContext";
import { UserProfile } from "@/components/UserProfile";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workers AI Image Playground",
  description:
    "Playground for generating images with Cloudflare Workers AI models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <header className="border-b bg-white/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a
                  href="/"
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  AI Image Playground
                </a>
                <UserProfile />
              </div>
            </header>
            <main>{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
