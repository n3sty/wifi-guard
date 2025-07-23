"use client";

import { useNetworkInfo } from "@/hooks/useNetworkInfo";
import { motion } from "framer-motion";

export function NetworkIndicator() {
  const networkInfo = useNetworkInfo();

  if (!networkInfo.isSupported || !networkInfo.type) {
    return null;
  }

  const getCellularSafetyInfo = () => {
    if (!networkInfo.isCellular) return null;

    return {
      title: "Mobile Data Detected",
      message: "You're connected via cellular network",
      safetyLevel: "Generally More Secure",
      details: [
        "Mobile networks are typically more secure than public WiFi",
        "Your cellular provider encrypts data transmission",
        "Lower risk of man-in-the-middle attacks",
        "No shared network access with other users"
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    };
  };

  const getWiFiInfo = () => {
    if (!networkInfo.isWiFi) return null;

    return {
      title: "WiFi Connection",
      message: "Connected to WiFi network",
      safetyLevel: "Security Depends on Network",
      details: [
        "Public WiFi networks can pose security risks",
        "Ensure network legitimacy with venue staff",
        "Look for password-protected networks",
        "Avoid sensitive activities on unsecured networks"
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    };
  };

  const networkDisplayInfo = getCellularSafetyInfo() || getWiFiInfo();

  if (!networkDisplayInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 rounded-lg border ${networkDisplayInfo.bgColor} ${networkDisplayInfo.borderColor}`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${networkInfo.isCellular ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
        <div>
          <h4 className={`font-semibold ${networkDisplayInfo.color}`}>
            {networkDisplayInfo.title}
          </h4>
          <p className="text-sm text-gray-600">
            {networkDisplayInfo.message}
          </p>
        </div>
      </div>
      
      <div className="mb-3">
        <span className={`text-sm font-medium ${networkDisplayInfo.color}`}>
          Security Level: {networkDisplayInfo.safetyLevel}
        </span>
      </div>

      <div className="space-y-1">
        {networkDisplayInfo.details.map((detail, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {detail}
            </p>
          </div>
        ))}
      </div>

      {networkInfo.effectiveType && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Connection Speed: {networkInfo.effectiveType.toUpperCase()}
            {networkInfo.isSlowConnection && " (Consider switching to faster network for better experience)"}
          </p>
        </div>
      )}
    </motion.div>
  );
}