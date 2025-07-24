"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function WhatWeScan() {
  const [isExpanded, setIsExpanded] = useState(false);

  const whatWeCheck = [
    {
      name: "HTTPS Protection",
      description: "Verifies your connection uses encrypted HTTPS",
      blogPost: "https-protection-explained",
      why: "Your first line of defense against data interception",
    },
    {
      name: "SSL Certificates",
      description: "Tests certificate validity on trusted websites",
      blogPost: "ssl-certificates-simple",
      why: "Detects man-in-the-middle attacks and network tampering",
    },
    {
      name: "Network Performance",
      description: "Measures response times to detect anomalies",
      blogPost: "network-performance-security",
      why: "Unusual slowness can indicate traffic interception",
    },
  ];

  const whatWeCant = [
    {
      name: "Evil Twin Networks",
      description: "Fake WiFi networks that copy legitimate names",
      why: "Browser-based tools can't see network infrastructure",
    },
    {
      name: "Packet Sniffing",
      description: "Someone secretly capturing your data",
      why: "Modern packet capture is invisible to regular users",
    },
    {
      name: "Router Compromises",
      description: "Hacked or maliciously configured routers",
      why: "We can only test what browsers can access",
    },
    {
      name: "Advanced Attacks",
      description: "Sophisticated network-level manipulation",
      why: "These require specialized security tools to detect",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 my-2 md:my-4">
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer group shadow-lg"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              What does WiFi Guard check?
            </h3>
            <p className="text-gray-600 text-base">
              Understanding what we scan (and what we can&apos;t)
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-6 w-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl mt-2 p-8 border border-gray-300 shadow-xl">
              {/* What we check */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="text-xl font-bold text-gray-900">
                    What We Check
                  </h4>
                </div>
                <div className="space-y-4">
                  {whatWeCheck.map((check, index) => (
                    <motion.div
                      key={check.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-5 border border-green-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-gray-900 text-lg">
                          {check.name}
                        </h5>
                        <Badge
                          asChild
                          className="bg-blue-200 border-blue-200/50 text-blue-600 [a&]:hover:bg-blue-300 [a&]:hover:border-blue-300/50"
                        >
                          <Link
                            href={`/blog/${check.blogPost}`}
                            className="text-blue-600 hover:text-blue-700 transition-colors text-sm flex items-center gap-1 bg-blue-50 px-3 rounded-full border border-blue-200 hover:border-blue-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookOpen className="h-3 w-3" />
                            Learn more
                          </Link>
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-base mb-3 leading-relaxed">
                        {check.description}
                      </p>
                      <p className="text-green-700 text-sm font-medium italic">
                        💡 {check.why}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* What we can't check */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h4 className="text-xl font-bold text-gray-900">
                    What We Can&apos;t Detect
                  </h4>
                </div>
                <div className="space-y-4">
                  {whatWeCant.map((limitation, index) => (
                    <motion.div
                      key={limitation.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-5 border border-red-200 hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-semibold text-gray-900 text-lg mb-3">
                        {limitation.name}
                      </h5>
                      <p className="text-gray-700 text-base mb-3 leading-relaxed">
                        {limitation.description}
                      </p>
                      <p className="text-red-700 text-sm font-medium italic">
                        ⚠️ {limitation.why}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-blue-50 rounded-lg p-6 border border-blue-200 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-bold text-lg mb-2">
                      Want to learn more?
                    </p>
                    <p className="text-gray-700 text-base">
                      Read our detailed guides about WiFi security and what
                      these checks mean.
                    </p>
                  </div>
                  <Button asChild variant="secondary">
                    <Link href="/blog" onClick={(e) => e.stopPropagation()}>
                      Read Blog
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
