'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface QuickAction {
  id: string;
  title: string;
  icon: ReactNode;
  color: 'blue' | 'teal' | 'orange' | 'pink' | 'yellow' | 'purple';
  onClick?: () => void;
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    border: 'border-blue-200',
    hoverBg: 'group-hover:bg-blue-100',
  },
  teal: {
    bg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    border: 'border-teal-200',
    hoverBg: 'group-hover:bg-teal-100',
  },
  orange: {
    bg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    border: 'border-orange-200',
    hoverBg: 'group-hover:bg-orange-100',
  },
  pink: {
    bg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    border: 'border-pink-200',
    hoverBg: 'group-hover:bg-pink-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    border: 'border-yellow-200',
    hoverBg: 'group-hover:bg-yellow-100',
  },
  purple: {
    bg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    border: 'border-purple-200',
    hoverBg: 'group-hover:bg-purple-100',
  },
};

const quickActions: QuickAction[] = [
  {
    id: 'calendar',
    title: 'My Calendar',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    color: 'blue',
    onClick: () => console.log('Calendar clicked'),
  },
  {
    id: 'track',
    title: 'Track Trip',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      </svg>
    ),
    color: 'teal',
    onClick: () => console.log('Track Trip clicked'),
  },
  {
    id: 'earning',
    title: 'Earning',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    color: 'orange',
  },
  {
    id: 'expenses',
    title: 'Expenses',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    color: 'pink',
    onClick: () => console.log('Expenses clicked'),
  },
  {
    id: 'learning',
    title: 'Learning',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    color: 'yellow',
    onClick: () => console.log('Learning clicked'),
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    color: 'purple',
    onClick: () => console.log('Profile clicked'),
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300 },
  },
};

export default function QuickActions() {
  const router = useRouter();

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'earning':
        router.push('/professional/earnings');
        break;
      case 'calendar':
        router.push('/professional/calendar');
        break;
      case 'track':
        router.push('/professional/trips');
        break;
      case 'expenses':
        router.push('/professional/expenses');
        break;
      case 'learning':
        router.push('/professional/learning');
        break;
      case 'profile':
        router.push('/professional/profile');
        break;
      default:
        console.log('Action clicked:', actionId);
    }
  };

  return (
    <motion.div
      className="mb-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={container}
    >
      <div className="mb-6 text-center">
        <h2 className="bg-gradient-premium bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
          Quick Actions
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your most used tools and features
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((action) => {
          const colors = colorConfig[action.color];
          return (
            <motion.div
              key={action.id}
              variants={item}
              onClick={() => handleActionClick(action.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 ${colors.border} bg-gradient-to-br from-white to-gray-50 p-7 text-center shadow-premium transition-all duration-500 hover:-translate-y-2 hover:shadow-premium-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Hover Gradient Overlay */}
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${colors.bg}`}
              ></div>

              {/* Icon Container */}
              <div className="relative mb-6 flex justify-center">
                <div
                  className={`rounded-2xl ${colors.bg} p-4 shadow-lg ring-4 ring-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl ${colors.hoverBg}`}
                >
                  <div
                    className={`h-10 w-10 ${colors.iconColor} transition-all duration-300 group-hover:scale-110`}
                  >
                    {action.icon}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="relative text-sm font-bold text-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:text-gray-900">
                {action.title}
              </h3>

              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
