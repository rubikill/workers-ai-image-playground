import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function Footer({ variant = "default", className }: FooterProps) {
  return (
    <footer className={`text-center py-8 ${className || ""}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Amanotes Logo */}
          <div className="flex items-center justify-center mb-4">
            <Image
              src="https://pub-5d0c8d4a7da040d69056497477235539.r2.dev/amanotes-logo.png"
              alt="Amanotes"
              width={120}
              height={40}
              className="h-32 w-auto"
            />
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <p>
              Powered by{" "}
              <a
                href="https://developers.cloudflare.com/workers-ai"
                className="text-blue-600 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cloudflare Workers AI
              </a>
            </p>
            <span className="text-gray-300">•</span>
            <p>
              Source code on{" "}
              <a
                href="https://github.com/kristianfreeman/workers-ai-image-playground"
                className="text-blue-600 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
