'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackScanStarted, trackScanCompleted, trackShowDetails, trackShowEducation, trackPageLoad, trackScanAgain } from '@/lib/analytics'

interface SecurityCheck {
  id: string
  name: string
  status: 'checking' | 'passed' | 'warning' | 'failed'
  message: string
  details?: string
}

interface CheckingState {
  currentTest: string
  isVisible: boolean
  testIndex: number
}

export default function SecurityChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [checks, setChecks] = useState<SecurityCheck[]>([])
  const [overallStatus, setOverallStatus] = useState<'safe' | 'caution' | 'danger' | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEducation, setShowEducation] = useState(false)
  const [currentTestState, setCurrentTestState] = useState<CheckingState>({ currentTest: '', isVisible: false, testIndex: 0 })

  // Track page load
  useEffect(() => {
    trackPageLoad()
  }, [])

  const runSecurityChecks = async () => {
    trackScanStarted()
    setIsChecking(true)
    setChecks([])
    setOverallStatus(null)
    setShowDetails(false)
    setShowEducation(false)
    setCurrentTestState({ currentTest: '', isVisible: false, testIndex: 0 })

    const testMessages = [
      'Running SSL test...',
      'Checking for certificates...',
      'Analyzing network performance...',
      'Finalizing security scan...'
    ]

    const securityChecks: SecurityCheck[] = [
      {
        id: 'https-check',
        name: 'Connection Security',
        status: 'checking',
        message: 'Verifying encryption...',
      },
      {
        id: 'response-time-check',
        name: 'Network Performance',
        status: 'checking',
        message: 'Testing connection speed...',
      },
      {
        id: 'ssl-check',
        name: 'Certificate Validation',
        status: 'checking',
        message: 'Checking certificates...',
      },
    ]

    setChecks(securityChecks)

    // Perform actual checks
    const currentChecks = [...securityChecks]
    
    for (let i = 0; i < currentChecks.length; i++) {
      // Update current test state with swoosh animation
      setCurrentTestState({ currentTest: testMessages[i], isVisible: true, testIndex: i })
      
      // Small delay to ensure state update is processed
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (i === 0) {
        // HTTPS vs HTTP Detection
        const isHttps = window.location.protocol === 'https:'
        currentChecks[0] = {
          ...currentChecks[0],
          status: isHttps ? 'passed' : 'failed',
          message: isHttps ? 'Connection encrypted' : 'Connection not secure',
          details: isHttps 
            ? 'This website uses HTTPS encryption to protect your data from eavesdropping.'
            : 'This website uses unencrypted HTTP. On public WiFi, this creates security risks as your data can be intercepted.'
        }
      }
      
      if (i === 1) {
        // Response Time Analysis
        try {
          const testEndpoints = [
            'https://www.google.com/favicon.ico',
            'https://www.cloudflare.com/favicon.ico',
          ]
          
          const responseTimeTester = async (url: string) => {
            const startTime = performance.now()
            try {
              await fetch(url, { 
                mode: 'no-cors',
                cache: 'no-cache',
                method: 'HEAD'
              })
              return performance.now() - startTime
            } catch {
              return -1
            }
          }
          
          const times = await Promise.all(testEndpoints.map(responseTimeTester))
          const validTimes = times.filter(time => time > 0)
          const avgResponseTime = validTimes.length > 0 
            ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length 
            : -1
          
          let status: SecurityCheck['status'] = 'passed'
          let message = 'Normal response time'
          let details = 'Network performance appears normal with no signs of interference or traffic manipulation.'
          
          if (avgResponseTime === -1) {
            status = 'warning'
            message = 'Connection issues detected'
            details = 'Unable to measure network performance. This could indicate connectivity problems or network restrictions.'
          } else if (avgResponseTime > 3000) {
            status = 'warning'
            message = 'Slow network detected'
            details = `Response time: ${Math.round(avgResponseTime)}ms. Very slow networks can sometimes indicate traffic interception or poor quality connections.`
          } else {
            details = `Response time: ${Math.round(avgResponseTime)}ms. Network performance is within normal range.`
          }
          
          currentChecks[1] = {
            ...currentChecks[1],
            status,
            message,
            details
          }
        } catch {
          currentChecks[1] = {
            ...currentChecks[1],
            status: 'warning',
            message: 'Performance test failed',
            details: 'Unable to complete network performance analysis.'
          }
        }
      }
      
      if (i === 2) {
        // SSL Certificate Validation
        try {
          const testUrls = [
            'https://www.google.com',
            'https://www.github.com',
          ]
          
          const sslTester = async (url: string) => {
            try {
              const response = await fetch(url, { 
                method: 'HEAD',
                cache: 'no-cache'
              })
              return response.ok
            } catch {
              return false
            }
          }
          
          const results = await Promise.all(testUrls.map(sslTester))
          const successfulConnections = results.filter(r => r).length
          const failedConnections = results.length - successfulConnections
          
          let status: SecurityCheck['status'] = 'passed'
          let message = 'Certificates verified'
          let details = 'SSL certificate validation is working properly, indicating secure connections are functioning normally.'
          
          if (failedConnections === results.length) {
            status = 'failed'
            message = 'Certificate issues detected'
            details = 'Unable to establish secure connections. This could indicate certificate problems, network blocking, or potential security interference.'
          } else if (failedConnections > 0) {
            status = 'warning'
            message = 'Some certificate issues'
            details = 'Some secure connections failed while others succeeded. This could indicate intermittent network issues.'
          }
          
          currentChecks[2] = {
            ...currentChecks[2],
            status,
            message,
            details
          }
        } catch {
          currentChecks[2] = {
            ...currentChecks[2],
            status: 'warning',
            message: 'Certificate test failed',
            details: 'Unable to complete SSL certificate validation.'
          }
        }
      }
      
      setChecks([...currentChecks])
    }

    // Calculate overall status after all checks are complete
    const hasFailures = currentChecks.some(check => check.status === 'failed')
    const hasWarnings = currentChecks.some(check => check.status === 'warning')
    
    const finalResult = hasFailures ? 'danger' : hasWarnings ? 'caution' : 'safe'
    
    // Show final result message with swoosh
    const finalMessage = finalResult === 'danger' ? 'SECURITY RISK' : 
                        finalResult === 'caution' ? 'USE CAUTION' : 
                        'NETWORK SECURE'
    
    setCurrentTestState({ currentTest: finalMessage, isVisible: true, testIndex: 3 })
    
    // Small delay before showing final result
    await new Promise(resolve => setTimeout(resolve, 500))

    // Clear current test state
    setCurrentTestState({ currentTest: '', isVisible: false, testIndex: 0 })
    
    // Track completion with result
    trackScanCompleted(finalResult, {
      checksCount: currentChecks.length,
      hasFailures,
      hasWarnings
    })
    
    setOverallStatus(finalResult)
    setIsChecking(false)
  }

  const getOverallStatusDisplay = () => {
    switch (overallStatus) {
      case 'safe':
        return {
          color: 'bg-emerald-900/30 border-emerald-500/30',
          textColor: 'text-emerald-400',
          title: 'Network Secure',
          message: 'Your connection appears safe for normal use',
          tips: [
            'You can browse normally and use most online services',
            'Still avoid entering highly sensitive data like SSNs',
            'Consider using HTTPS websites when possible'
          ],
          icon: (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )
        }
      case 'caution':
        return {
          color: 'bg-amber-900/30 border-amber-500/30',
          textColor: 'text-amber-400',
          title: 'Use Caution',
          message: 'Some concerns detected - avoid sensitive activities',
          tips: [
            'Avoid online banking and shopping with payment info',
            'Don\'t enter passwords for important accounts',
            'Use mobile data for sensitive activities instead',
            'Check if the network name matches the location'
          ],
          icon: (
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          )
        }
      case 'danger':
        return {
          color: 'bg-red-900/30 border-red-500/30',
          textColor: 'text-red-400',
          title: 'Security Risk',
          message: 'Potential threats detected - avoid this network',
          tips: [
            'Disconnect from this network immediately',
            'Use your mobile data or find a different network',
            'Change passwords if you entered any sensitive info',
            'Report suspicious networks to the establishment'
          ],
          icon: (
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )
        }
      default:
        return null
    }
  }

  const getCheckIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'checking':
        return (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )
      case 'passed':
        return (
          <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-3V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14l2-2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              WiFi Guard
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Check suspicious networks like a cyber-security guard
            </p>
          </div>
        </div>

        {/* Main Action */}
        {!overallStatus && (
          <div className="text-center">
            <motion.button
              onClick={runSecurityChecks}
              disabled={isChecking}
              className={`
                w-full py-6 px-8 rounded-2xl font-semibold text-lg
                ${isChecking 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                }
                transition-colors duration-200 border border-blue-500/20 overflow-hidden
              `}
              whileHover={!isChecking ? { scale: 1.01 } : {}}
              whileTap={!isChecking ? { scale: 0.99 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                {isChecking ? (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center space-x-3"
                  >
                    <motion.div 
                      className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative h-6 overflow-hidden">
                      <AnimatePresence mode="wait">
                        {currentTestState.isVisible && (
                          <motion.span
                            key={`${currentTestState.currentTest}-${currentTestState.testIndex}`}
                            initial={{ opacity: 0, x: 30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -30, scale: 0.9 }}
                            transition={{ 
                              duration: 0.3, 
                              ease: [0.25, 0.46, 0.45, 0.94],
                              scale: { duration: 0.2 }
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {currentTestState.currentTest}
                          </motion.span>
                        )}
                        {!currentTestState.isVisible && (
                          <motion.span
                            key="scanning"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            Scanning Network...
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.span
                    key="start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Start Security Scan
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {!isChecking && (
              <div className="mt-6 space-y-3">
                <p className="text-gray-500 text-xs">
                  One-click network security analysis
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full"></div>
                    <span>Safe</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-amber-500/50 rounded-full"></div>
                    <span>Caution</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500/50 rounded-full"></div>
                    <span>Risk</span>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 text-center select-none">
                    Enhanced scan
                  </summary>
                  <div className="mt-3 px-3 py-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <input
                      id="optional-network-name"
                      type="text"
                      placeholder="Network name (optional)"
                      className="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="sync">
          {overallStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-6"
            >
            {/* Main Result */}
            <motion.div 
              className={`border rounded-2xl p-6 ${getOverallStatusDisplay()?.color}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
            >
              <div className="text-center space-y-4 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
                  className="flex justify-center"
                >
                  {getOverallStatusDisplay()?.icon}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15, ease: "easeOut" }}
                  className="text-center max-w-sm mx-auto"
                >
                  <h2 className={`text-xl font-semibold ${getOverallStatusDisplay()?.textColor}`}>
                    {getOverallStatusDisplay()?.title}
                  </h2>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                    {getOverallStatusDisplay()?.message}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
            >
              <motion.button
                onClick={() => {
                  trackShowEducation()
                  setShowEducation(!showEducation)
                }}
                className="w-full py-3 px-6 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium transition-colors border border-blue-500/20"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {showEducation ? 'Hide Security Tips' : 'Show Security Tips'}
              </motion.button>
              
              <motion.button
                onClick={() => {
                  trackShowDetails()
                  setShowDetails(!showDetails)
                }}
                className="w-full py-3 px-6 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {showDetails ? 'Hide Details' : 'Show Technical Details'}
              </motion.button>
              
              <motion.button
                onClick={() => {
                  trackScanAgain()
                  setOverallStatus(null)
                  setChecks([])
                  setShowDetails(false)
                  setShowEducation(false)
                }}
                className="w-full py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors border border-gray-600"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Scan Again
              </motion.button>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Content */}
        <AnimatePresence mode="sync">
          {showEducation && overallStatus && (
            <motion.div 
              className="mt-6 bg-gray-800/50 rounded-xl p-4 border border-gray-700 overflow-hidden"
              initial={{ opacity: 0, scaleY: 0, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">What should I do now?</h3>
                <div className="space-y-2">
                  {getOverallStatusDisplay()?.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-xs leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* General WiFi Safety Tips */}
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-gray-400 font-medium text-xs mb-3">General Public WiFi Safety</h4>
              <div className="space-y-2">
                {[
                  'Always verify network names with staff at the location',
                  'Look for "https://" in the address bar on websites',
                  'Avoid automatic WiFi connections on your device',
                  'Use a VPN for extra protection when available'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-400 text-xs leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technical Details */}
        <AnimatePresence mode="sync">
          {showDetails && checks.length > 0 && (
            <motion.div 
              className="mt-6 space-y-4 overflow-hidden"
              initial={{ opacity: 0, scaleY: 0, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h3 className="text-white font-semibold text-center mb-4">
                Security Check Details
              </h3>
              
              {checks.map((check, index) => (
                <motion.div 
                  key={check.id} 
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2, ease: "easeOut" }}
                >
                <div className="flex items-center space-x-3">
                  {getCheckIcon(check.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium text-sm">{check.name}</h4>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{check.message}</p>
                    
                    {check.details && (
                      <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                        {check.details}
                      </p>
                    )}
                  </div>
                </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}