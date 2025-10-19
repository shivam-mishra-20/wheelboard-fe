import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 2.5 seconds for a clean, modern feel
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) onLoadingComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loading-container"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      >
        {/* Main Content */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Circular Loading Animation */}
          <div className="relative mb-8">
            {/* Outer ring - static */}
            <div
              className="h-16 w-16 rounded-full border-4 border-gray-100"
              style={{ borderColor: '#f5f5f5' }}
            />

            {/* Inner animated ring */}
            <motion.div
              className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent"
              style={{
                borderTopColor: '#f36565',
                borderRightColor: '#f36565',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Center dot */}
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: '#f36565' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>

          {/* Brand Text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
              <span style={{ color: '#f36565' }}>Wheel</span>
              <span className="text-gray-700">board</span>
            </h1>
            <motion.p
              className="text-sm font-medium text-gray-500"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Loading...
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
