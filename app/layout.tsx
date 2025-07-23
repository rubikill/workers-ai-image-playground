import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/UserContext";
import { Header } from "@/components/ui/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workers AI Image Playground",
  description:
    "Playground for generating images with Cloudflare Workers AI models",
  icons: {
    icon: "https://static.wixstatic.com/media/ccbb9c_001df7be0836457782154abbbccab0fc%7Emv2.png/v1/fill/w_192%2Ch_192%2Clg_1%2Cusm_0.66_1.00_0.01/ccbb9c_001df7be0836457782154abbbccab0fc%7Emv2.png",
  },
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
            <Header />
            <main>{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
