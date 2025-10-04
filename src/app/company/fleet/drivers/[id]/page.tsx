'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginSimulator from '@/components/LoginSimulator';
import { CompanyProtected } from '@/components/ProtectedRoute';
import { companyFleetData } from '@/lib/mockApi';
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

  const driver = companyFleetData.drivers.find((d) => d.id === id);

  if (!driver) {
    return (
      <CompanyProtected>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Driver Not Found
            </h1>
            <p className="mb-6 text-gray-600">
              The driver you&apos;re looking for doesn&apos;t exist.
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

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${driver.name}?`)) {
      router.push('/company/fleet/drivers');
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
