import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WiFi Guard - One-Click Network Security Check",
  description:
    "Instantly check if your WiFi connection is safe. Simple, fast security analysis for public networks.",
  keywords: [
    "WiFi security",
    "network safety",
    "public WiFi",
    "cybersecurity",
    "mobile security",
  ],
  authors: [{ name: "WiFi Guard Team" }],
  creator: "WiFi Guard",
  publisher: "WiFi Guard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "WiFi Guard - One-Click Network Security Check",
    description:
      "Instantly check if your WiFi connection is safe. Simple, fast security analysis for public networks.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WiFi Guard - One-Click Network Security Check",
    description:
      "Instantly check if your WiFi connection is safe. Simple, fast security analysis for public networks.",
  },
  other: {
    "theme-color": "#3b82f6",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "WiFi Guard",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} antialiased min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200 w-full`}
        >
          <div className="w-full">
            {/* Main content wrapper with proper landmark */}
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
          </div>
          {/* Live region for announcements */}
          <div
            id="announcements"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />

          {/* Status region for loading states */}
          <div
            id="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
