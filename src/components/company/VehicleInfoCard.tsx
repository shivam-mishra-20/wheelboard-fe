'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/lib/mockApi';
import LeaseVehicleModal, { LeaseFormData } from './LeaseVehicleModal';

interface VehicleInfoCardProps {
  vehicle: Vehicle;
  onChangeDriver: () => void;
  onContactDriver: () => void;
  onLeaseSubmit: (leaseData: LeaseFormData) => void;
  onLeaseRemove: () => void;
}

export default function VehicleInfoCard({
  vehicle,
  onChangeDriver,
  onContactDriver,
  onLeaseSubmit,
  onLeaseRemove,
}: VehicleInfoCardProps) {
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [showLeaseToggle, setShowLeaseToggle] = useState(false);

  const handleLeaseToggle = (checked: boolean) => {
    if (checked) {
      setIsLeaseModalOpen(true);
    } else {
      onLeaseRemove();
      setShowLeaseToggle(false);
    }
  };

  const handleLeaseSubmit = (leaseData: LeaseFormData) => {
    onLeaseSubmit(leaseData);
    setShowLeaseToggle(true);
  };
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      {/* Gradient Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-[#F36565] via-purple-500 to-[#3B82F6]" />

      {/* Vehicle Image & Info */}
      <div className="p-6">
        <div className="mb-6">
          {/* Status Badge and Ownership */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  vehicle.statusBadge === 'In Transit'
                    ? 'bg-orange-100 text-orange-800'
                    : vehicle.statusBadge === 'Assigned'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {vehicle.statusBadge}
              </div>
              {/* Ownership Badge */}
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  vehicle.ownership === 'Owned'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {vehicle.ownership}
              </div>
            </div>
            {vehicle.year && (
              <span className="text-sm text-gray-500">
                Year: {vehicle.year}
              </span>
            )}
          </div>

          {/* Vehicle Image */}
          <div className="mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              width={400}
              height={192}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Vehicle Name & Registration */}
          <div className="mb-4 text-center">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">
              {vehicle.manufacturer || vehicle.name}
            </h2>
            <p className="text-lg font-semibold text-[#F36565]">
              {vehicle.registrationNumber}
            </p>
            {vehicle.model && (
              <p className="text-sm text-gray-600">{vehicle.model}</p>
            )}
          </div>
        </div>

        {/* Driver Assignment Section */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Driver Assignment
          </h3>

          {vehicle.assignedDriver ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <Image
                    src={vehicle.assignedDriver.avatar}
                    alt={vehicle.assignedDriver.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {vehicle.assignedDriver.name}
                  </p>
                  <p className="text-sm text-gray-500">Assigned Driver</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                  onClick={onChangeDriver}
                >
                  <User className="h-4 w-4" />
                  Change
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 border-[#F36565] text-[#F36565] hover:bg-[#F36565] hover:text-white"
                  onClick={onContactDriver}
                >
                  <Phone className="h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-500">No driver assigned</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#F36565] to-[#3B82F6]"
                onClick={onChangeDriver}
              >
                Assign Driver
              </Button>
            </div>
          )}

          {/* Lease Toggle - Only show for Available vehicles that are Owned */}
          {vehicle.statusBadge === 'Available' &&
            vehicle.ownership === 'Owned' && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Lease Vehicle
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehicle.isLeased
                        ? 'Vehicle is currently on lease'
                        : 'Make this vehicle available for lease'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={vehicle.isLeased || showLeaseToggle}
                      onChange={(e) => handleLeaseToggle(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gradient-to-r peer-checked:from-[#F36565] peer-checked:to-[#3B82F6] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#3B82F6]/50"></div>
                  </label>
                </div>
              </div>
            )}
        </div>

        {/* Vehicle Details */}
        <div className="space-y-3 border-t border-gray-100 pt-6">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Capacity</span>
            <span className="text-sm font-semibold text-gray-900">
              {vehicle.capacity || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Fuel Type</span>
            <span className="text-sm font-semibold text-gray-900">
              {vehicle.fuelType || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Mileage</span>
            <span className="text-sm font-semibold text-gray-900">
              {vehicle.mileage || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total Trips</span>
            <span className="text-sm font-semibold text-gray-900">
              {vehicle.totalTrips.toLocaleString()}
            </span>
          </div>
          {vehicle.location && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Location</span>
              <span className="text-sm font-semibold text-gray-900">
                {vehicle.location.replace('Current: ', '')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lease Modal */}
      <LeaseVehicleModal
        isOpen={isLeaseModalOpen}
        onClose={() => setIsLeaseModalOpen(false)}
        onSubmit={handleLeaseSubmit}
        vehicleName={vehicle.manufacturer || vehicle.name}
        vehicleImage={vehicle.image}
      />
    </div>
  );
}
