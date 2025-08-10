import SecurityChecker from '@/components/security-checker'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <SecurityChecker />
    </div>
  );
}
