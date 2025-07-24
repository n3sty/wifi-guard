'use client'

import { useState, useEffect } from 'react'

export const useAnonymousUser = () => {
  const [anonymousId, setAnonymousId] = useState<string | null>(null)

  useEffect(() => {
    // Get or create anonymous user ID
    let anonId = localStorage.getItem('wifi_guard_anonymous_id')
    
    if (!anonId) {
      anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('wifi_guard_anonymous_id', anonId)
    }
    
    setAnonymousId(anonId)
  }, [])

  return { anonymousId, isLoaded: anonymousId !== null }
}