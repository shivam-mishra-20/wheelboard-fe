import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingProgress < 100) {
        setLoadingProgress((prev) => Math.min(prev + 4, 100));
      } else {
        setTimeout(() => {
          setIsVisible(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 500);
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [loadingProgress, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loading-container"
        initial={{ opacity: 1 }}
        animate={{ opacity: loadingProgress === 100 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      >
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, #000 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary-100/30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary-100/30 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="relative mb-12"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle, rgba(243,105,105,0.3) 0%, transparent 70%)',
              }}
            />
            <motion.img
              src="/Logo.png"
              alt="Wheelboard Logo"
              className="relative h-24 w-24 object-contain"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="mb-2 font-poppins text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Wheel
              </span>
              <span className="text-gray-800">board</span>
            </h1>
            <p className="text-sm font-medium text-gray-400">
              Your logistics partner
            </p>
          </motion.div>
          <motion.div
            className="w-64"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <motion.span
                className="text-xs font-medium text-gray-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {loadingProgress < 30
                  ? 'Initializing...'
                  : loadingProgress < 70
                    ? 'Loading resources...'
                    : loadingProgress < 95
                      ? 'Almost ready...'
                      : 'Complete'}
              </motion.span>
              <span className="text-xs font-bold text-gray-800">
                {loadingProgress}%
              </span>
            </div>
          </motion.div>
          <motion.div
            className="mt-6 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
