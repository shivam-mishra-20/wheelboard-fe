'use client';

import React from 'react';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/lib/mockApi';

interface VehicleRecentTripsCardProps {
  vehicle: Vehicle;
}

export default function VehicleRecentTripsCard({
  vehicle,
}: VehicleRecentTripsCardProps) {
  const hasTrips = vehicle.recentTrips && vehicle.recentTrips.length > 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recent Trips</h3>
        <Button variant="ghost" size="sm" className="gap-1 text-[#3B82F6]">
          <span>View More</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {hasTrips ? (
        <div className="space-y-3">
          {vehicle.recentTrips.map((trip, index) => (
            <div
              key={`${trip.id}-${index}`}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Trip Id: {trip.id}
                  </p>
                  <p className="text-sm text-gray-600">{trip.route}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(trip.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {trip.distance && (
                  <p className="text-xs text-gray-500">{trip.distance}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="mb-2 text-lg font-semibold text-gray-900">
            No Recent Trips
          </h4>
          <p className="max-w-xs text-sm text-gray-500">
            This vehicle hasn&apos;t completed any trips recently. Trip history
            will appear here once available.
          </p>
        </div>
      )}

      {/* Trip Summary */}
      {hasTrips && (
        <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-blue-600">
                {vehicle.totalTrips}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-indigo-600">
                {vehicle.recentTrips.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
