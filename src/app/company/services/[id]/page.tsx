'use client';

import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  Phone,
  MessageCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Img from 'next/image';
import { useState, useEffect } from 'react';
import ServiceAssignmentModal from '@/components/ServiceAssignmentModal';
import { wheelboardApi } from '@/lib/wheelboardApi';
import toast from 'react-hot-toast';

// Service Details Interface
interface ServiceDetails {
  contactNumber: string;
  whatsappNumber: string;
  description: string;
  pricingOption: string;
  amount: number;
  businessHoursFrom: string;
  businessHoursTo: string;
  daysOpen: string;
  serviceId: string;
  serviceTitle: string;
  city: string;
  fullAddress: string;
  isAvailable: boolean;
  businessName: string;
  businessType: string;
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id as string | undefined;

  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);

  // Fetch service details from API
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!serviceId) return;

      setLoading(true);
      setError(null);

      try {
        const response =
          await wheelboardApi.service.getServiceDetails(serviceId);

        if (response.success && response.data) {
          setService(response.data as ServiceDetails);
        } else {
          setError('Failed to load service details');
          toast.error('Failed to load service details');
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details');
        toast.error('Error loading service details');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const openAssignmentModal = () => setAssignmentModalOpen(true);
  const closeAssignmentModal = () => setAssignmentModalOpen(false);

  const handleAssignService = async () => {
    toast.success('Service assigned successfully!');
    closeAssignmentModal();
  };

  // Map page service shape to modal's expected Service shape
  const modalService = service
    ? {
        id: service.serviceId,
        name: service.serviceTitle,
        category: service.businessType.toLowerCase(),
        description: service.description,
        provider: service.businessName,
        rating: 4.5, // Default rating since not in API
        reviews: 0, // Default reviews since not in API
        price: service.amount,
        status: service.isAvailable ? 'active' : 'inactive',
        coverage: service.city,
        response: '< 24 hours',
        icon: null,
        businessHoursFrom: service.businessHoursFrom,
        businessHoursTo: service.businessHoursTo,
        daysOpen: service.daysOpen,
      }
    : null;

  // Loading state
  if (loading) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]" />
            <p className="text-gray-600">Loading service details...</p>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  // Error or not found state
  if (error || !service) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {error || 'Service not found'}
            </h1>
            <button
              onClick={() => router.back()}
              className="mt-4 rounded-xl bg-[#f36969] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#e85555]"
            >
              Go back
            </button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

  // Default rating for display (since not in API response)
  const displayRating = 4.5;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <CompanyProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </motion.button>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Service Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Service Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Service Image */}
                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                  <Img
                    src="/truck-01.jpg"
                    width={800}
                    height={600}
                    alt={service.serviceTitle}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                    {service.isAvailable && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Available
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-6 sm:p-8">
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {service.businessType}
                    </span>
                  </div>

                  <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                    {service.serviceTitle}
                  </h1>

                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      {renderStars(displayRating)}
                      <span className="text-lg font-bold text-gray-900">
                        {displayRating}
                      </span>
                      <span className="text-sm text-gray-500">
                        (verified service)
                      </span>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f36969]">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Service Provider</p>
                      <p className="font-semibold text-gray-900">
                        {service.businessName}
                      </p>
                    </div>
                  </div>

                  {/* About Service */}
                  <div className="mb-6">
                    <h2 className="mb-3 text-xl font-bold text-gray-900">
                      About this Service
                    </h2>
                    <p className="leading-relaxed text-gray-700">
                      {service.description}
                    </p>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h2 className="mb-3 text-xl font-bold text-gray-900">
                      Service Information
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            Business Hours
                          </p>
                          <p className="text-gray-700">
                            {service.businessHoursFrom} -{' '}
                            {service.businessHoursTo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            Days Open
                          </p>
                          <p className="text-gray-700">{service.daysOpen}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">Pricing</p>
                          <p className="text-gray-700">
                            {service.pricingOption === 'True'
                              ? 'Fixed Price'
                              : 'Variable'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            Availability
                          </p>
                          <p className="text-gray-700">
                            {service.isAvailable
                              ? 'Available Now'
                              : 'Currently Unavailable'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Service Highlights
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {displayRating}
                    </p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {service.isAvailable ? 'Yes' : 'No'}
                    </p>
                    <p className="text-xs text-gray-600">Available</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-[#f36969]" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {service.city}
                    </p>
                    <p className="text-xs text-gray-600">Location</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 space-y-4"
              >
                {/* Pricing Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Pricing & Availability
                  </h3>

                  {/* Price */}
                  <div className="mb-6 rounded-lg bg-gradient-to-br from-[#f36969] to-[#e85555] p-4 text-white">
                    <p className="mb-1 text-sm opacity-90">Service Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        ₹{service.amount.toLocaleString()}
                      </span>
                      <span className="text-sm opacity-90">
                        {service.pricingOption === 'True'
                          ? '/ Fixed'
                          : '/ Variable'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Location
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.fullAddress}, {service.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Working Hours
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.daysOpen} • {service.businessHoursFrom} -{' '}
                          {service.businessHoursTo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Contact
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.contactNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          WhatsApp
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.whatsappNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        window.open(`tel:${service.contactNumber}`, '_self')
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      <Phone className="h-5 w-5" />
                      Call Now
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        window.open(
                          `https://wa.me/${service.whatsappNumber.replace(/[^0-9]/g, '')}`,
                          '_blank'
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-white px-6 py-3.5 font-semibold text-green-600 transition-all hover:bg-green-50"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openAssignmentModal}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Assign Service
                    </motion.button>
                  </div>
                </div>

                {/* Render the assignment modal at page level */}
                <ServiceAssignmentModal
                  isOpen={assignmentModalOpen}
                  onClose={closeAssignmentModal}
                  service={modalService}
                  onAssign={handleAssignService}
                />

                {/* Info Card */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                  <div className="mb-2 flex items-center gap-2 text-blue-900">
                    <Shield className="h-5 w-5" />
                    <h4 className="font-semibold">Service Guarantee</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    All services are backed by our quality guarantee. If
                    you&apos;re not satisfied, we&apos;ll make it right.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}
