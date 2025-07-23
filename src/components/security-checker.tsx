"use client";

import { useSecurityChecks } from "@/hooks/useSecurityChecks";
import { trackPageLoad } from "@/lib/analytics";
import { ViewState } from "@/types/security";
import { AnimatePresence } from "framer-motion";
import { ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NetworkIndicator } from "./security/NetworkIndicator";
import { ResultsView } from "./security/ResultsView";
import { ScanButton } from "./security/ScanButton";
import { SecurityTips } from "./security/SecurityTips";
import { TechnicalDetails } from "./security/TechnicalDetails";

export default function SecurityChecker() {
  const [currentView, setCurrentView] = useState<ViewState>("results");
  const {
    isChecking,
    checks,
    overallStatus,
    runSecurityChecks,
    resetChecks,
    getIssueCount,
  } = useSecurityChecks();

  // Track page load
  useEffect(() => {
    trackPageLoad();
  }, []);

  const handleScanAgain = () => {
    resetChecks();
    setCurrentView("results");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full">
        {/* Contained Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-12 pt-8">
          <div className="flex flex-row items-center space-x-3 justify-center sm:justify-start">
            {/* Logo */}
            <div className="!size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheckIcon className="!size-6 text-white" />
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
          {/* <div className="flex flex-row items-center space-x-3 justify-center sm:justify-end">
            <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm">
              Get Pro
            </button>
          </div> */}
        </header>

        {/* Main Content Area - Centered */}
        <div className="flex items-center justify-center flex-1">
          <div className="max-w-xl mx-auto w-full">
            {/* Network Indicator */}
            <NetworkIndicator />

            {/* Main Action/Results Section - Flexible Layout Container */}
            <div className="mb-12">
              <AnimatePresence mode="wait">
                {!overallStatus ? (
                  <ScanButton
                    isChecking={isChecking}
                    onScan={runSecurityChecks}
                  />
                ) : (
                  <div className="relative rounded-xl">
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
        </div>
      </div>
    </div>
  );
}
