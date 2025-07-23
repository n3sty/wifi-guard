"use client";

import { motion } from "framer-motion";
import { SecurityCheck, OverallStatus } from "@/types/security";
import { useNetworkInfo } from "@/hooks/useNetworkInfo";

interface SecurityTipsProps {
  overallStatus: OverallStatus;
  checks: SecurityCheck[];
  onBack: () => void;
}

export function SecurityTips({ overallStatus, checks, onBack }: SecurityTipsProps) {
  const networkInfo = useNetworkInfo();

  const getContextSpecificTips = () => {
    const tips: string[] = [];
    
    // Add tips based on specific failed/warning checks
    checks.forEach(check => {
      if (check.status === "failed" || check.status === "warning") {
        switch (check.id) {
          case "https-check":
            if (check.status === "failed") {
              tips.push("Switch to HTTPS websites whenever possible - look for the lock icon in your browser");
              tips.push("Avoid entering passwords or personal information on HTTP sites");
            }
            break;
          case "response-time-check":
            if (check.status === "warning") {
              tips.push("Slow network performance detected - consider switching networks for better security");
              tips.push("Be extra cautious as slow networks can indicate traffic interception");
            }
            break;
          case "ssl-check":
            if (check.status === "failed") {
              tips.push("SSL certificate issues detected - avoid banking and financial transactions");
              tips.push("Consider using mobile data instead of this WiFi network");
            }
            break;
        }
      }
    });

    // Add network-specific tips
    if (networkInfo.isCellular) {
      tips.push("You're on cellular data - generally more secure than public WiFi");
      tips.push("Mobile networks provide built-in encryption from your carrier");
    } else if (networkInfo.isWiFi) {
      tips.push("Verify this WiFi network name with venue staff to avoid fake hotspots");
      tips.push("Look for password-protected networks instead of open WiFi when possible");
    }

    return tips;
  };

  const getGeneralTips = () => {
    const generalTips = [
      "Always verify network names with venue staff",
      'Look for "https://" in website address bars',
      "Disable automatic WiFi connections",
      "Use a reputable VPN for additional protection",
      "Keep your device software updated",
      "Enable two-factor authentication where possible",
    ];

    // Add network-specific general tips
    if (networkInfo.isSlowConnection) {
      generalTips.push("Slow connections may indicate network interference - be extra cautious");
    }

    return generalTips;
  };

  const getStatusSpecificTips = () => {
    switch (overallStatus) {
      case "safe":
        return [
          "Safe to access banking and financial services",
          "Secure for entering passwords and personal data",
          "Protected against common WiFi security threats",
          "Continue browsing with confidence",
        ];
      case "caution":
        return [
          "Avoid online banking and payment processing",
          "Do not enter passwords for critical accounts",
          "Consider using mobile data for sensitive tasks",
          "Verify network legitimacy with venue staff",
        ];
      case "danger":
        return [
          "Disconnect from this network immediately",
          "Switch to mobile data or secure alternative",
          "Change passwords if sensitive data was entered",
          "Report suspicious network to venue management",
        ];
      default:
        return [];
    }
  };

  const contextTips = getContextSpecificTips();
  const statusTips = getStatusSpecificTips();
  const generalTips = getGeneralTips();

  return (
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
          onClick={onBack}
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
          <div className="!size-10 rounded-lg bg-blue-100 flex items-center justify-center">
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
        {/* Status-specific tips */}
        {statusTips.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              What to do next:
            </h4>
            <div className="space-y-3">
              {statusTips.map((tip, index) => (
                <motion.div
                  key={`status-${index}`}
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
              ))}
            </div>
          </div>
        )}

        {/* Context-specific tips based on findings */}
        {contextTips.length > 0 && (
          <motion.div
            className="border-t border-gray-200 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">
              Based on Your Network Analysis:
            </h4>
            <div className="space-y-3">
              {contextTips.map((tip, index) => (
                <motion.div
                  key={`context-${index}`}
                  className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {tip}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* General tips */}
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
            {generalTips.map((tip, index) => (
              <motion.div
                key={`general-${index}`}
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
  );
}