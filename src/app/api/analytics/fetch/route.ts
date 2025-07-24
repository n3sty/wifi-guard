import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

interface AnalyticsEvent {
  event: string
  timestamp: number
  [key: string]: unknown
}

interface UserAnalytics {
  events: AnalyticsEvent[]
  totalScans: number
  totalSessions: number
  lastActivity?: string
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerk = await clerkClient()
    
    // Check if user has admin privileges (you can customize this check)
    const user = await clerk.users.getUser(userId)
    const isAdmin = user.publicMetadata.role === 'admin' || 
                   user.emailAddresses.some(email => 
                     email.emailAddress.includes('admin') || 
                     email.emailAddress.includes(process.env.ADMIN_EMAIL || 'admin@example.com')
                   )

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch analytics data from all users
    const allUsers = await clerk.users.getUserList({
      limit: 500, // Adjust as needed
      orderBy: '-created_at'
    })

    const analyticsData = allUsers.data
      .map(user => ({
        userId: user.id,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        analytics: (user.privateMetadata.analytics as UserAnalytics) || null
      }))
      .filter(user => user.analytics) // Only include users with analytics data

    // Aggregate statistics
    const totalUsers = analyticsData.length
    const totalEvents = analyticsData.reduce((sum, user) => 
      sum + (user.analytics?.events?.length || 0), 0
    )
    const totalScans = analyticsData.reduce((sum, user) => 
      sum + (user.analytics?.totalScans || 0), 0
    )

    // Recent activity (last 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    const recentEvents = analyticsData.flatMap(user => 
      (user.analytics?.events || []).filter((event: AnalyticsEvent) => 
        event.timestamp > oneDayAgo
      )
    )

    // Event type breakdown
    const eventTypes = recentEvents.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
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
      users: analyticsData.map(user => ({
        userId: user.userId,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        totalScans: user.analytics?.totalScans || 0,
        totalSessions: user.analytics?.totalSessions || 0,
        lastActivity: user.analytics?.lastActivity,
        recentEvents: (user.analytics?.events || [])
          .filter((event: AnalyticsEvent) => event.timestamp > oneDayAgo)
          .length
      })),
      recentActivity: recentEvents
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 100) // Last 100 events
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}