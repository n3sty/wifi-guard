"use client";

import BlogLink from "@/components/BlogLink";
import { NetworkIndicator } from "@/components/security/NetworkIndicator";
import { ResultsView } from "@/components/security/ResultsView";
import { ScanButton } from "@/components/security/ScanButton";
import { SecurityTips } from "@/components/security/SecurityTips";
import { TechnicalDetails } from "@/components/security/TechnicalDetails";
import { useSecurityChecks } from "@/hooks/useSecurityChecks";
import { useAnalytics } from "@/lib/analytics";
import { ViewState } from "@/types/security";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [currentView, setCurrentView] = useState<ViewState>("results");
  const {
    isChecking,
    checks,
    overallStatus,
    runSecurityChecks,
    resetChecks,
    getIssueCount,
  } = useSecurityChecks();

  // Initialize analytics
  useAnalytics();

  const handleScanAgain = () => {
    resetChecks();
    setCurrentView("results");
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 flex flex-col flex-1">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-12 justify-between items-center flex-1">
        {/* Main Content Area */}
        <div className="flex items-center justify-center flex-1">
          <div className="max-w-xl w-full">
            {/* Network Indicator */}
            <NetworkIndicator />

            {/* Main Action/Results Section */}
            <AnimatePresence mode="wait">
              {!overallStatus ? (
                <>
                  <ScanButton
                    isChecking={isChecking}
                    onScan={runSecurityChecks}
                  />

                  {/* App Limitations Notice */}
                  {!isChecking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-yellow-600"
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
                        <div className="flex-1">
                          <p className="text-sm text-yellow-800 leading-relaxed">
                            <strong>Note:</strong> WiFi Guard performs basic
                            browser-based security checks. It cannot detect all
                            network threats or access low-level WiFi encryption
                            details. Always follow{" "}
                            <Link
                              href="/security-info"
                              className="text-blue-600 hover:text-blue-700 underline font-medium"
                            >
                              WiFi safety best practices
                            </Link>{" "}
                            for comprehensive protection.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="relative rounded-xl my-6">
                  <AnimatePresence mode="wait">
                    {/* Results View */}
                    {currentView === "results" && (
                      <ResultsView
                        overallStatus={overallStatus}
                        issueCount={getIssueCount()}
                        onShowEducation={() => setCurrentView("education")}
                        onShowDetails={() => setCurrentView("details")}
                        onScanAgain={handleScanAgain}
                      />
                    )}

                    {/* Education View */}
                    {currentView === "education" && (
                      <SecurityTips
                        overallStatus={overallStatus}
                        checks={checks}
                        onBack={() => setCurrentView("results")}
                      />
                    )}

                    {/* Technical Details View */}
                    {currentView === "details" && checks.length > 0 && (
                      <TechnicalDetails
                        checks={checks}
                        onBack={() => setCurrentView("results")}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Blog Link Section */}
        {currentView === "results" && (
          <BlogLink title="Learn More About WiFi" href="/blog" />
        )}
      </div>
    </div>
  );
}
