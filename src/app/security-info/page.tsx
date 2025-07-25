"use client";

import { motion } from "framer-motion";
import { 
  ShieldIcon, 
  WifiIcon, 
  AlertTriangleIcon, 
  LockIcon, 
  EyeOffIcon, 
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  ShieldAlertIcon,
  GlobeIcon
} from "lucide-react";
import Link from "next/link";

export default function SecurityInfoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <ShieldIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            WiFi Security Guide
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about staying safe on public WiFi networks
          </p>
        </motion.div>

        {/* App Limitations Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-start gap-4">
            <AlertTriangleIcon className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Important: Understanding This Tool&apos;s Limitations
              </h3>
              <div className="text-yellow-700 space-y-2">
                <p>
                  WiFi Guard provides basic security checks that run in your browser. While helpful for identifying common risks, it cannot:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Detect all sophisticated network attacks</li>
                  <li>Access low-level WiFi encryption details (WPA/WEP detection)</li>
                  <li>Identify all forms of network monitoring or interference</li>
                  <li>Replace comprehensive security tools or VPN protection</li>
                </ul>
                <p className="font-medium">
                  Use this tool as a starting point, but always follow best practices for public WiFi safety.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* WiFi Security Protocols */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <LockIcon className="w-8 h-8 text-blue-600" />
            Understanding WiFi Security
          </h2>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Secure Protocols */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-800">Secure Protocols</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">WPA3 (Best)</h4>
                  <p className="text-green-700 text-sm">
                    Latest security standard with advanced encryption and protection against password attacks. Look for networks using WPA3 when available.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">WPA2 (Good)</h4>
                  <p className="text-green-700 text-sm">
                    Widely used and generally secure with AES encryption. Most public networks use WPA2. Safe for most activities when properly configured.
                  </p>
                </div>
              </div>
            </div>

            {/* Insecure Protocols */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircleIcon className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-800">Insecure Protocols</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">WEP (Avoid)</h4>
                  <p className="text-red-700 text-sm">
                    Obsolete security protocol that can be cracked in minutes. Never connect to WEP networks for sensitive activities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Open Networks (Dangerous)</h4>
                  <p className="text-red-700 text-sm">
                    No encryption at all. Anyone can intercept your data. Only use for basic browsing with HTTPS websites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Common Threats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <ShieldAlertIcon className="w-8 h-8 text-red-600" />
            Common WiFi Threats
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <EyeOffIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Evil Twin Attacks</h3>
              <p className="text-gray-600 text-sm">
                Fake WiFi hotspots that mimic legitimate networks to steal your data. Often found in airports, cafes, and hotels.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <WifiIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Man-in-the-Middle</h3>
              <p className="text-gray-600 text-sm">
                Attackers intercept communication between you and websites, potentially stealing passwords and personal data.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <GlobeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">DNS Spoofing</h3>
              <p className="text-gray-600 text-sm">
                Redirecting your web requests to malicious websites that look legitimate to harvest your login credentials.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Best Practices */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            WiFi Safety Best Practices
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">✅ Do This</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Verify network names with venue staff</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Look for HTTPS (🔒) in website addresses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Use a reputable VPN for additional protection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Keep your devices updated</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">❌ Avoid This</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Banking on unsecured networks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Auto-connecting to unknown networks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Downloading files from untrusted sources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Entering passwords on HTTP sites</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Trusting networks with suspicious names</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Reference */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <InfoIcon className="w-8 h-8 text-blue-600" />
            Quick Security Checklist
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <p className="text-blue-800 font-medium mb-4">
              Before connecting to any public WiFi:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Network name matches venue signage</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Staff confirmed network legitimacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Using WPA2 or WPA3 security</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">VPN is enabled and connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Auto-connect disabled for other networks</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Device firewall is enabled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-white border border-gray-200 rounded-xl p-6 sm:p-8"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Ready to Check Your Network?
          </h3>
          <p className="text-gray-600 mb-6">
            Use WiFi Guard to perform basic security checks on your current connection
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ShieldIcon className="w-5 h-5" />
            Scan Current Network
          </Link>
        </motion.div>

        {/* Blog Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Read our detailed security guides
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}