export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" role="main" tabIndex={-1}>
      {children}
    </main>
  );
}
