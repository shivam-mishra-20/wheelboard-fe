'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ServiceCard {
  label: string;
  icon: string;
  route?: string;
}

const serviceCards: ServiceCard[] = [
  {
    label: 'feeds',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    route: '/business/feeds',
  },
  {
    label: 'Earnings',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    route: '/business/earnings',
  },
  {
    label: 'Hire',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    route: '/business/jobs',
  },
  {
    label: 'Active Listings',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    route: '/business/listings',
  },
];

export default function ServiceCardsGrid() {
  const router = useRouter();

  const handleCardClick = (card: ServiceCard) => {
    if (card.route) {
      router.push(card.route);
    }
  };

  return (
    <div className="mb-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Comprehensive solutions for your business needs
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {serviceCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => handleCardClick(card)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-lg"
          >
            <div className="relative mb-4 flex justify-center">
              <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                <svg
                  className="h-8 w-8 text-primary-600 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={card.icon}
                  />
                </svg>
              </div>
            </div>
            <h3 className="relative text-sm font-semibold text-gray-800 transition-colors duration-300 group-hover:text-primary-700">
              {card.label}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
