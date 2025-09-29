'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ServiceCard {
  id: string;
  title: string;
  icon: ReactNode;
  color: 'blue' | 'teal' | 'orange' | 'pink' | 'yellow' | 'gray';
  onClick?: () => void;
}

interface ServiceCardsGridProps {
  services: ServiceCard[];
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
    iconColor: 'text-teal-500',
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
  gray: {
    bg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    border: 'border-gray-200',
    hoverBg: 'group-hover:bg-gray-100',
  },
};

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

export default function ServiceCardsGrid({ services }: ServiceCardsGridProps) {
  return (
    <motion.div
      className="mb-12"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={container}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((service) => {
          const colors = colorConfig[service.color];
          return (
            <motion.div
              key={service.id}
              variants={item}
              onClick={service.onClick}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border ${colors.border} bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-5 flex justify-center">
                <div
                  className={`rounded-full ${colors.bg} p-3.5 transition-colors duration-300 ${colors.hoverBg}`}
                >
                  <div className={`h-8 w-8 ${colors.iconColor}`}>
                    {service.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                {service.title}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Service Icons Components
export const VehicleIcon = () => (
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
      d="M8 21l4-7 4 7M3 7l4 4 4-4 4 4 4-4M5 3h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
    />
  </svg>
);

export const ProfessionalIcon = () => (
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
);

export const ExpensesIcon = () => (
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
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const HireIcon = () => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const ServicesIcon = () => (
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
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

export const DashboardIcon = () => (
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
);
