'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: string;
  earnings: number;
  bookings: number;
  color: string;
}

const services: Service[] = [
  {
    id: '1',
    name: 'Tyre Replacement',
    icon: '🔧',
    earnings: 3200,
    bookings: 8,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: '2',
    name: 'Engine Repair',
    icon: '⚙️',
    earnings: 4800,
    bookings: 12,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: '3',
    name: 'Battery Service',
    icon: '🔋',
    earnings: 2400,
    bookings: 15,
    color: 'bg-green-50 text-green-600',
  },
];

export default function ServiceBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Service Breakdown
      </h3>
      <div className="space-y-3">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}
              >
                <span className="text-2xl">{service.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-500">
                  {service.bookings} bookings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ₹{service.earnings.toLocaleString('en-IN')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
