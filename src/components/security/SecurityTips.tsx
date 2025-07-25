"use client";

import { motion } from "framer-motion";
import { SecurityCheck, OverallStatus } from "@/types/security";
import { useNetworkInfo } from "@/hooks/useNetworkInfo";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";

interface SecurityTipsProps {
  overallStatus: OverallStatus;
  checks: SecurityCheck[];
  onBack: () => void;
}

interface TipWithPriority {
  text: string;
  priority: "critical" | "important" | "general" | "optional";
}

export function SecurityTips({
  overallStatus,
  checks,
  onBack,
}: SecurityTipsProps) {
  const networkInfo = useNetworkInfo();

  const getContextSpecificTips = (): TipWithPriority[] => {
    const tips: TipWithPriority[] = [];

    // Add tips based on specific failed/warning checks
    checks.forEach((check) => {
      if (check.status === "failed" || check.status === "warning") {
        const priority = check.status === "failed" ? "critical" : "important";

        switch (check.id) {
          case "https-check":
            if (check.status === "failed") {
              tips.push({
                text: "Switch to HTTPS websites whenever possible - look for the lock icon in your browser",
                priority,
              });
              tips.push({
                text: "Avoid entering passwords or personal information on HTTP sites",
                priority,
              });
            }
            break;
          case "response-time-check":
            if (check.status === "warning") {
              tips.push({
                text: "Slow network performance detected - consider switching networks for better security",
                priority,
              });
            }
            break;
          case "ssl-check":
            if (check.status === "failed") {
              tips.push({
                text: "SSL certificate issues detected - avoid banking and financial transactions",
                priority,
              });
              tips.push({
                text: "Consider using mobile data instead of this WiFi network",
                priority,
              });
            }
            break;
        }
      }
    });

    // Add network-specific tips
    if (networkInfo.isCellular) {
      tips.push({
        text: "You're on cellular data - generally more secure than public WiFi",
        priority: "general",
      });
    } else if (networkInfo.isWiFi) {
      tips.push({
        text: "Verify this WiFi network name with venue staff to avoid fake hotspots",
        priority: "important",
      });
    }

    return tips.slice(0, 3); // Maximum 3 context tips
  };

  const getStatusSpecificTips = (): TipWithPriority[] => {
    const tips: TipWithPriority[] = [];

    switch (overallStatus) {
      case "safe":
        tips.push(
          {
            text: "Safe to access banking and financial services",
            priority: "general",
          },
          {
            text: "Secure for entering passwords and personal data",
            priority: "general",
          },
          {
            text: "Protected against common WiFi security threats",
            priority: "optional",
          },
          { text: "Continue browsing with confidence", priority: "optional" }
        );
        break;
      case "caution":
        tips.push(
          {
            text: "Avoid online banking and payment processing",
            priority: "important",
          },
          {
            text: "Do not enter passwords for critical accounts",
            priority: "important",
          },
          {
            text: "Consider using mobile data for sensitive tasks",
            priority: "general",
          },
          {
            text: "Verify network legitimacy with venue staff",
            priority: "general",
          },
          {
            text: "Be extra cautious with file downloads",
            priority: "optional",
          }
        );
        break;
      case "danger":
        tips.push(
          {
            text: "Disconnect from this network immediately",
            priority: "critical",
          },
          {
            text: "Switch to mobile data or secure alternative",
            priority: "critical",
          },
          {
            text: "Change passwords if sensitive data was entered",
            priority: "important",
          },
          {
            text: "Report suspicious network to venue management",
            priority: "general",
          },
          { text: "Run security scans on your device", priority: "optional" }
        );
        break;
      default:
        return [];
    }

    return tips.slice(0, 5); // Maximum 5 status tips
  };

  const getImmediateActionTips = (): TipWithPriority[] => {
    const immediateTips: TipWithPriority[] = [];

    // Only include tips that are directly actionable based on the current scan results
    if (overallStatus === "danger") {
      immediateTips.push({
        text: "Consider switching to mobile data for sensitive activities",
        priority: "critical",
      });
    }

    if (overallStatus === "caution" || overallStatus === "danger") {
      immediateTips.push({
        text: "Verify this network name with venue staff before proceeding",
        priority: "important",
      });
    }

    // Add context-aware tips based on failed checks
    const failedChecks = checks.filter(check => check.status === "failed");
    
    if (failedChecks.some(check => check.id === "https-check")) {
      immediateTips.push({
        text: "Only visit websites that show 'https://' and the lock icon",
        priority: "important",
      });
    }

    return immediateTips.slice(0, 3); // Maximum 3 immediate action tips
  };

  const getTipColor = (
    priority: "critical" | "important" | "general" | "optional"
  ) => {
    switch (priority) {
      case "critical":
        return {
          bg: "bg-red-50 border-red-200",
          dot: "bg-red-500",
          text: "text-red-800",
          number: "bg-red-100 text-red-700",
        };
      case "important":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          dot: "bg-yellow-500",
          text: "text-yellow-800",
          number: "bg-yellow-100 text-yellow-700",
        };
      case "general":
        return {
          bg: "bg-blue-50 border-blue-200",
          dot: "bg-blue-400",
          text: "text-blue-800",
          number: "bg-blue-100 text-blue-700",
        };
      case "optional":
        return {
          bg: "bg-gray-50 border-gray-200",
          dot: "bg-gray-400",
          text: "text-gray-700",
          number: "bg-gray-100 text-gray-600",
        };
    }
  };

  const contextTips = getContextSpecificTips();
  const statusTips = getStatusSpecificTips();
  const immediateActionTips = getImmediateActionTips();

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
      className="space-y-4"
    >
      {/* Header with Back Button */}
      <motion.div
        className="flex items-center mb-6 gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={onBack}
          className="rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className="!size-5 text-gray-600" />
        </motion.button>
        <div className="flex items-center space-x-3">
          <div className="!size-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <InfoIcon className="!size-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-xl">Security Tips</h3>
            <p className="text-gray-600 text-sm">
              Follow these guidelines to stay safe
            </p>
          </div>
        </div>
      </motion.div>

      {/* Context-specific tips based on findings */}
      {contextTips.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <div className="!size-6 rounded-lg bg-orange-100 flex items-center justify-center">
                <InfoIcon className="!size-4 text-orange-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900 font-bold text-lg">
                  Based on Your Network Analysis
                </h4>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                  CONTEXT
                </span>
              </div>
              <div className="space-y-3">
                {contextTips.map((tip, index) => {
                  const colors = getTipColor(tip.priority);
                  return (
                    <motion.div
                      key={`context-${index}`}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${colors.bg}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${colors.dot}`}
                      ></div>
                      <p
                        className={`leading-relaxed text-sm font-medium ${colors.text}`}
                      >
                        {tip.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status-specific tips */}
      {statusTips.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <h4 className="text-gray-900 font-bold text-lg">
                  What to do next
                </h4>
              </div>
              <div className="space-y-3">
                {statusTips.map((tip, index) => {
                  const colors = getTipColor(tip.priority);
                  return (
                    <motion.div
                      key={`status-${index}`}
                      className={`flex items-start space-x-3 p-4 rounded-lg border ${colors.bg}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                      }}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${colors.number}`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`leading-relaxed font-medium ${colors.text}`}
                      >
                        {tip.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Immediate Actions Section */}
      {immediateActionTips.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <div className="!size-6 rounded-lg bg-orange-100 flex items-center justify-center">
                <InfoIcon className="!size-4 text-orange-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900 font-bold text-lg">
                  Immediate Actions
                </h4>
              </div>
              <div className="space-y-2">
                {immediateActionTips.map((tip, index) => {
                  const colors = getTipColor(tip.priority);
                  return (
                    <motion.div
                      key={`immediate-${index}`}
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.1,
                      }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${colors.dot}`}
                      ></div>
                      <p
                        className={`text-sm leading-relaxed ${colors.text}`}
                      >
                        {tip.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Comprehensive Security Guide Link */}
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-blue-900 font-bold text-lg mb-2">
              Want More Security Tips?
            </h4>
            <p className="text-blue-700 text-sm mb-4">
              Learn about WiFi security protocols, common threats, and comprehensive safety practices.
            </p>
            <motion.button
              onClick={() => window.open('/security-info', '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <InfoIcon className="!size-4" />
              Complete Security Guide
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
