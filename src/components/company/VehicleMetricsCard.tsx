'use client';

import React from 'react';
import { TrendingUp, DollarSign, Calendar, Activity } from 'lucide-react';
import { Vehicle } from '@/lib/mockApi';

interface VehicleMetricsCardProps {
  vehicle: Vehicle;
}

export default function VehicleMetricsCard({
  vehicle,
}: VehicleMetricsCardProps) {
  const metrics = [
    {
      label: 'Avg. Run',
      value: `${vehicle.metrics.avgRun.toLocaleString()} KM`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Trip Efficiency',
      value: `Rs. ${vehicle.metrics.tripEfficiency}/KM`,
      icon: DollarSign,
      color: 'text-[#F36565]',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
    },
    {
      label: 'Monthly Usage',
      value: `${vehicle.metrics.monthlyUsage.toLocaleString()} KM`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Cost per KM',
      value: `Rs. ${vehicle.metrics.costPerKM}`,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="mb-6 text-xl font-bold text-gray-900">Vehicle Metrics</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`rounded-lg p-4 ${metric.bgColor} border border-gray-200`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </p>
                  <p className={`text-lg font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Indicators */}
      <div className="mt-6 flex gap-2">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            vehicle.statusBadge === 'In Transit'
              ? 'bg-blue-100 text-blue-800'
              : vehicle.statusBadge === 'Assigned'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              vehicle.statusBadge === 'In Transit'
                ? 'bg-blue-600'
                : vehicle.statusBadge === 'Assigned'
                  ? 'bg-green-600'
                  : 'bg-gray-600'
            }`}
          />
          {vehicle.statusBadge === 'In Transit'
            ? 'In Transit'
            : vehicle.statusBadge === 'Assigned'
              ? 'Assigned'
              : 'Available'}
        </div>
      </div>
    </div>
  );
}
