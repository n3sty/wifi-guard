// Enhanced analytics with Clerk integration for anonymous user tracking
// This tracks usage patterns without collecting personal data

import { useUser } from '@clerk/nextjs'
import React from 'react'

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

class EnhancedAnalytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string | null = null
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadStoredEvents()
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Set user ID when available (from anonymous Clerk session)
  setUserId(userId: string | null): void {
    this.userId = userId
  }

  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('wifi_security_analytics')
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch {
      // Silent fail - analytics should never break the app
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('wifi_security_analytics', JSON.stringify(this.events))
    } catch {
      // Silent fail
    }
  }

  // Save analytics data to backend storage using Server Actions
  private async saveToBackend(): Promise<void> {
    if (!this.userId) return
    
    try {
      // Import the server action dynamically to avoid bundling issues
      const { saveAnalyticsData } = await import('@/lib/data-access')
      
      await saveAnalyticsData({
        userId: this.userId,
        events: this.events,
        metadata: this.generateMetadata()
      })
    } catch (error) {
      console.error('Error saving analytics to database:', error)
    }
  }

  private generateMetadata(): AnalyticsMetadata {
    const now = Date.now()
    const summary = this.getEventSummary()
    
    return {
      events: this.events,
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      firstVisit: this.events[0]?.timestamp || now,
      lastActivity: now,
      totalSessions: new Set(this.events.map(e => e.sessionId)).size,
      totalScans: summary.totalScans
    }
  }

  track(event: string, data?: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      data: {
        ...data,
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      }
    }
    
    this.events.push(analyticsEvent)
    this.saveEvents()
    
    // Save to backend for persistence (debounced)
    this.debouncedSaveToBackend()
    
    // Keep only last 100 events locally to avoid storage bloat
    if (this.events.length > 100) {
      this.events = this.events.slice(-100)
      this.saveEvents()
    }
  }

  // Debounced save to avoid too many API calls
  private saveToBackendTimeout: NodeJS.Timeout | null = null
  private debouncedSaveToBackend(): void {
    if (this.saveToBackendTimeout) {
      clearTimeout(this.saveToBackendTimeout)
    }
    
    this.saveToBackendTimeout = setTimeout(() => {
      this.saveToBackend()
    }, 2000) // Wait 2 seconds after last event
  }

  getSessionEvents(): AnalyticsEvent[] {
    return this.events.filter(event => 
      event.sessionId === this.sessionId
    )
  }

  getAllEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getEventSummary(): {
    totalScans: number
    scanResults: Record<string, number>
    featuresUsed: Record<string, number>
    sessionDuration: number
  } {
    const sessionEvents = this.getSessionEvents()
    const scanResults: Record<string, number> = {}
    const featuresUsed: Record<string, number> = {}
    
    let totalScans = 0
    
    sessionEvents.forEach(event => {
      switch (event.event) {
        case 'scan_completed':
          totalScans++
          const result = typeof event.data?.result === 'string' ? event.data.result : 'unknown'
          scanResults[result] = (scanResults[result] || 0) + 1
          break
        case 'show_details_clicked':
        case 'show_education_clicked':
        case 'scan_started':
          featuresUsed[event.event] = (featuresUsed[event.event] || 0) + 1
          break
      }
    })
    
    const sessionStart = sessionEvents[0]?.timestamp || Date.now()
    const sessionDuration = Date.now() - sessionStart
    
    return {
      totalScans,
      scanResults,
      featuresUsed,
      sessionDuration
    }
  }

  // For user testing - export data for analysis
  exportForTesting(): string {
    const summary = this.getEventSummary()
    const events = this.getSessionEvents()
    
    return JSON.stringify({
      summary,
      events,
      exportedAt: new Date().toISOString()
    }, null, 2)
  }

  clearData(): void {
    this.events = []
    this.saveEvents()
  }
}

// Create singleton instance
export const analytics = new EnhancedAnalytics()

// React hook for setting up analytics with anonymous tracking
export const useAnalytics = () => {
  const { user } = useUser()
  
  React.useEffect(() => {
    // Get or create anonymous ID
    let anonymousId = localStorage.getItem('wifi_guard_anonymous_id')
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('wifi_guard_anonymous_id', anonymousId)
    }
    
    // Use Clerk user ID if available, otherwise use anonymous ID
    const userId = user?.id || anonymousId
    analytics.setUserId(userId)
    
    // Track page load with user context
    analytics.track('page_loaded', {
      hasUser: !!user,
      userType: user ? 'authenticated' : 'anonymous',
      isAnonymous: !user
    })
  }, [user])
  
  return analytics
}

// Convenience tracking functions
export const trackScanStarted = () => analytics.track('scan_started')
export const trackScanCompleted = (result: string, checksData?: unknown) => 
  analytics.track('scan_completed', { result, checksData })
export const trackShowDetails = () => analytics.track('show_details_clicked')
export const trackShowEducation = () => analytics.track('show_education_clicked')
export const trackPageLoad = () => analytics.track('page_loaded')
export const trackScanAgain = () => analytics.track('scan_again_clicked')