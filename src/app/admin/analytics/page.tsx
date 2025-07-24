import { Suspense } from "react";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}
