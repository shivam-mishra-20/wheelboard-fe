'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingSOSButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push('/professional/sos')}
      className="fixed bottom-24 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95 lg:bottom-8 lg:right-8 lg:h-20 lg:w-20"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Pulse animation */}
      <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>

      {/* Icon */}
      <AlertTriangle className="relative h-8 w-8 text-white lg:h-10 lg:w-10" />

      {/* Label */}
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-red-600 lg:text-sm">
        SOS
      </span>
    </motion.button>
  );
}
