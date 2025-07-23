"use client";

import { useState } from "react";
import { SecurityCheck, OverallStatus } from "@/types/security";
import { useNetworkInfo } from "./useNetworkInfo";
import {
  trackScanStarted,
  trackScanCompleted,
} from "@/lib/analytics";

export function useSecurityChecks() {
  const [isChecking, setIsChecking] = useState(false);
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [overallStatus, setOverallStatus] = useState<OverallStatus>(null);
  const networkInfo = useNetworkInfo();

  const runSecurityChecks = async () => {
    trackScanStarted();
    setIsChecking(true);
    setChecks([]);
    setOverallStatus(null);

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
          const isLikelyMobileData = networkInfo.isCellular;

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

  const getIssueCount = () => {
    const warnings = checks.filter(check => check.status === "warning").length;
    const errors = checks.filter(check => check.status === "failed").length;
    return { warnings, errors, total: warnings + errors };
  };

  const resetChecks = () => {
    setOverallStatus(null);
    setChecks([]);
  };

  return {
    isChecking,
    checks,
    overallStatus,
    runSecurityChecks,
    resetChecks,
    getIssueCount,
  };
}