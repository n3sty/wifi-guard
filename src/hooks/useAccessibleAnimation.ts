/**
 * Enhanced accessibility hook for animations following Motion.dev best practices
 * Respects user preferences and provides fallbacks for reduced motion
 * Includes mobile-first responsive design and screen reader support
 */

import { useReducedMotion } from 'framer-motion'
import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import { Variants, Transition } from 'framer-motion'

interface AccessibleAnimationConfig {
  variants: Variants
  transition?: Transition
  respectReducedMotion?: boolean
  mobileOptimized?: boolean
}

interface AccessibleAnimationResult {
  variants: Variants
  transition?: Transition | undefined
  shouldAnimate: boolean
}

interface ScreenReaderAnnouncement {
  message: string
  priority?: 'polite' | 'assertive'
  id?: string
}

/**
 * Hook that adapts animations based on user accessibility preferences
 * @param config Animation configuration object
 * @returns Adapted animation configuration
 */
export function useAccessibleAnimation({
  variants,
  transition,
  respectReducedMotion = true,
  mobileOptimized = true,
}: AccessibleAnimationConfig): AccessibleAnimationResult {
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = !shouldReduceMotion || !respectReducedMotion

  const accessibleVariants = useMemo(() => {
    if (shouldReduceMotion && respectReducedMotion) {
      // Return performance-optimized variants for reduced motion users
      // Maintain visual feedback while minimizing motion
      return {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: { duration: 0.15, ease: "easeOut" as const }
        },
        exit: { 
          opacity: 0,
          transition: { duration: 0.1, ease: "easeIn" as const }
        },
        hover: {
          opacity: 0.9,
          transition: { duration: 0.1 }
        },
        tap: {
          opacity: 0.8,
          transition: { duration: 0.05 }
        }
      } as Variants
    }
    
            // Mobile-optimized variants for better performance on mobile devices
        if (mobileOptimized) {
          return {
            ...variants,
            // Optimize for mobile performance
            animate: {
              ...variants.animate,
              transition: {
                // Reduce complexity on mobile
                type: "tween" as const,
                ease: "easeOut" as const,
              }
            }
          }
        }
    
    return variants
  }, [shouldReduceMotion, respectReducedMotion, variants, mobileOptimized])

  const accessibleTransition = useMemo(() => {
    if (shouldReduceMotion && respectReducedMotion && transition) {
      // Optimize transitions for reduced motion while maintaining usability feedback
      const optimizedTransition: Transition = {
        ...transition,
        duration: typeof transition.duration === 'number' ? Math.min(transition.duration * 0.3, 0.2) : 0.15,
        delay: typeof transition.delay === 'number' ? Math.min(transition.delay * 0.2, 0.05) : 0,
        ease: 'easeOut' as const,
      }
      return optimizedTransition
    }
    return transition
  }, [shouldReduceMotion, respectReducedMotion, transition])

  const result: AccessibleAnimationResult = {
    variants: accessibleVariants,
    transition: accessibleTransition,
    shouldAnimate,
  }
  
  return result
}

/**
 * Hook for conditionally applying animations based on user preferences
 * @param normalAnimation Animation for users with motion enabled
 * @param reducedAnimation Optional animation for reduced motion users
 * @returns Appropriate animation configuration
 */
export function useConditionalAnimation<T>(
  normalAnimation: T,
  reducedAnimation?: T
): T {
  const shouldReduceMotion = useReducedMotion()
  
  return useMemo(() => {
    if (shouldReduceMotion) {
      return reducedAnimation ?? normalAnimation
    }
    return normalAnimation
  }, [shouldReduceMotion, normalAnimation, reducedAnimation])
}

/**
 * Hook for managing focus during animations
 * Ensures proper focus management for screen readers
 */
export function useFocusManagement() {
  const shouldReduceMotion = useReducedMotion()
  
  const focusAfterAnimation = useMemo(() => {
    // For reduced motion users, focus immediately
    // For others, add slight delay to allow animation to complete
    return shouldReduceMotion ? 0 : 300
  }, [shouldReduceMotion])

  const handleFocusAfterAnimation = useCallback((element: HTMLElement | null, delay?: number) => {
    const focusDelay = delay ?? focusAfterAnimation
    
    if (element) {
      setTimeout(() => {
        element.focus()
      }, focusDelay)
    }
  }, [focusAfterAnimation])

  return { handleFocusAfterAnimation, focusDelay: focusAfterAnimation }
}

/**
 * Hook for creating animation configurations that automatically adapt to accessibility needs
 * @param baseConfig Base animation configuration
 * @returns Accessibility-adapted configuration
 */
export function useAdaptiveAnimation(baseConfig: {
  variants: Variants
  transition?: Transition
  initial?: string | object
  animate?: string | object
  exit?: string | object
}) {
  const shouldReduceMotion = useReducedMotion()
  
  return useMemo(() => {
    if (shouldReduceMotion) {
      return {
        ...baseConfig,
        variants: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
        transition: { duration: 0.1 },
      }
    }
    
    return baseConfig
  }, [shouldReduceMotion, baseConfig])
}

/**
 * Hook for screen reader announcements
 * Provides a way to announce important changes to screen readers
 */
export function useScreenReaderAnnouncement() {
  const announcementsRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const announce = useCallback(({ message, priority = 'polite', id }: ScreenReaderAnnouncement) => {
    const targetRef = priority === 'assertive' ? announcementsRef : statusRef
    const target = targetRef.current
    
    if (target) {
      // Clear previous content
      target.textContent = ''
      
      // Add new announcement
      const announcement = document.createElement('div')
      announcement.textContent = message
      if (id) {
        announcement.id = id
      }
      target.appendChild(announcement)
      
      // Remove after a delay to allow screen reader to process
      setTimeout(() => {
        if (target.contains(announcement)) {
          target.removeChild(announcement)
        }
      }, 1000)
    }
  }, [])

  return { announce, announcementsRef, statusRef }
}

/**
 * Hook for mobile device detection and optimization
 */
export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsLandscape(width > height)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return { isMobile, isTablet, isLandscape }
}

/**
 * Hook for touch interaction optimization
 */
export function useTouchOptimization() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouchDevice()
  }, [])

  return { isTouchDevice }
}

/**
 * Hook for high contrast mode detection
 */
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const checkHighContrast = () => {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)')
      setIsHighContrast(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setIsHighContrast(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    checkHighContrast()
  }, [])

  return { isHighContrast }
}

/**
 * Hook for managing loading states with accessibility
 */
export function useAccessibleLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const { announce } = useScreenReaderAnnouncement()

  const startLoading = useCallback((message = 'Loading...') => {
    setIsLoading(true)
    announce({ message, priority: 'polite' })
  }, [announce])

  const stopLoading = useCallback((message = 'Loading complete') => {
    setIsLoading(false)
    announce({ message, priority: 'polite' })
  }, [announce])

  return { isLoading, startLoading, stopLoading, setIsLoading }
}

export default useAccessibleAnimation