import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-6">
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
    </>
  );
}
