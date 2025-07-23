import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />

        {/* Accessibility meta tags */}
        <meta name="application-name" content="WiFi Guard" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Main content wrapper with proper landmark */}
        <main id="main-content" role="main" tabIndex={-1}>
          {children}
        </main>

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
  );
}
