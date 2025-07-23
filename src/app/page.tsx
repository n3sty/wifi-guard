import SecurityChecker from "@/components/security-checker";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200"
      role="application"
      aria-label="WiFi Guard Network Security Scanner"
    >
      <SecurityChecker />
    </div>
  );
}
