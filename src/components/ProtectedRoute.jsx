'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAPI } from '../lib/mockApi';

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse rounded-lg bg-gray-100 p-6 text-gray-500">
          Loading...
        </div>
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
