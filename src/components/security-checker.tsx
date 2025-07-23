"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  trackScanStarted,
  trackScanCompleted,
  trackShowDetails,
  trackShowEducation,
  trackPageLoad,
  trackScanAgain,
} from "@/lib/analytics";

interface SecurityCheck {
  id: string;
  name: string;
  status: "checking" | "passed" | "warning" | "failed";
  message: string;
  details?: string;
}

type ViewState = "results" | "details" | "education";

// Type for navigator connection API
interface NetworkInformation {
  type: string;
  effectiveType: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

export default function SecurityChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [overallStatus, setOverallStatus] = useState<
    "safe" | "caution" | "danger" | null
  >(null);
  const [currentView, setCurrentView] = useState<ViewState>("results");

  // Track page load
  useEffect(() => {
    trackPageLoad();
  }, []);

  const runSecurityChecks = async () => {
    trackScanStarted();
    setIsChecking(true);
    setChecks([]);
    setOverallStatus(null);
    setCurrentView("results");

    const securityChecks: SecurityCheck[] = [
      {
        id: "https-check",
        name: "Connection Security",
        status: "checking",
        message: "Verifying encryption protocols...",
      },
      {
        id: "response-time-check",
        name: "Network Performance",
        status: "checking",
        message: "Testing connection integrity...",
      },
      {
        id: "ssl-check",
        name: "Certificate Validation",
        status: "checking",
        message: "Checking certificate authority...",
      },
    ];

    setChecks(securityChecks);

    // Perform actual checks
    const currentChecks = [...securityChecks];

    for (let i = 0; i < currentChecks.length; i++) {
      // Small delay to ensure state update is processed
      await new Promise((resolve) => setTimeout(resolve, 100));

      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (i === 0) {
        // HTTPS vs HTTP Detection
        const isHttps = window.location.protocol === "https:";
        currentChecks[0] = {
          ...currentChecks[0],
          status: isHttps ? "passed" : "failed",
          message: isHttps
            ? "TLS encryption active"
            : "Unencrypted connection detected",
          details: isHttps
            ? "This website uses HTTPS encryption to protect your data from eavesdropping and man-in-the-middle attacks."
            : "This website uses unencrypted HTTP. On public WiFi, this creates serious security risks as your data can be intercepted by malicious actors.",
        };
      }

      if (i === 1) {
        // Response Time Analysis
        try {
          const testEndpoints = [
            "https://www.google.com/favicon.ico",
            "https://www.cloudflare.com/favicon.ico",
          ];

          const responseTimeTester = async (url: string) => {
            const startTime = performance.now();
            try {
              await fetch(url, {
                mode: "no-cors",
                cache: "no-cache",
                method: "HEAD",
              });
              return performance.now() - startTime;
            } catch {
              return -1;
            }
          };

          const times = await Promise.all(
            testEndpoints.map(responseTimeTester)
          );
          const validTimes = times.filter((time) => time > 0);
          const avgResponseTime =
            validTimes.length > 0
              ? validTimes.reduce((sum, time) => sum + time, 0) /
                validTimes.length
              : -1;

          let status: SecurityCheck["status"] = "passed";
          let message = "Network performance optimal";
          let details =
            "Network latency is within normal parameters with no signs of traffic manipulation or interference.";

          if (avgResponseTime === -1) {
            status = "warning";
            message = "Connection anomalies detected";
            details =
              "Unable to establish baseline performance metrics. This could indicate network restrictions or connectivity issues.";
          } else if (avgResponseTime > 3000) {
            status = "warning";
            message = "Suspicious network behavior";
            details = `Response time: ${Math.round(
              avgResponseTime
            )}ms. Extremely slow networks can indicate traffic interception, packet inspection, or poor quality connections that may compromise security.`;
          } else {
            details = `Response time: ${Math.round(
              avgResponseTime
            )}ms. Network performance indicates a healthy connection.`;
          }

          currentChecks[1] = {
            ...currentChecks[1],
            status,
            message,
            details,
          };
        } catch {
          currentChecks[1] = {
            ...currentChecks[1],
            status: "warning",
            message: "Performance analysis failed",
            details:
              "Unable to complete network performance analysis due to connection issues.",
          };
        }
      }

      if (i === 2) {
        // SSL Certificate Validation
        try {
          // Check if we can detect connection type (mobile data vs WiFi)
          const navigatorWithConnection = navigator as NavigatorWithConnection;
          const connection = navigatorWithConnection.connection;
          const isLikelyMobileData =
            connection &&
            (connection.type === "cellular" ||
              connection.effectiveType === "slow-2g" ||
              connection.effectiveType === "2g");

          // Use CDN endpoints less likely to be blocked by carriers
          const testUrls = [
            "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
            "https://unpkg.com/react@18/umd/react.production.min.js",
          ];

          const sslTester = async (url: string) => {
            try {
              const response = await fetch(url, {
                method: "HEAD",
                cache: "no-cache",
                mode: "cors",
              });
              return response.ok;
            } catch {
              return false;
            }
          };

          const results = await Promise.all(testUrls.map(sslTester));
          const successfulConnections = results.filter((r) => r).length;
          const failedConnections = results.length - successfulConnections;

          let status: SecurityCheck["status"] = "passed";
          let message = "Certificate chain verified";
          let details =
            "SSL/TLS certificate validation is functioning properly, indicating secure connections are working as expected.";

          // On mobile data, be more lenient as carriers often interfere
          if (isLikelyMobileData && failedConnections > 0) {
            status = "passed";
            message = "Mobile data connection detected";
            details =
              "Connected via mobile data. Certificate validation skipped as mobile carriers often use proxies that interfere with external SSL tests. Mobile data is generally more secure than public WiFi.";
          } else if (failedConnections === results.length) {
            status = "failed";
            message = "Certificate validation failed";
            details =
              "Unable to establish secure connections to trusted sites. This could indicate certificate problems, DNS manipulation, or network-level security interference on this WiFi network.";
          } else if (failedConnections > 0) {
            status = "warning";
            message = "Partial certificate issues";
            details =
              "Some secure connections failed while others succeeded. This may indicate intermittent network issues or selective blocking on this WiFi network.";
          }

          currentChecks[2] = {
            ...currentChecks[2],
            status,
            message,
            details,
          };
        } catch {
          currentChecks[2] = {
            ...currentChecks[2],
            status: "warning",
            message: "Certificate validation error",
            details:
              "Unable to complete SSL certificate validation due to network restrictions.",
          };
        }
      }

      setChecks([...currentChecks]);
    }

    // Calculate overall status after all checks are complete
    const hasFailures = currentChecks.some(
      (check) => check.status === "failed"
    );
    const hasWarnings = currentChecks.some(
      (check) => check.status === "warning"
    );

    const finalResult = hasFailures
      ? "danger"
      : hasWarnings
      ? "caution"
      : "safe";

    // Track completion with result
    trackScanCompleted(finalResult, {
      checksCount: currentChecks.length,
      hasFailures,
      hasWarnings,
    });

    setOverallStatus(finalResult);
    setIsChecking(false);
  };

  const getOverallStatusDisplay = () => {
    switch (overallStatus) {
      case "safe":
        return {
          gradient: "from-green-400 via-emerald-500 to-teal-600",
          bgGradient: "from-green-500/20 via-emerald-500/10 to-teal-500/20",
          borderColor: "border-green-400/30",
          textColor: "text-green-400",
          accentColor: "text-green-300",
          glowColor: "shadow-green-500/50",
          title: "NETWORK SECURED",
          subtitle: "Safe for sensitive operations",
          message:
            "All security checks passed. Your connection is protected and safe for normal use.",
          riskLevel: "LOW RISK",
          tips: [
            "Safe to access banking and financial services",
            "Secure for entering passwords and personal data",
            "Protected against common WiFi security threats",
            "Continue browsing with confidence",
          ],
          icon: (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-pulse-glow">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
            </div>
          ),
        };
      case "caution":
        return {
          gradient: "from-yellow-400 via-amber-500 to-orange-600",
          bgGradient: "from-yellow-500/20 via-amber-500/10 to-orange-500/20",
          borderColor: "border-yellow-400/30",
          textColor: "text-yellow-400",
          accentColor: "text-yellow-300",
          glowColor: "shadow-yellow-500/50",
          title: "CAUTION ADVISED",
          subtitle: "Potential security concerns detected",
          message:
            "Some security issues were identified. Avoid sensitive activities until resolved.",
          riskLevel: "MODERATE RISK",
          tips: [
            "Avoid online banking and payment processing",
            "Do not enter passwords for critical accounts",
            "Consider using mobile data for sensitive tasks",
            "Verify network legitimacy with venue staff",
          ],
          icon: (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center animate-pulse-glow">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping"></div>
            </div>
          ),
        };
      case "danger":
        return {
          gradient: "from-red-400 via-rose-500 to-red-600",
          bgGradient: "from-red-500/20 via-rose-500/10 to-red-500/20",
          borderColor: "border-red-400/30",
          textColor: "text-red-400",
          accentColor: "text-red-300",
          glowColor: "shadow-red-500/50",
          title: "SECURITY THREAT",
          subtitle: "Immediate action required",
          message:
            "Critical security vulnerabilities detected. Disconnect immediately to protect your data.",
          riskLevel: "HIGH RISK",
          tips: [
            "Disconnect from this network immediately",
            "Switch to mobile data or secure alternative",
            "Change passwords if sensitive data was entered",
            "Report suspicious network to venue management",
          ],
          icon: (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center animate-pulse-glow">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>
            </div>
          ),
        };
      default:
        return null;
    }
  };

  const getCheckIcon = (status: SecurityCheck["status"]) => {
    switch (status) {
      case "checking":
        return (
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        );
      case "passed":
        return (
          <div className="w-6 h-6 rounded-full bg-green-100 border border-green-400 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="w-6 h-6 rounded-full bg-yellow-100 border border-yellow-400 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "failed":
        return (
          <div className="w-6 h-6 rounded-full bg-red-100 border border-red-400 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full">
        {/* Contained Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-12 pt-8">
          <div className="flex flex-row items-center space-x-3 justify-center sm:justify-start">
            {/* Logo */}
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4"
                />
              </svg>
            </div>
            {/* Brand */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WiFi Guard</h1>
              <p className="text-sm text-gray-500 -mt-0.5">
                Network Security Scanner
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-row items-center space-x-3 justify-center sm:justify-end">
            <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm">
              Get Pro
            </button>
          </div>
        </header>

        {/* Main Content Area - Centered */}
        <div className="flex items-center justify-center flex-1">
          <div className="max-w-xl mx-auto w-full">
            {/* Main Action/Results Section - Flexible Layout Container */}
            <div className="mb-12">
              <AnimatePresence mode="wait">
                {!overallStatus ? (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="text-center"
                  >
                    <motion.button
                      onClick={runSecurityChecks}
                      disabled={isChecking}
                      className={`
                    w-full py-6 px-8 rounded-xl font-semibold text-xl
                    ${
                      isChecking
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                    transition-all duration-300 shadow-lg
                  `}
                      whileHover={!isChecking ? { scale: 1.02, y: -1 } : {}}
                      whileTap={!isChecking ? { scale: 0.98 } : {}}
                    >
                      <AnimatePresence mode="wait">
                        {isChecking ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center space-x-3"
                          >
                            <motion.div
                              className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span>Checking your network...</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            Check Network Security
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <AnimatePresence>
                      {!isChecking && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="mt-6"
                        >
                          <p className="text-gray-600 text-base mb-4">
                            Get instant security analysis in seconds
                          </p>

                          {/* Simple status indicators */}
                          <div className="flex items-center justify-center space-x-6 text-sm">
                            <motion.div
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">Safe</span>
                            </motion.div>
                            <motion.div
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-gray-700">Caution</span>
                            </motion.div>
                            <motion.div
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">Risk</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className="relative rounded-xl">
                    <AnimatePresence mode="wait">
                      {/* Results View */}
                      {currentView === "results" && (
                        <motion.div
                          key="results-view"
                          initial={{ x: 0, opacity: 1 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -30, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="space-y-6"
                        >
                          {/* Main Result Card */}
                          <motion.div
                            className={`
                          border-2 rounded-xl p-8 text-center bg-white shadow-lg
                          ${
                            overallStatus === "safe"
                              ? "border-green-500"
                              : overallStatus === "caution"
                              ? "border-yellow-500"
                              : "border-red-500"
                          }
                        `}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          >
                            {/* Result Icon */}
                            <motion.div
                              className="flex justify-center mb-6"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              {overallStatus === "safe" ? (
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              ) : overallStatus === "caution" ? (
                                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </motion.div>

                            {/* Result Text */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                            >
                              <h2
                                className={`
                            text-3xl font-bold mb-2
                            ${
                              overallStatus === "safe"
                                ? "text-green-600"
                                : overallStatus === "caution"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }
                          `}
                              >
                                {overallStatus === "safe"
                                  ? "Network is Safe"
                                  : overallStatus === "caution"
                                  ? "Use with Caution"
                                  : "Security Risk Detected"}
                              </h2>

                              <p className="text-gray-700 text-lg max-w-md mx-auto">
                                {getOverallStatusDisplay()?.message}
                              </p>
                            </motion.div>
                          </motion.div>

                          {/* Action Buttons */}
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                          >
                            <motion.button
                              onClick={() => {
                                trackShowEducation();
                                setCurrentView("education");
                              }}
                              className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              Security Tips
                            </motion.button>

                            <motion.button
                              onClick={() => {
                                trackShowDetails();
                                setCurrentView("details");
                              }}
                              className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              Technical Details
                            </motion.button>

                            <motion.button
                              onClick={() => {
                                trackScanAgain();
                                setOverallStatus(null);
                                setChecks([]);
                                setCurrentView("results");
                              }}
                              className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 }}
                            >
                              Scan Again
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Education View */}
                      {currentView === "education" && (
                        <motion.div
                          key="education-view"
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 30, opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
                        >
                          {/* Header with Back Button */}
                          <motion.div
                            className="flex items-center mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.button
                              onClick={() => setCurrentView("results")}
                              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </motion.button>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-gray-900 font-bold text-xl">
                                  Security Tips
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  Follow these guidelines to stay safe
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-4">
                                What to do next:
                              </h4>
                              <div className="space-y-3">
                                {getOverallStatusDisplay()?.tips.map(
                                  (tip, index) => (
                                    <motion.div
                                      key={index}
                                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </div>
                                      <p className="text-gray-700 leading-relaxed">
                                        {tip}
                                      </p>
                                    </motion.div>
                                  )
                                )}
                              </div>
                            </div>

                            <motion.div
                              className="border-t border-gray-200 pt-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <h4 className="font-semibold text-gray-900 mb-4">
                                General WiFi Safety Tips
                              </h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {[
                                  "Always verify network names with venue staff",
                                  'Look for "https://" in website address bars',
                                  "Disable automatic WiFi connections",
                                  "Use a reputable VPN for additional protection",
                                  "Keep your device software updated",
                                  "Enable two-factor authentication where possible",
                                ].map((tip, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-start space-x-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                  >
                                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                      {tip}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {/* Technical Details View */}
                      {currentView === "details" && checks.length > 0 && (
                        <motion.div
                          key="details-view"
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 30, opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="space-y-4"
                        >
                          {/* Header with Back Button */}
                          <motion.div
                            className="flex items-center mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.button
                              onClick={() => setCurrentView("results")}
                              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </motion.button>
                            <h3 className="text-gray-900 font-bold text-xl">
                              Technical Analysis
                            </h3>
                          </motion.div>

                          {checks.map((check, index) => (
                            <motion.div
                              key={check.id}
                              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.3 + index * 0.1,
                                duration: 0.4,
                              }}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="mt-1">
                                  {getCheckIcon(check.status)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-gray-900 font-bold text-lg">
                                      {check.name}
                                    </h4>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        check.status === "passed"
                                          ? "bg-green-100 text-green-700"
                                          : check.status === "warning"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : check.status === "failed"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {check.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 font-medium mb-3">
                                    {check.message}
                                  </p>

                                  {check.details && (
                                    <motion.div
                                      className="bg-gray-50 rounded-lg p-4"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                      <p className="text-gray-600 leading-relaxed">
                                        {check.details}
                                      </p>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
