'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChartData {
  month: string;
  earnings: number;
}

const chartData: ChartData[] = [
  { month: 'Jan', earnings: 8500 },
  { month: 'Feb', earnings: 9200 },
  { month: 'Mar', earnings: 11000 },
  { month: 'Apr', earnings: 10500 },
  { month: 'May', earnings: 12000 },
  { month: 'Jun', earnings: 13500 },
  { month: 'Jul', earnings: 11800 },
  { month: 'Aug', earnings: 12480 },
  { month: 'Sep', earnings: 14200 },
];

export default function EarningsChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxEarnings = Math.max(...chartData.map((d) => d.earnings));
  const minEarnings = Math.min(...chartData.map((d) => d.earnings));
  const range = maxEarnings - minEarnings;

  const getYPosition = (earnings: number) => {
    return 100 - ((earnings - minEarnings) / range) * 80;
  };

  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * 100;
    const y = getYPosition(d.earnings);
    return { x, y, ...d };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Earnings Over Time
        </h3>
        <a
          href="#"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View Month
        </a>
      </div>

      {/* Chart Container */}
      <div className="relative h-64">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.2"
            />
          ))}

          {/* Area Fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === index ? '1.5' : '1'}
                fill="#3b82f6"
                className="transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute rounded-lg bg-gray-900 px-3 py-2 text-white shadow-lg"
            style={{
              left: `${points[hoveredIndex].x}%`,
              top: `${points[hoveredIndex].y}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <p className="text-xs font-medium">
              {chartData[hoveredIndex].month}
            </p>
            <p className="text-sm font-bold">
              ₹{chartData[hoveredIndex].earnings.toLocaleString('en-IN')}
            </p>
          </motion.div>
        )}
      </div>

      {/* X-Axis Labels */}
      <div className="mt-4 flex justify-between">
        {chartData.map((data, index) => (
          <span key={index} className="text-xs text-gray-500">
            {data.month}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
