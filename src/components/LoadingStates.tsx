/**
 * Reusable loading state components following Motion.dev best practices
 * Provides sophisticated loading animations with accessibility support
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  loadingContainerVariants,
  loadingElementVariants,
  spinnerVariants,
  messageVariants
} from '@/lib/animations'
import { useAccessibleAnimation } from '@/hooks/useAccessibleAnimation'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  const { variants } = useAccessibleAnimation({
    variants: spinnerVariants,
    respectReducedMotion: true,
  })

  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  }

  const colorClasses = {
    primary: 'border-cyan-400/30 border-t-cyan-400',
    secondary: 'border-blue-400/30 border-t-blue-400',
    accent: 'border-purple-400/30 border-t-purple-400',
  }

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full
        shadow-lg
        ${color === 'primary' ? 'drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]' : ''}
        ${className}
      `}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label="Loading"
      role="status"
      style={{
        willChange: 'transform, opacity',
      }}
    />
  )
}

interface LoadingMessageProps {
  message: string
  submessage?: string
  messageKey: string // For AnimatePresence key
  className?: string
}

export function LoadingMessage({ 
  message, 
  submessage, 
  messageKey, 
  className = '' 
}: LoadingMessageProps) {
  const { variants } = useAccessibleAnimation({
    variants: messageVariants,
    respectReducedMotion: true,
  })

  return (
    <div className={`text-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={messageKey}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-2"
        >
          <div className="font-semibold text-lg text-white">
            {message}
          </div>
          {submessage && (
            <div className="text-sm text-gray-400 font-medium">
              {submessage}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface SecurityScanLoaderProps {
  currentTest: string
  testIndex: number
  isVisible: boolean
  className?: string
}

export function SecurityScanLoader({ 
  currentTest, 
  testIndex, 
  isVisible, 
  className = '' 
}: SecurityScanLoaderProps) {
  const { variants: containerVariants } = useAccessibleAnimation({
    variants: loadingContainerVariants,
  })
  
  const { variants: elementVariants } = useAccessibleAnimation({
    variants: loadingElementVariants,
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-center justify-center space-x-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Enhanced animated spinner with glow effect */}
      <motion.div 
        variants={elementVariants}
        className="relative"
      >
        <LoadingSpinner size="lg" color="primary" />
        <motion.div 
          className="absolute inset-0 rounded-full bg-cyan-400/10 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Enhanced dynamic message container */}
      <motion.div 
        variants={elementVariants}
        className="relative h-10 overflow-hidden min-w-[320px] flex items-center"
      >
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.span
              key={`${currentTest}-${testIndex}`}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center font-semibold text-white text-lg tracking-wide"
            >
              {currentTest}
            </motion.span>
          )}
          {!isVisible && (
            <motion.span
              key="default-scanning"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center font-semibold text-white text-lg tracking-wide"
            >
              <span className="inline-flex items-center space-x-2">
                <span>ANALYZING NETWORK</span>
                <TypingIndicator className="ml-1" />
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

interface ProgressIndicatorProps {
  progress: number // 0-100
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressIndicator({ 
  progress, 
  steps, 
  currentStep, 
  className = '' 
}: ProgressIndicatorProps) {
  const { variants: containerVariants } = useAccessibleAnimation({
    variants: loadingContainerVariants,
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`w-full max-w-md space-y-6 ${className}`}
    >
      {/* Enhanced progress bar with glow effect */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1]
            }}
            style={{
              boxShadow: '0 0 12px rgba(0, 212, 255, 0.4)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
        <div className="text-sm text-gray-300 text-right mt-2 font-medium">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Enhanced step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            className={`
              flex flex-col items-center space-y-3 text-xs
              ${index <= currentStep ? 'text-cyan-400' : 'text-gray-500'}
              transition-colors duration-300
            `}
            variants={loadingElementVariants}
            custom={index}
          >
            <motion.div
              className={`
                w-4 h-4 rounded-full border-2 relative overflow-hidden
                ${index <= currentStep 
                  ? 'bg-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/40' 
                  : 'border-gray-500 bg-gray-800'
                }
              `}
              animate={index === currentStep ? {
                scale: [1, 1.15, 1],
                boxShadow: [
                  '0 0 8px rgba(0, 212, 255, 0.4)',
                  '0 0 16px rgba(0, 212, 255, 0.6)',
                  '0 0 8px rgba(0, 212, 255, 0.4)',
                ],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {index < currentStep && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
            <span className="max-w-16 text-center leading-tight font-medium">
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface PulsingDotProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  delay?: number
  className?: string
}

export function PulsingDot({ 
  size = 'md', 
  color = 'bg-cyan-400', 
  delay = 0,
  className = '' 
}: PulsingDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${color} rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}

interface TypingIndicatorProps {
  text?: string
  className?: string
}

export function TypingIndicator({ 
  text = "", 
  className = '' 
}: TypingIndicatorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {text && <span className="text-gray-400 font-medium">{text}</span>}
      <div className="flex space-x-1">
        <PulsingDot size="sm" delay={0} />
        <PulsingDot size="sm" delay={0.15} />
        <PulsingDot size="sm" delay={0.3} />
      </div>
    </div>
  )
}

const LoadingComponents = {
  LoadingSpinner,
  LoadingMessage,
  SecurityScanLoader,
  ProgressIndicator,
  PulsingDot,
  TypingIndicator,
}

export default LoadingComponents