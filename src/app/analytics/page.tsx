"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  Scan,
  Clock,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    totalEvents: number;
    totalScans: number;
    recentEvents: number;
    eventTypes: Record<string, number>;
  };
  users: Array<{
    userId: string;
    isAnonymous: boolean;
    totalScans: number;
    totalSessions: number;
    lastActivity: number;
    recentEvents: number;
    updatedAt: string;
  }>;
  recentActivity: Array<{
    event: string;
    timestamp: number;
    userId: string;
    sessionId: string;
    data?: Record<string, unknown>;
  }>;
}

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAnalytics();
      // Set up real-time updates every 30 seconds
      const interval = setInterval(fetchAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoaded, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics/anonymous?admin_key=wifi_guard_analytics_2025`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Show sign-in if not authenticated
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-md w-full mx-auto text-center">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              WiFi Guard Analytics
            </h1>
            <p className="text-slate-300">Admin access required</p>
          </div>
          <SignIn />
        </div>
      </div>
    );
  }

  if (loading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { summary, users, recentActivity } = analyticsData;

  // Calculate additional metrics
  const activeUsers24h = users.filter((user) => user.recentEvents > 0).length;
  const avgScansPerUser =
    users.length > 0 ? (summary.totalScans / users.length).toFixed(1) : "0";
  const mostRecentActivity = recentActivity[0];
  const eventTypeEntries = Object.entries(summary.eventTypes).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-400" />
                WiFi Guard Analytics
              </h1>
              <p className="text-slate-300">
                Real-time usage analytics and insights
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Last updated</div>
              <div className="text-white font-mono">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {summary.totalUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div className="mt-2 text-sm text-green-400">
              {activeUsers24h} active in 24h
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-white">
                  {summary.totalScans}
                </p>
              </div>
              <Scan className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {avgScansPerUser} avg per user
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">
                  {summary.totalEvents}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-2 text-sm text-blue-400">
              {summary.recentEvents} in last 24h
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Recent Activity</p>
                <p className="text-2xl font-bold text-white">
                  {summary.recentEvents}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {mostRecentActivity
                ? `${Math.round(
                    (Date.now() - mostRecentActivity.timestamp) / 60000
                  )}m ago`
                : "No recent activity"}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Types Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Event Types (24h)
            </h3>
            <div className="space-y-3">
              {eventTypeEntries.map(([event, count]) => (
                <div key={event} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {event === "scan_completed" && (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                    {event === "scan_started" && (
                      <Scan className="h-4 w-4 text-blue-400" />
                    )}
                    {event === "page_loaded" && (
                      <Eye className="h-4 w-4 text-purple-400" />
                    )}
                    {![
                      "scan_completed",
                      "scan_started",
                      "page_loaded",
                    ].includes(event) && (
                      <Clock className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-slate-300 capitalize">
                      {event.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{count}</span>
                    <div className="w-12 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (count /
                              Math.max(...eventTypeEntries.map(([, c]) => c))) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Stream */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Recent Activity
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentActivity.slice(0, 20).map((activity, index) => (
                <motion.div
                  key={`${activity.userId}-${activity.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    {activity.event === "scan_completed" && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                    {activity.event === "scan_started" && (
                      <Scan className="h-3 w-3 text-blue-400" />
                    )}
                    {activity.event === "page_loaded" && (
                      <Eye className="h-3 w-3 text-purple-400" />
                    )}
                    <span className="text-slate-300 text-sm">
                      {activity.event.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {activity.userId.startsWith("anon_")
                        ? "Anonymous"
                        : "User"}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs font-mono">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Details Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            User Activity Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">User Type</th>
                  <th className="text-left py-2 text-slate-300">Total Scans</th>
                  <th className="text-left py-2 text-slate-300">Sessions</th>
                  <th className="text-left py-2 text-slate-300">
                    Recent Events
                  </th>
                  <th className="text-left py-2 text-slate-300">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 20).map((user, index) => (
                  <motion.tr
                    key={user.userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.02 }}
                    className="border-b border-slate-700/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-2 text-slate-300">
                      <div className="flex items-center gap-2">
                        {user.isAnonymous ? (
                          <>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            Anonymous
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            Authenticated
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-white font-mono">
                      {user.totalScans}
                    </td>
                    <td className="py-2 text-white font-mono">
                      {user.totalSessions}
                    </td>
                    <td className="py-2 text-white font-mono">
                      {user.recentEvents}
                    </td>
                    <td className="py-2 text-slate-400 text-xs">
                      {user.lastActivity
                        ? new Date(user.lastActivity).toLocaleString()
                        : "No activity"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
