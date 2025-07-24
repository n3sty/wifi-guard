"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  userId?: string | null;
  sessionId: string;
  data?: Record<string, unknown>;
}

interface AnalyticsMetadata {
  events: AnalyticsEvent[];
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  firstVisit: number;
  lastActivity: number;
  totalSessions: number;
  totalScans: number;
}

export async function saveAnalyticsData(data: {
  userId: string;
  events: AnalyticsEvent[];
  metadata: AnalyticsMetadata;
}) {
  try {
    const { userId, events, metadata } = data;

    if (!userId) {
      throw new Error("No user ID provided");
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { userId },
      update: { updatedAt: new Date() },
      create: {
        userId,
        isAnonymous: userId.startsWith("anon_"),
      },
    });

    // Process events by session
    const sessionGroups = events.reduce((acc, event) => {
      const sessionId = event.sessionId;
      if (!acc[sessionId]) acc[sessionId] = [];
      acc[sessionId].push(event);
      return acc;
    }, {} as Record<string, AnalyticsEvent[]>);

    // Create sessions and events
    for (const [sessionId, sessionEvents] of Object.entries(sessionGroups)) {
      // Create or update session
      const session = await prisma.userSession.upsert({
        where: { sessionId },
        update: {
          lastActivity: new Date(),
          userAgent: metadata.userAgent,
          screenWidth: metadata.screenWidth,
          screenHeight: metadata.screenHeight,
        },
        create: {
          sessionId,
          userId: user.id,
          userAgent: metadata.userAgent,
          screenWidth: metadata.screenWidth,
          screenHeight: metadata.screenHeight,
        },
      });

      // Create events for this session
      for (const event of sessionEvents) {
        try {
          await prisma.analyticsEvent.create({
            data: {
              event: event.event,
              timestamp: new Date(event.timestamp),
              userId: user.id,
              sessionId: session.id,
              data: event.data ? JSON.parse(JSON.stringify(event.data)) : null,
            },
          });
        } catch (error) {
          // Skip duplicate events silently
          console.log("Skipping duplicate event:", error);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Database analytics save error:", error);
    throw new Error("Failed to save analytics data");
  }
}

export async function checkAdminAuth() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  if (sessionClaims?.role !== "admin") {
    throw new Error("Admin privileges required");
  }

  return { userId, isAdmin: true };
}

export async function validateAdminAccess() {
  try {
    return await checkAdminAuth();
  } catch (error) {
    console.error("Admin access validation failed:", error);
    throw error;
  }
}

export async function getAnalyticsData() {
  // Validate admin access with detailed error handling
  await validateAdminAccess();

  try {
    // Get aggregated statistics
    const totalUsers = await prisma.user.count();
    const totalSessions = await prisma.userSession.count();
    const totalEvents = await prisma.analyticsEvent.count();

    // Get total scans (events with 'scan_completed' type)
    const totalScans = await prisma.analyticsEvent.count({
      where: { event: "scan_completed" },
    });

    // Time-based queries for different periods
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get recent events for activity feed and geographic data
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        user: {
          select: {
            userId: true,
            isAnonymous: true,
          },
        },
        session: {
          select: {
            sessionId: true,
            userAgent: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 1000,
    });

    // Hourly activity for the last 24 hours
    const hourlyActivity = await prisma.analyticsEvent.groupBy({
      by: ["timestamp"],
      where: {
        timestamp: { gte: oneDayAgo },
        event: "scan_completed",
      },
      _count: { id: true },
    });

    // Process hourly data
    const hourlyStats = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      hour.setMinutes(0, 0, 0);
      const nextHour = new Date(hour.getTime() + 60 * 60 * 1000);

      const count = hourlyActivity
        .filter(
          (item) =>
            new Date(item.timestamp) >= hour &&
            new Date(item.timestamp) < nextHour
        )
        .reduce((sum, item) => sum + item._count.id, 0);

      return {
        hour: hour.getHours(),
        count,
        timestamp: hour.toISOString(),
      };
    });

    // Weekly activity for the last 7 days
    const weeklyActivity = await prisma.analyticsEvent.groupBy({
      by: ["timestamp"],
      where: {
        timestamp: { gte: oneWeekAgo },
        event: "scan_completed",
      },
      _count: { id: true },
    });

    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);

      const count = weeklyActivity
        .filter(
          (item) =>
            new Date(item.timestamp) >= day &&
            new Date(item.timestamp) < nextDay
        )
        .reduce((sum, item) => sum + item._count.id, 0);

      return {
        day: day.toLocaleDateString("en", { weekday: "short" }),
        count,
        timestamp: day.toISOString(),
      };
    });

    // Geographic data aggregation
    const geographicData = recentEvents.reduce(
      (acc, event) => {
        const location = (
          event.data as {
            location?: {
              lat?: number;
              lng?: number;
              city?: string;
              country?: string;
            };
          }
        )?.location;

        if (
          !location?.lat ||
          !location?.lng ||
          !location?.city ||
          !location?.country
        ) {
          return acc;
        }

        const key = `${location.lat},${location.lng}`;

        if (!acc[key]) {
          acc[key] = {
            lat: location.lat,
            lng: location.lng,
            city: location.city,
            country: location.country,
            count: 0,
            events: [],
          };
        }

        acc[key].count++;
        acc[key].events.push({
          timestamp: event.timestamp.toISOString(),
          event: event.event,
          userId: event.user.userId,
        });

        return acc;
      },
      {} as Record<
        string,
        {
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
        }
      >
    );

    // Event type breakdown
    const eventTypes = recentEvents.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Device/Browser breakdown from user agents
    const deviceStats = recentEvents.reduce((acc, event) => {
      const userAgent = event.session.userAgent || "";
      let device = "Unknown";

      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        device = "Mobile";
      } else if (/Tablet/.test(userAgent)) {
        device = "Tablet";
      } else {
        device = "Desktop";
      }

      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get user summaries
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { events: true, sessions: true },
        },
        events: {
          where: { event: "scan_completed" },
          select: { id: true },
        },
        sessions: {
          orderBy: { lastActivity: "desc" },
          take: 1,
          select: { lastActivity: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    const userSummaries = users.map((user) => ({
      userId: user.userId,
      isAnonymous: user.isAnonymous,
      totalScans: user.events.length,
      totalSessions: user._count.sessions,
      totalEvents: user._count.events,
      lastActivity: (
        user.sessions[0]?.lastActivity || user.updatedAt
      ).toISOString(),
      recentEvents: recentEvents.filter((e) => e.user.userId === user.userId)
        .length,
      updatedAt: user.updatedAt.toISOString(),
    }));

    return {
      summary: {
        totalUsers,
        totalSessions,
        totalEvents,
        totalScans,
        recentEvents: recentEvents.length,
        eventTypes,
        deviceStats,
      },
      timeSeriesData: {
        hourly: hourlyStats,
        daily: dailyStats,
      },
      geographicData: Object.values(geographicData),
      users: userSummaries,
      recentActivity: recentEvents.slice(0, 50).map((event) => ({
        id: parseInt(event.id),
        event: event.event,
        timestamp: event.timestamp.toISOString(),
        userId: event.user.userId,
        isAnonymous: event.user.isAnonymous,
        sessionId: event.session.sessionId,
        data: event.data as Record<string, unknown>,
      })),
    };
  } catch (error) {
    console.error("Database analytics fetch error:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

export async function getUserAnalytics(userId: string) {
  // Validate admin access for user analytics
  await validateAdminAccess();

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        events: {
          orderBy: { timestamp: "desc" },
          take: 100,
        },
        sessions: {
          orderBy: { lastActivity: "desc" },
        },
        _count: {
          select: { events: true, sessions: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      isAnonymous: user.isAnonymous,
      totalEvents: user._count.events,
      totalSessions: user._count.sessions,
      recentEvents: user.events,
      sessions: user.sessions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error("Failed to fetch user analytics");
  }
}
