'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginSimulator from '@/components/LoginSimulator';
import { CompanyProtected } from '@/components/ProtectedRoute';
import { companyFleetData, Vehicle } from '@/lib/mockApi';
import VehicleInfoCard from '@/components/company/VehicleInfoCard';
import VehicleMetricsCard from '@/components/company/VehicleMetricsCard';
import VehicleRecentTripsCard from '@/components/company/VehicleRecentTripsCard';
import { LeaseFormData } from '@/components/company/LeaseVehicleModal';

export default function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const vehicleData = companyFleetData.vehicles.find(
    (v) => v.id === id
  ) as Vehicle;
  const [vehicle, setVehicle] = useState<Vehicle>(vehicleData);

  if (!vehicle) {
    return (
      <CompanyProtected>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Vehicle Not Found
            </h1>
            <p className="mb-6 text-gray-600">
              The vehicle you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-[#F36565] to-[#3B82F6]"
            >
              Go Back
            </Button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  const handleChangeDriver = () => {
    console.log('Change driver for vehicle:', vehicle.id);
    // In a real app, this would open a driver selection modal
  };

  const handleContactDriver = () => {
    if (vehicle.assignedDriver) {
      console.log('Contact driver:', vehicle.assignedDriver.name);
      // In a real app, this would open contact options
    }
  };

  const handleLeaseSubmit = (leaseData: LeaseFormData) => {
    // Update vehicle with lease data (keeps current status)
    const updatedVehicle: Vehicle = {
      ...vehicle,
      isLeased: true,
      lease: leaseData,
    };
    setVehicle(updatedVehicle);

    // Update in the mock data (in a real app, this would be an API call)
    const vehicleIndex = companyFleetData.vehicles.findIndex(
      (v) => v.id === id
    );
    if (vehicleIndex !== -1) {
      Object.assign(companyFleetData.vehicles[vehicleIndex], updatedVehicle);
    }

    console.log('Vehicle leased:', updatedVehicle);
  };

  const handleLeaseRemove = () => {
    // Remove lease data from vehicle
    const updatedVehicle: Vehicle = {
      ...vehicle,
      isLeased: false,
      lease: undefined,
    };
    setVehicle(updatedVehicle);

    // Update in the mock data (in a real app, this would be an API call)
    const vehicleIndex = companyFleetData.vehicles.findIndex(
      (v) => v.id === id
    );
    if (vehicleIndex !== -1) {
      Object.assign(companyFleetData.vehicles[vehicleIndex], updatedVehicle);
    }

    console.log('Lease removed from vehicle:', updatedVehicle);
  };

  return (
    <CompanyProtected>
      <LoginSimulator />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fleet</span>
          </Button>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
            {/* Left Column - Vehicle Info Card */}
            <div>
              <VehicleInfoCard
                vehicle={vehicle}
                onChangeDriver={handleChangeDriver}
                onContactDriver={handleContactDriver}
                onLeaseSubmit={handleLeaseSubmit}
                onLeaseRemove={handleLeaseRemove}
              />
            </div>

            {/* Right Column - Metrics & Trips */}
            <div className="space-y-6">
              {/* Vehicle Metrics */}
              <VehicleMetricsCard vehicle={vehicle} />

              {/* Recent Trips */}
              <VehicleRecentTripsCard vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </CompanyProtected>
  );
}
