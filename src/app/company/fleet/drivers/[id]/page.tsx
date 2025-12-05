'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginSimulator from '@/components/LoginSimulator';
import { CompanyProtected } from '@/components/ProtectedRoute';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { Driver } from '@/types/fleet';
import DriverInfoCard from '@/components/company/DriverInfoCard';
import PerformanceOverviewCard from '@/components/company/PerformanceOverviewCard';
import RatingFeedbackCard from '@/components/company/RatingFeedbackCard';
import RecentReviewsCard from '@/components/company/RecentReviewsCard';

export default function DriverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch driver details from API
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setIsLoading(true);
        console.log('[DriverDetails] Fetching driver:', id);

        const response = await wheelboardApi.transport.getDriverDetails(id);
        console.log('[DriverDetails] API Response:', response);

        if (response.success && response.data) {
          const apiDriver: any = response.data;

          // Map API response to Driver interface
          const mappedDriver: Driver = {
            id: apiDriver.driverId,
            name: apiDriver.fullName || 'N/A',
            phone: apiDriver.contactNumber,
            phoneNumber: apiDriver.contactNumber,
            email: apiDriver.email || 'N/A',
            licenseNumber: apiDriver.vehicleNumber || 'N/A',
            experience: 'N/A',
            status: 'Available',
            vehicle: apiDriver.vehicleNumber || 'Unassigned',
            vehicleType: apiDriver.vehicleType || 'N/A',
            image: apiDriver.driverImagePath || '/profile-pic.png',
            rating: 0,
            totalTrips: 0,
            location: 'N/A',
            joinedDate: 'Recently joined',
            description: apiDriver.description || '',
            performance: {
              timelyDelivery: 0,
              tripEfficiency: 0,
              safety: 0,
            },
            reviews: [],
          };

          console.log('[DriverDetails] Mapped driver:', mappedDriver);
          setDriver(mappedDriver);
          setError(null);
        } else {
          setError('Driver not found');
        }
      } catch (err: any) {
        console.error('[DriverDetails] Error fetching driver:', err);
        setError('Failed to load driver details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <CompanyProtected>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]"></div>
            <p className="text-lg text-gray-600">Loading driver details...</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  if (error || !driver) {
    return (
      <CompanyProtected>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Driver Not Found
            </h1>
            <p className="mb-6 text-gray-600">
              {error || "The driver you're looking for doesn't exist."}
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

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would update the backend
  };

  const handleRemove = async () => {
    if (confirm(`Are you sure you want to remove ${driver.name}?`)) {
      try {
        const user = JSON.parse(
          localStorage.getItem('wheelboard_current_user') || '{}'
        );
        if (!user.id) {
          alert('Please login to delete driver');
          return;
        }

        console.log('[DriverDetails] Deleting driver:', driver.id);
        await wheelboardApi.transport.deleteDriver(driver.id, user.id);

        console.log('[DriverDetails] Driver deleted successfully');
        alert('Driver deleted successfully!');
        router.push('/company/fleet');
      } catch (error: any) {
        console.error('[DriverDetails] Error deleting driver:', error);
        alert('Failed to delete driver. Please try again.');
      }
    }
  };

  const handleSaveFeedback = async (rating: number, feedback: string) => {
    console.log('Saving feedback:', { driverId: driver.id, rating, feedback });
    // In a real app, this would send to backend API
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
            {/* Left Column - Driver Info Card */}
            <div>
              <DriverInfoCard
                driver={driver}
                onToggleFavorite={handleToggleFavorite}
                onRemove={handleRemove}
              />
            </div>

            {/* Right Column - Performance & Reviews */}
            <div className="space-y-6">
              {/* Performance Overview */}
              <PerformanceOverviewCard driver={driver} />

              {/* Rating & Feedback */}
              <RatingFeedbackCard
                driver={driver}
                onSaveFeedback={handleSaveFeedback}
              />

              {/* Recent Reviews */}
              <RecentReviewsCard driver={driver} />
            </div>
          </div>
        </div>
      </div>
    </CompanyProtected>
  );
}
