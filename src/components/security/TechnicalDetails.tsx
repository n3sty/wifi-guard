"use client";

import { SecurityCheck } from "@/types/security";
import { motion } from "framer-motion";
import { ArrowLeftIcon, FileSliders } from "lucide-react";
import { CheckIcon } from "./CheckIcon";

interface TechnicalDetailsProps {
  checks: SecurityCheck[];
  onBack: () => void;
}

export function TechnicalDetails({ checks, onBack }: TechnicalDetailsProps) {
  return (
    <motion.div
      key="details-view"
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
            <FileSliders className="!size-6 text-blue-600" />
          </div>
          <h3 className="text-gray-900 font-bold text-xl">
            Technical Analysis
          </h3>
        </div>
      </motion.div>

      {checks.map((check, index) => (
        <motion.div
          key={check.id}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.3 + index * 0.1,
            duration: 0.4,
          }}
        >
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <CheckIcon status={check.status} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-gray-900 font-bold text-lg">
                  {check.name}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    check.status === "passed"
                      ? "bg-green-100 text-green-700"
                      : check.status === "warning"
                      ? "bg-yellow-100 text-yellow-700"
                      : check.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {check.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-3">{check.message}</p>

              {check.details && (
                <motion.div
                  className="bg-gray-50 rounded-lg p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {check.details}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
