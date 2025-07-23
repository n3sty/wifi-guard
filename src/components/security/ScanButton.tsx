"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ScanButtonProps {
  isChecking: boolean;
  onScan: () => void;
}

export function ScanButton({ isChecking, onScan }: ScanButtonProps) {
  return (
    <motion.div
      key="initial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="text-center"
    >
      <motion.button
        onClick={onScan}
        disabled={isChecking}
        className={`
          w-full py-6 px-8 rounded-xl font-semibold text-xl
          ${
            isChecking
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
          transition-all duration-300 shadow-lg
        `}
        whileHover={!isChecking ? { scale: 1.02, y: -1 } : {}}
        whileTap={!isChecking ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {isChecking ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center space-x-3"
            >
              <motion.div
                className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span>Checking your network...</span>
            </motion.div>
          ) : (
            <motion.span
              key="button-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Check Network Security
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {!isChecking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-6"
          >
            <p className="text-gray-600 text-base mb-4">
              Get instant security analysis in seconds
            </p>

            {/* Simple status indicators */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Safe</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Caution</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Risk</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}