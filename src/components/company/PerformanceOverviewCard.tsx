'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Zap, Shield } from 'lucide-react';
import { Driver } from '@/lib/mockApi';

interface PerformanceOverviewCardProps {
  driver: Driver;
}

export default function PerformanceOverviewCard({
  driver,
}: PerformanceOverviewCardProps) {
  const [animatedValues, setAnimatedValues] = useState({
    timelyDelivery: 0,
    tripEfficiency: 0,
    safety: 0,
  });

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        timelyDelivery: Math.round(
          driver.performance.timelyDelivery * progress
        ),
        tripEfficiency: Math.round(
          driver.performance.tripEfficiency * progress
        ),
        safety: Math.round(driver.performance.safety * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          timelyDelivery: driver.performance.timelyDelivery,
          tripEfficiency: driver.performance.tripEfficiency,
          safety: driver.performance.safety,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [driver.performance]);

  const metrics = [
    {
      label: 'Timely Delivery',
      value: animatedValues.timelyDelivery,
      icon: Clock,
      color: 'from-green-400 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Trip Efficiency',
      value: animatedValues.tripEfficiency,
      icon: Zap,
      color: 'from-[#F36565] to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-[#F36565]',
    },
    {
      label: 'Safety Score',
      value: animatedValues.safety,
      icon: Shield,
      color: 'from-[#3B82F6] to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-[#3B82F6]',
    },
  ];

  const overallPerformance = Math.round(
    (animatedValues.timelyDelivery +
      animatedValues.tripEfficiency +
      animatedValues.safety) /
      3
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Performance Overview
        </h3>
        <div className="rounded-full bg-gradient-to-r from-[#F36565] to-[#3B82F6] px-3 py-1 text-sm font-semibold text-white">
          {overallPerformance}% Overall
        </div>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="space-y-2">
              {/* Label & Value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`${metric.bgColor} flex items-center justify-center rounded-lg p-2`}
                  >
                    <Icon className={`h-5 w-5 ${metric.textColor}`} />
                  </div>
                  <span className="font-semibold text-gray-700">
                    {metric.label}
                  </span>
                </div>
                <span className={`text-lg font-bold ${metric.textColor}`}>
                  {metric.value}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-300 ease-out`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600">
          {overallPerformance >= 90
            ? '🎉 Excellent performance! Keep up the great work.'
            : overallPerformance >= 80
              ? '👍 Good performance with room for improvement.'
              : overallPerformance >= 70
                ? '📈 Developing driver with growth potential.'
                : '⚠️ Performance needs attention and improvement.'}
        </p>
      </div>
    </div>
  );
}
