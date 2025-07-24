import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface AnalyticsEvent {
  event: string
  timestamp: number
  userId?: string | null
  sessionId: string
  data?: Record<string, unknown>
}

interface AnalyticsMetadata {
  events: AnalyticsEvent[]
  userAgent: string
  screenWidth: number
  screenHeight: number
  firstVisit: number
  lastActivity: number
  totalSessions: number
  totalScans: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, events, metadata } = body as {
      userId: string
      events: AnalyticsEvent[]
      metadata: AnalyticsMetadata
    }

    if (!userId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 400 })
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { userId },
      update: { updatedAt: new Date() },
      create: {
        userId,
        isAnonymous: userId.startsWith('anon_'),
      },
    })

    // Process events by session
    const sessionGroups = events.reduce((acc, event) => {
      const sessionId = event.sessionId
      if (!acc[sessionId]) acc[sessionId] = []
      acc[sessionId].push(event)
      return acc
    }, {} as Record<string, AnalyticsEvent[]>)

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
      })

      // Create events for this session individually to handle JSON properly
      for (const event of sessionEvents) {
        try {
          await prisma.analyticsEvent.create({
            data: {
              event: event.event,
              timestamp: new Date(event.timestamp),
              userId: user.id,
              sessionId: session.id,
              data: JSON.parse(JSON.stringify(event.data || {})),
            }
          })
        } catch (error) {
          // Skip duplicate events silently
          console.log('Skipping duplicate event:', error)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database analytics save error:', error)
    return NextResponse.json(
      { error: 'Failed to save analytics data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin access
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('admin_key')
    
    if (adminKey !== process.env.ANALYTICS_ADMIN_KEY) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get aggregated statistics
    const totalUsers = await prisma.user.count()
    const totalSessions = await prisma.userSession.count()
    const totalEvents = await prisma.analyticsEvent.count()

    // Get total scans (events with 'scan_completed' type)
    const totalScans = await prisma.analyticsEvent.count({
      where: { event: 'scan_completed' }
    })

    // Recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - (24 * 60 * 60 * 1000))
    
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: oneDayAgo }
      },
      include: {
        user: { select: { userId: true, isAnonymous: true } },
        session: { select: { sessionId: true } }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    })

    // Event type breakdown
    const eventTypes = recentEvents.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get user summaries
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { events: true, sessions: true }
        },
        events: {
          where: { event: 'scan_completed' },
          select: { id: true }
        },
        sessions: {
          orderBy: { lastActivity: 'desc' },
          take: 1,
          select: { lastActivity: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const userSummaries = users.map(user => ({
      userId: user.userId,
      isAnonymous: user.isAnonymous,
      totalScans: user.events.length,
      totalSessions: user._count.sessions,
      totalEvents: user._count.events,
      lastActivity: user.sessions[0]?.lastActivity || user.updatedAt,
      recentEvents: recentEvents.filter(e => e.user.userId === user.userId).length,
      updatedAt: user.updatedAt
    }))

    return NextResponse.json({
      summary: {
        totalUsers,
        totalSessions,
        totalEvents,
        totalScans,
        recentEvents: recentEvents.length,
        eventTypes
      },
      users: userSummaries,
      recentActivity: recentEvents.map(event => ({
        id: event.id,
        event: event.event,
        timestamp: event.timestamp,
        userId: event.user.userId,
        isAnonymous: event.user.isAnonymous,
        sessionId: event.session.sessionId,
        data: event.data
      }))
    })
  } catch (error) {
    console.error('Database analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}