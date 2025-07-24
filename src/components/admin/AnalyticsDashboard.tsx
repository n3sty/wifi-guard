"use client";

import useSWR from "swr";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Users,
  Activity,
  Shield,
  Globe,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  Zap,
  BarChart3,
} from "lucide-react";
import MetricsCards from "./MetricsCards";
import TimeSeriesChart from "./TimeSeriesChart";
import Globe3D from "./Globe3D";

// Fetcher function that imports and calls our server action
async function analyticsFetcher() {
  const { getAnalyticsData } = await import("@/lib/data-access");
  return getAnalyticsData();
}

interface AnalyticsData {
  summary: {
    totalUsers: number;
    totalSessions: number;
    totalEvents: number;
    totalScans: number;
    recentEvents: number;
    eventTypes: Record<string, number>;
    deviceStats: Record<string, number>;
  };
  timeSeriesData: {
    hourly: Array<{ hour: number; count: number; timestamp: string }>;
    daily: Array<{ day: string; count: number; timestamp: string }>;
  };
  geographicData: Array<{
    lat: number;
    lng: number;
    city: string;
    country: string;
    count: number;
    events: Array<{
      timestamp: string;
      event: string;
      userId: string;
    }>;
  }>;
  users: Array<{
    userId: string;
    isAnonymous: boolean;
    totalScans: number;
    totalSessions: number;
    totalEvents: number;
    lastActivity: string;
    recentEvents: number;
    updatedAt: string;
  }>;
  recentActivity: Array<{
    id: number;
    event: string;
    timestamp: string;
    userId: string;
    isAnonymous: boolean;
    sessionId: string;
    data: Record<string, unknown>;
  }>;
}

function LoadingState() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <motion.div
            className="rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 text-lg">
            Loading analytics dashboard...
          </p>
          <p className="text-gray-500 text-sm mt-1">Fetching real-time data</p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
      >
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
            <Zap className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-red-800 font-semibold text-lg mb-2">
            Connection Error
          </h3>
          <p className="text-red-600 text-sm mb-4">
            {error.message ||
              "Failed to load analytics data. Please check your connection and admin permissions."}
          </p>
          <button
            onClick={retry}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-500 max-w-md mx-auto"
      >
        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
          <Shield className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-gray-700 font-medium text-lg mb-2">
          No Data Available
        </h3>
        <p className="text-sm mb-4">
          Your analytics dashboard is ready, but there&apos;s no data to display
          yet. Data will appear once users start using WiFi Guard.
        </p>
        <div className="text-xs text-gray-400">
          Dashboard updates every 30 seconds automatically
        </div>
      </motion.div>
    </div>
  );
}

function RecentActivityFeed({
  recentActivity,
}: {
  recentActivity: AnalyticsData["recentActivity"];
}) {
  if (recentActivity.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No recent activity</p>
        <p className="text-xs text-gray-400 mt-1">
          Activity will appear here as users interact with WiFi Guard
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {activity.event === "scan_completed" && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                    {activity.event === "scan_started" && (
                      <Activity className="w-4 h-4 text-blue-500" />
                    )}
                    {activity.event === "page_view" && (
                      <Eye className="w-4 h-4 text-purple-500" />
                    )}
                    {activity.event === "session_start" && (
                      <Clock className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="font-medium text-gray-900 capitalize">
                      {activity.event.replace("_", " ")}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.isAnonymous
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {activity.isAnonymous ? "Anonymous" : "Registered"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  User:{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    {activity.userId}
                  </code>
                  {" • "}
                  Session:{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    {activity.sessionId.slice(0, 8)}...
                  </code>
                </div>
                {activity.data && Object.keys(activity.data).length > 0 && (
                  <details className="text-xs text-gray-500 mt-2">
                    <summary className="cursor-pointer hover:text-gray-700">
                      Event data
                    </summary>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      {JSON.stringify(activity.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              <div className="text-xs text-gray-500 ml-4 text-right">
                <div>{new Date(activity.timestamp).toLocaleTimeString()}</div>
                <div className="text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function UserSummaryTable({ users }: { users: AnalyticsData["users"] }) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No users found</p>
        <p className="text-xs text-gray-400 mt-1">
          User data will appear as people use WiFi Guard
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {users.map((user, index) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="p-4"
          >
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded"
              onClick={() =>
                setExpandedUser(
                  expandedUser === user.userId ? null : user.userId
                )
              }
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 font-mono text-sm">
                    {user.userId}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.isAnonymous
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.isAnonymous ? "Anonymous" : "Registered"}
                  </span>
                  {user.recentEvents > 0 && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{user.totalScans}</span> scans •
                  <span className="font-medium"> {user.totalSessions}</span>{" "}
                  sessions • Last active:{" "}
                  <span className="font-medium">
                    {new Date(user.lastActivity).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user.totalEvents} events
                </span>
                {expandedUser === user.userId ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {expandedUser === user.userId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50/30 rounded-r-lg p-3"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">
                      {user.totalScans}
                    </div>
                    <div className="font-medium text-gray-700">
                      Security Scans
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">
                      {user.totalSessions}
                    </div>
                    <div className="font-medium text-gray-700">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-purple-600">
                      {user.totalEvents}
                    </div>
                    <div className="font-medium text-gray-700">
                      Total Events
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-orange-600">
                      {user.recentEvents}
                    </div>
                    <div className="font-medium text-gray-700">
                      Recent Activity
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-gray-600">
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(user.updatedAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>User Type:</strong>{" "}
                    {user.isAnonymous ? "Anonymous visitor" : "Registered user"}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(
    "analytics-data",
    analyticsFetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
    }
  );

  if (error) {
    return <ErrorState error={error} retry={() => mutate()} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const { summary, users, recentActivity, timeSeriesData, geographicData } =
    data;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Analytics Command Center
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Real-time insights into WiFi Guard security scans and user behavior
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => mutate()}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </motion.button>
      </motion.div>

      {/* Metrics Cards */}
      <MetricsCards data={{ summary, timeSeriesData }} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Globe Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Global Usage Map
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Real-time geographic distribution of WiFi Guard usage
              </p>
            </div>
            <div className="relative h-96">
              <Globe3D data={geographicData} className="h-full" />
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Live Activity Feed
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Real-time user interactions and security scans
            </p>
          </div>
          <RecentActivityFeed recentActivity={recentActivity} />
        </motion.div>
      </div>

      {/* Time Series Chart */}
      <TimeSeriesChart data={timeSeriesData} />

      {/* User Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Analytics
            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              {users.length} total
            </span>
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Detailed breakdown of user behavior and engagement patterns
          </p>
        </div>
        <UserSummaryTable users={users} />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center text-gray-500 text-sm border-t border-gray-200 pt-6"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates every 30 seconds</span>
          </div>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>•</span>
          <span>WiFi Guard Admin Dashboard v2.0</span>
        </div>
      </motion.div>
    </div>
  );
}
