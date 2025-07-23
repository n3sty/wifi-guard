/**
 * Animation configurations and variants for WiFi Guard
 * Following Motion.dev best practices for performance and accessibility
 */

import { Variants, Transition } from 'framer-motion'

// Base transition configurations following 2024 UX animation best practices
// Optimized for 60fps performance and natural motion feel
export const transitions = {
  // Enhanced spring physics for more natural movement
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
  
  // Refined easing curves for smooth UI interactions (600-800ms sweet spot)
  smooth: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1], // Custom bezier for more natural feel
  },
  
  // Micro-interactions (under 300ms for responsiveness)
  quick: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1], // Material Design easing
  },
  
  // Loading states - optimized for perceived performance
  loading: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  
  // Dramatic reveals with better pacing
  dramatic: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1], // Ease-out-expo for satisfying reveals
  },
  
  // Coordinated orchestration timing
  stagger: {
    staggerChildren: 0.08, // Reduced for snappier feel
    delayChildren: 0.1,
  },
  
  // Bounce effect for engaging interactions
  bounce: {
    type: "spring" as const,
    stiffness: 600,
    damping: 15,
    mass: 0.8,
  },
} as const

// Page-level animation variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ...transitions.dramatic,
      ...transitions.stagger,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: transitions.quick,
  },
}

// Header animation with floating effect
export const headerVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: -50,
    scale: 0.9,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: transitions.dramatic,
  },
}

// Enhanced button states following anticipation principle
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
    boxShadow: "0 8px 25px rgba(0, 212, 255, 0.25)",
  },
  hover: {
    scale: 1.03,
    y: -3,
    boxShadow: "0 20px 45px rgba(0, 212, 255, 0.4)",
    transition: {
      ...transitions.quick,
      scale: { duration: 0.2, ease: "easeOut" },
      y: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  tap: {
    scale: 0.97,
    y: -1,
    transition: { duration: 0.1, ease: "easeInOut" },
  },
  loading: {
    scale: 1,
    y: 0,
    transition: { ...transitions.spring, duration: 0.4 },
  },
  success: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
}

// Enhanced loading orchestration with better staging
export const loadingContainerVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.4, ease: "easeOut" },
      scale: { ...transitions.spring, delay: 0.1 },
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
}

// Enhanced loading elements with follow-through principle
export const loadingElementVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.3, ease: "easeOut" },
      scale: { ...transitions.bounce, delay: 0.1 },
      y: { ...transitions.spring, delay: 0.15 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -5,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
}

// Enhanced spinner animation with better perceived performance
export const spinnerVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.3,
    rotate: -90,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      opacity: { ...transitions.loading, delay: 0.1 },
      scale: { ...transitions.bounce, delay: 0.1 },
      rotate: {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const,
        repeatDelay: 0,
      },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    rotate: 90,
    transition: { ...transitions.quick, duration: 0.25 },
  },
}

// Enhanced message cycling with anticipation principle
export const messageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.3, ease: "easeOut" },
      y: { ...transitions.bounce, delay: 0.05 },
      scale: { ...transitions.spring, delay: 0.1 },
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

// Enhanced results reveal with better staging
export const resultsContainerVariants: Variants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.92,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.4, ease: "easeOut" },
      y: { ...transitions.bounce, delay: 0.1 },
      scale: { ...transitions.spring, delay: 0.2 },
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
}

// Individual result item animations
export const resultItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
}

// Enhanced status icon animations with better anticipation
export const statusIconVariants: Variants = {
  initial: {
    scale: 0,
    rotate: -90,
    opacity: 0,
  },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      scale: { ...transitions.bounce, delay: 0.3 },
      rotate: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
      opacity: { duration: 0.3, ease: "easeOut", delay: 0.1 },
    },
  },
  pulse: {
    scale: [1, 1.08, 1],
    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  success: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
}

// Expandable content animations
export const expandVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    scaleY: 0,
    originY: 0,
  },
  expanded: {
    opacity: 1,
    height: "auto",
    scaleY: 1,
    transition: {
      ...transitions.smooth,
      height: {
        duration: 0.4,
      },
      opacity: {
        delay: 0.1,
        duration: 0.2,
      },
    },
  },
}

// Background particle animation
export const particleVariants: Variants = {
  float: {
    y: [0, -20, 0],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
}

// Enhanced security check item animations
export const checkItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -40,
    scale: 0.92,
    filter: 'blur(4px)',
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      opacity: { duration: 0.4, ease: "easeOut", delay: index * 0.08 },
      x: { ...transitions.bounce, delay: index * 0.08 + 0.1 },
      scale: { ...transitions.spring, delay: index * 0.08 + 0.15 },
      filter: { duration: 0.4, ease: "easeOut", delay: index * 0.08 + 0.2 },
    },
  }),
  hover: {
    scale: 1.02,
    x: 8,
    boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)',
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

// Accessibility utilities
export const reduceMotionVariants = {
  // Static versions for users who prefer reduced motion
  static: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.1 },
  },
}

// Animation presets for different states
export const animationPresets = {
  // Safe state - gentle, reassuring
  safe: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        ...transitions.spring,
        stiffness: 200,
        damping: 25,
      },
    },
  },
  
  // Warning state - attention-getting but not alarming
  warning: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: transitions.smooth,
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  },
  
  // Danger state - urgent, immediate attention
  danger: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        ...transitions.spring,
        stiffness: 400,
        damping: 20,
      },
    },
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
  },
} as const

// New enhanced variants for better UX
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.3, ease: "easeOut" },
      y: { ...transitions.spring, delay: 0.1 },
      scale: { ...transitions.bounce, delay: 0.15 },
    },
  },
  hover: {
    y: -2,
    scale: 1.01,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    transition: transitions.quick,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.25, ease: "easeIn" },
  },
}

export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.3,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...transitions.bounce,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.75,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.2, ease: "easeOut" },
      scale: { ...transitions.bounce, delay: 0.1 },
      y: { ...transitions.spring, delay: 0.15 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
}

export const overlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
}

// Performance-optimized variants for reduced motion users
export const reducedMotionSafeVariants = {
  button: {
    initial: { opacity: 0.9 },
    hover: { opacity: 1 },
    tap: { opacity: 0.8 },
  },
  card: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  message: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
}

// Export all animation configurations
export {
  type Variants,
  type Transition,
}