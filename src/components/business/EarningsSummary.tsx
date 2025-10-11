'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type Period = 'monthly' | 'quarterly' | 'yearly';

interface PeriodData {
  monthly: number;
  quarterly: number;
  yearly: number;
}

export default function EarningsSummary() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('monthly');

  const earningsData: PeriodData = {
    monthly: 12480.0,
    quarterly: 35240.0,
    yearly: 149600.0,
  };

  const periods: { key: Period; label: string }[] = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 to-red-500 p-6 shadow-lg"
    >
      <div className="mb-4">
        <h2 className="text-sm font-medium text-white/90">Total Earnings</h2>
        <p className="mt-2 text-4xl font-bold text-white">
          ₹
          {earningsData[selectedPeriod].toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="flex gap-3">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => setSelectedPeriod(period.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedPeriod === period.key
                ? 'bg-white text-red-500 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
