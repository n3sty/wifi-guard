// Simple client-side analytics for user testing
// This tracks usage patterns without collecting personal data

interface AnalyticsEvent {
  event: string
  timestamp: number
  data?: Record<string, unknown>
}

class SimpleAnalytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadStoredEvents()
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
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

  track(event: string, data?: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      data: {
        ...data,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      }
    }
    
    this.events.push(analyticsEvent)
    this.saveEvents()
    
    // Keep only last 100 events to avoid storage bloat
    if (this.events.length > 100) {
      this.events = this.events.slice(-100)
      this.saveEvents()
    }
  }

  getSessionEvents(): AnalyticsEvent[] {
    return this.events.filter(event => 
      event.data?.sessionId === this.sessionId
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
export const analytics = new SimpleAnalytics()

// Convenience tracking functions
export const trackScanStarted = () => analytics.track('scan_started')
export const trackScanCompleted = (result: string, checksData?: unknown) => 
  analytics.track('scan_completed', { result, checksData })
export const trackShowDetails = () => analytics.track('show_details_clicked')
export const trackShowEducation = () => analytics.track('show_education_clicked')
export const trackPageLoad = () => analytics.track('page_loaded')
export const trackScanAgain = () => analytics.track('scan_again_clicked')