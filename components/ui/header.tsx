import Image from "next/image";
import Link from "next/link";
import { UserProfile } from "@/components/UserProfile";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={`border-b bg-white/80 backdrop-blur-sm ${className || ""}`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          {/* AMA Logo */}
          <Image
            src="/ama-logo-main.png"
            alt="AMA"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Image Playground
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Generator
            </Link>
            <Link
              href="/images"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Gallery
            </Link>
          </nav>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
