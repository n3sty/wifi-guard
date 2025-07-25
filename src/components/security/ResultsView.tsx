"use client";

import { motion } from "framer-motion";
import { OverallStatus } from "@/types/security";
import { 
  trackShowDetails, 
  trackShowEducation, 
  trackScanAgain 
} from "@/lib/analytics";

interface ResultsViewProps {
  overallStatus: OverallStatus;
  issueCount: { warnings: number; errors: number; total: number };
  onShowEducation: () => void;
  onShowDetails: () => void;
  onScanAgain: () => void;
}

export function ResultsView({
  overallStatus,
  issueCount,
  onShowEducation,
  onShowDetails,
  onScanAgain,
}: ResultsViewProps) {
  const getStatusDisplay = () => {
    switch (overallStatus) {
      case "safe":
        return {
          title: "Network is Safe",
          message: "All security checks passed. Your connection is protected and safe for normal use.",
          color: "text-green-600",
          bgColor: "border-green-500",
          icon: (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
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
          ),
        };
      case "caution":
        return {
          title: "Use with Caution",
          message: "Some security issues were identified. Avoid sensitive activities until resolved.",
          color: "text-yellow-600",
          bgColor: "border-yellow-500",
          icon: (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600"
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
          ),
        };
      case "danger":
        return {
          title: "Security Risk Detected",
          message: "Critical security vulnerabilities detected. Disconnect immediately to protect your data.",
          color: "text-red-600",
          bgColor: "border-red-500",
          icon: (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
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
          ),
        };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();
  if (!statusDisplay) return null;

  return (
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
        className={`border-2 rounded-xl p-6 sm:p-8 text-center bg-white shadow-lg ${statusDisplay.bgColor}`}
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
          {statusDisplay.icon}
        </motion.div>

        {/* Result Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${statusDisplay.color}`}>
            {statusDisplay.title}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg max-w-md mx-auto">
            {statusDisplay.message}
          </p>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.button
          onClick={() => {
            trackShowEducation();
            onShowEducation();
          }}
          className="py-3 px-3 sm:px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
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
            onShowDetails();
          }}
          className="py-3 px-3 sm:px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium relative text-sm"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="hidden sm:inline">Technical Details</span>
          <span className="sm:hidden">Details</span>
          {issueCount.total > 0 && (
            <motion.div
              className={`absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                issueCount.errors > 0 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              {issueCount.total}
            </motion.div>
          )}
        </motion.button>

        <motion.button
          onClick={() => {
            trackScanAgain();
            onScanAgain();
          }}
          className="py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
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
  );
}