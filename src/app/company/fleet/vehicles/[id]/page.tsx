'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginSimulator from '@/components/LoginSimulator';
import { CompanyProtected } from '@/components/ProtectedRoute';
import { Vehicle } from '@/types/fleet';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
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
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vehicle data from API
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const user = api.getCurrentUser();
        if (!user) return;

        const response = await wheelboardApi.transport.getVehiclesByUser(
          user.id
        );
        const vehiclesData = (response.data as any[]) || [];

        // Find the specific vehicle
        const apiVehicle = vehiclesData.find((v: any) => v.vehicleId === id);

        if (apiVehicle) {
          // Map API response to Vehicle interface
          const mappedVehicle: Vehicle = {
            id: apiVehicle.vehicleId,
            name: apiVehicle.vehicleModel,
            model: apiVehicle.vehicleModel,
            registrationNumber: apiVehicle.vehicleNumber,
            year: apiVehicle.manufacturingYear,
            type: apiVehicle.vehicleType || 'Truck',
            image: apiVehicle.imageUrls?.[0] || '/truck-01.jpg',
            status:
              (apiVehicle.status as
                | 'Available'
                | 'Assigned'
                | 'In Transit'
                | 'Maintenance') || 'Available',
            statusBadge:
              (apiVehicle.status as 'Assigned' | 'Available' | 'In Transit') ||
              'Available',
            ownership:
              (apiVehicle.ownershipType as 'Owned' | 'Attached') || 'Owned',
            location: apiVehicle.description || 'N/A',
            description: apiVehicle.description,
            driver: 'Unassigned',
            imageUrls: apiVehicle.imageUrls || [],
            metrics: {
              avgRun: 0,
              tripEfficiency: 0,
              monthlyUsage: 0,
              costPerKM: 0,
            },
            recentTrips: [],
            totalTrips: 0,
          };
          setVehicle(mappedVehicle);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <CompanyProtected>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600"></div>
            <h1 className="mb-4 text-xl font-semibold text-gray-900">
              Loading Vehicle Details...
            </h1>
          </div>
        </div>
      </CompanyProtected>
    );
  }

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
    if (!vehicle) return;

    // Update vehicle with lease data (keeps current status)
    const updatedVehicle: Vehicle = {
      ...vehicle,
      isLeased: true,
      lease: leaseData,
    };
    setVehicle(updatedVehicle);

    // TODO: Update vehicle lease status via API call
    console.log('Vehicle leased:', updatedVehicle);
  };

  const handleLeaseRemove = () => {
    if (!vehicle) return;

    // Remove lease data from vehicle
    const updatedVehicle: Vehicle = {
      ...vehicle,
      isLeased: false,
      lease: undefined,
    };
    setVehicle(updatedVehicle);

    // TODO: Update vehicle lease status via API call
    console.log('Vehicle lease removed:', updatedVehicle);
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
                vehicle={vehicle as any}
                onChangeDriver={handleChangeDriver}
                onContactDriver={handleContactDriver}
                onLeaseSubmit={handleLeaseSubmit}
                onLeaseRemove={handleLeaseRemove}
              />
            </div>

            {/* Right Column - Metrics & Trips */}
            <div className="space-y-6">
              {/* Vehicle Metrics */}
              <VehicleMetricsCard vehicle={vehicle as any} />

              {/* Recent Trips */}
              <VehicleRecentTripsCard vehicle={vehicle as any} />
            </div>
          </div>
        </div>
      </div>
    </CompanyProtected>
  );
}
