import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    
    // If no user ID from auth, try to get it from request body (for anonymous users)
    const targetUserId = userId || body.userId
    
    if (!targetUserId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 400 })
    }

    const { events, metadata } = body
    const clerk = await clerkClient()

    // Update user's private metadata with analytics data
    await clerk.users.updateUserMetadata(targetUserId, {
      privateMetadata: {
        analytics: {
          ...metadata,
          events: events.slice(-50), // Keep only last 50 events to avoid size limits
          updatedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics save error:', error)
    return NextResponse.json(
      { error: 'Failed to save analytics data' },
      { status: 500 }
    )
  }
}