'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAPI } from '../lib/mockApi';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = mockAPI.getCurrentSession();
    if (!session || !session.isAuthenticated) {
      // Not logged in -> redirect to login
      router.replace('/login');
      return;
    }

    // If allowedRoles provided, ensure the current user's type is permitted
    if (allowedRoles && allowedRoles.length > 0) {
      const userType = session.user.userType;
      if (!allowedRoles.includes(userType)) {
        // Redirect to the correct home for the user's role
        const redirectMap = {
          company: '/company/home',
          business: '/business/home',
          professional: '/professional/home',
        };
        const target = redirectMap[userType] || '/';
        router.replace(target);
        return;
      }
    }

    setLoading(false);
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Circular Loading Animation */}
          <div className="relative mb-6">
            {/* Outer static ring */}
            <div className="h-20 w-20 rounded-full border-4 border-gray-100" />

            {/* Animated spinning ring */}
            <motion.div
              className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent"
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

            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: '#f36565' }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full blur-xl"
              style={{ backgroundColor: '#f36565' }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Loading text with animation */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className="mb-1 text-lg font-semibold tracking-tight text-gray-800">
              <span style={{ color: '#f36565' }}>Wheel</span>
              <span className="text-gray-700">board</span>
            </h2>
            <motion.p
              className="text-sm font-medium text-gray-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Loading your experience...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return children;
}

// Role-specific wrappers to avoid passing arrays from TSX (typing issues)
export function CompanyProtected({ children }) {
  return <ProtectedRoute allowedRoles={['company']}>{children}</ProtectedRoute>;
}

export function BusinessProtected({ children }) {
  return (
    <ProtectedRoute allowedRoles={['business']}>{children}</ProtectedRoute>
  );
}

export function ProfessionalProtected({ children }) {
  return (
    <ProtectedRoute allowedRoles={['professional']}>{children}</ProtectedRoute>
  );
}
