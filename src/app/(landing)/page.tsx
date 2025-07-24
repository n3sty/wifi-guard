"use client";

import { useSecurityChecks } from "@/hooks/useSecurityChecks";
import { useAnalytics } from "@/lib/analytics";
import { ViewState } from "@/types/security";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NetworkIndicator } from "@/components/security/NetworkIndicator";
import { ResultsView } from "@/components/security/ResultsView";
import { ScanButton } from "@/components/security/ScanButton";
import { SecurityTips } from "@/components/security/SecurityTips";
import { TechnicalDetails } from "@/components/security/TechnicalDetails";
import BlogLink from "@/components/BlogLink";

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
                <ScanButton
                  isChecking={isChecking}
                  onScan={runSecurityChecks}
                />
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
          <BlogLink
            title="Learn More About WiFi Security"
            description="Understand what these security checks mean and get practical WiFi safety tips that actually work."
            href="/blog"
          />
        )}
      </div>
    </div>
  );
}
