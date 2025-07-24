"use client";

import { useSecurityChecks } from "@/hooks/useSecurityChecks";
import { useAnalytics } from "@/lib/analytics";
import { ViewState } from "@/types/security";
import { AnimatePresence } from "framer-motion";
import { ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { NetworkIndicator } from "./security/NetworkIndicator";
import { ResultsView } from "./security/ResultsView";
import { ScanButton } from "./security/ScanButton";
import { SecurityTips } from "./security/SecurityTips";
import { TechnicalDetails } from "./security/TechnicalDetails";
import { WhatWeScan } from "./WhatWeScan";
import Link from "next/link";

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

  // Initialize analytics
  useAnalytics();

  const handleScanAgain = () => {
    resetChecks();
    setCurrentView("results");
  };

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-6 flex flex-col">
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
            <div>
              <AnimatePresence mode="wait">
                {!overallStatus ? (
                  <>
                    <ScanButton
                      isChecking={isChecking}
                      onScan={runSecurityChecks}
                    />

                    {/* What We Scan Section - Only shown when not scanning/showing results */}
                    {!isChecking && <WhatWeScan />}
                  </>
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

        {/* Blog Link Section - Bottom of page */}
        <div className="mt-16 text-center">
          <div className="max-w-lg mx-auto backdrop-blur-sm rounded-xl p-8 border border-gray-300 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-bold ">
                Learn More About WiFi Security
              </h3>
            </div>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              Understand what these security checks mean and get practical WiFi
              safety tips that actually work.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-base shadow-lg hover:shadow-xl"
            >
              Read Security Guides
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
