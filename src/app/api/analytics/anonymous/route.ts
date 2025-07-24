import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Simple file-based storage for anonymous analytics (no database needed)
const ANALYTICS_DIR = path.join(process.cwd(), 'data', 'analytics')
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'anonymous-users.json')

interface AnalyticsEvent {
  event?: string
  timestamp?: number
  [key: string]: unknown
}

interface AnonymousAnalytics {
  [userId: string]: {
    events: AnalyticsEvent[]
    metadata: Record<string, unknown>
    updatedAt: string
  }
}

// Ensure analytics directory exists
async function ensureAnalyticsDir() {
  try {
    await fs.access(ANALYTICS_DIR)
  } catch {
    await fs.mkdir(ANALYTICS_DIR, { recursive: true })
  }
}

// Read analytics data
async function readAnalyticsData(): Promise<AnonymousAnalytics> {
  try {
    await ensureAnalyticsDir()
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Write analytics data
async function writeAnalyticsData(data: AnonymousAnalytics) {
  await ensureAnalyticsDir()
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, events, metadata } = body

    if (!userId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 400 })
    }

    // Read existing data
    const analyticsData = await readAnalyticsData()

    // Update user's analytics data
    analyticsData[userId] = {
      events: events.slice(-50), // Keep only last 50 events
      metadata,
      updatedAt: new Date().toISOString()
    }

    // Write back to file
    await writeAnalyticsData(analyticsData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Anonymous analytics save error:', error)
    return NextResponse.json(
      { error: 'Failed to save analytics data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin access via query parameter or header for simplicity
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('admin_key')
    
    if (adminKey !== process.env.ANALYTICS_ADMIN_KEY) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const analyticsData = await readAnalyticsData()

    // Calculate aggregated statistics
    const users = Object.entries(analyticsData)
    const totalUsers = users.length
    const totalEvents = users.reduce((sum, [, user]) => sum + user.events.length, 0)
    const totalScans = users.reduce((sum, [, user]) => 
      sum + (typeof user.metadata?.totalScans === 'number' ? user.metadata.totalScans : 0), 0
    )

    // Recent activity (last 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    const recentEvents = users.flatMap(([userId, user]) => 
      user.events
        .filter(event => typeof event.timestamp === 'number' && event.timestamp > oneDayAgo)
        .map(event => ({ ...event, userId }))
    )

    // Event type breakdown
    const eventTypes = recentEvents.reduce((acc, event) => {
      const eventName = typeof event.event === 'string' ? event.event : 'unknown'
      acc[eventName] = (acc[eventName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      summary: {
        totalUsers,
        totalEvents,
        totalScans,
        recentEvents: recentEvents.length,
        eventTypes
      },
      users: users.map(([userId, user]) => ({
        userId,
        isAnonymous: userId.startsWith('anon_'),
        totalScans: typeof user.metadata?.totalScans === 'number' ? user.metadata.totalScans : 0,
        totalSessions: typeof user.metadata?.totalSessions === 'number' ? user.metadata.totalSessions : 0,
        lastActivity: user.metadata?.lastActivity,
        recentEvents: user.events.filter(event => 
          typeof event.timestamp === 'number' && event.timestamp > oneDayAgo
        ).length,
        updatedAt: user.updatedAt
      })),
      recentActivity: recentEvents
        .sort((a, b) => {
          const aTime = typeof a.timestamp === 'number' ? a.timestamp : 0
          const bTime = typeof b.timestamp === 'number' ? b.timestamp : 0
          return bTime - aTime
        })
        .slice(0, 100) // Last 100 events
    })
  } catch (error) {
    console.error('Anonymous analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}