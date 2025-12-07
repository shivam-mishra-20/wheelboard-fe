'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Edit2,
  Trash2,
  Share2,
  Building2,
  User,
  Calendar,
  IndianRupee,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import Header from '../../../../components/Header';
import LoginSimulator from '../../../../components/LoginSimulator';
import Footer from '../../../../components/Footer';
import { BusinessProtected } from '../../../../components/ProtectedRoute';
import ServiceAssignmentsModal from '@/components/business/ServiceAssignmentsModal';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

// Interface matching exact API response
interface ServiceDetails {
  serviceId: string;
  serviceTitle: string;
  description: string;
  contactNumber: string;
  whatsappNumber: string;
  pricingOption: string; // "True" or "False" as string
  amount: number;
  city: string;
  fullAddress: string;
  isAvailable: boolean;
  businessHoursFrom: string;
  businessHoursTo: string;
  daysOpen: string;
  businessName: string;
  businessType: string;
  serviceCategory: string;
  images?: string[];
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id as string;

  const [service, setService] = useState<ServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [serviceAssignments, setServiceAssignments] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch service details from API
  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const user = api.getCurrentUser();
        if (!user) {
          setError('Please log in to view service details');
          return;
        }
        setCurrentUser(user);

        // Fetch service details using the details API
        const response =
          await wheelboardApi.service.getServiceDetails(serviceId);
        console.log('📦 Service Details Response:', response);

        const apiResponse = response as any;
        if (apiResponse.success && apiResponse.data) {
          setService(apiResponse.data);
        } else if (apiResponse.serviceId) {
          // Direct data response
          setService(apiResponse);
        } else {
          setError('Service not found');
        }

        // Fetch service assignments for this service
        try {
          const assignmentsResponse =
            await wheelboardApi.service.getServiceAssignments(serviceId);
          const assignmentsData: any[] = Array.isArray(assignmentsResponse)
            ? assignmentsResponse
            : (assignmentsResponse as any)?.data || [];
          setServiceAssignments(assignmentsData);
        } catch (assignErr) {
          console.error('Error fetching service assignments:', assignErr);
          setServiceAssignments([]);
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleViewAssignments = () => {
    setIsAssignmentsModalOpen(true);
  };

  const handleViewBookingDetails = (bookingId: string) => {
    setIsAssignmentsModalOpen(false);
    router.push(`/business/bookings/${bookingId}`);
  };

  const handleEdit = () => {
    router.push(`/business/listings?edit=${serviceId}`);
  };

  const handleDelete = async () => {
    if (
      !currentUser ||
      !confirm('Are you sure you want to delete this service?')
    )
      return;

    try {
      setIsDeleting(true);
      console.log(
        '🗑️ Deleting service:',
        serviceId,
        'for user:',
        currentUser.id
      );
      await wheelboardApi.service.deleteService(serviceId, currentUser.id);
      console.log('✅ Service deleted successfully');
      router.push('/business/listings');
    } catch (error: any) {
      console.error('❌ Error deleting service:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Unknown error';
      alert(`Failed to delete service: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch {
      alert('Failed to copy link');
    }
  };

  const handleWhatsApp = () => {
    if (service?.whatsappNumber) {
      window.open(`https://wa.me/${service.whatsappNumber}`, '_blank');
    }
  };

  const handleCall = () => {
    if (service?.contactNumber) {
      window.location.href = `tel:${service.contactNumber}`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <BusinessProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-lg text-gray-600">Loading service details...</p>
          </div>
        </div>
      </BusinessProtected>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <BusinessProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="mb-2 text-xl font-semibold text-gray-900">
              {error || 'Service not found'}
            </p>
            <p className="mb-6 text-gray-500">
              The service you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              onClick={() => router.push('/business/listings')}
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Back to Listings
            </button>
          </div>
        </div>
      </BusinessProtected>
    );
  }

  const isFlatPrice =
    service.pricingOption === 'True' || service.pricingOption === 'true';

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Listings</span>
          </button>

          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Header Section */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-pink-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  {/* Status Badge */}
                  <div className="mb-3">
                    {service.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                        <Clock className="h-4 w-4" />
                        Draft
                      </span>
                    )}
                    {service.serviceCategory && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                        {service.serviceCategory}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {service.serviceTitle}
                  </h1>

                  {/* Business Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>{service.businessName}</span>
                    </div>
                    {service.businessType && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        <span>{service.businessType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 rounded-xl bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {isFlatPrice ? 'Fixed Price' : 'Starting From'}
                  </p>
                  <div className="flex items-center text-2xl font-bold text-primary-600">
                    <IndianRupee className="h-6 w-6" />
                    <span>{service.amount?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="leading-relaxed text-gray-600">
                  {service.description || 'No description provided.'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {/* Location */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {service.city || 'Not specified'}
                  </p>
                  {service.fullAddress &&
                    service.fullAddress !== service.city && (
                      <p className="mt-1 text-sm text-gray-500">
                        {service.fullAddress}
                      </p>
                    )}
                </div>

                {/* Business Hours */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Business Hours</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {service.businessHoursFrom && service.businessHoursTo
                      ? `${service.businessHoursFrom.slice(0, 5)} - ${service.businessHoursTo.slice(0, 5)}`
                      : 'Not specified'}
                  </p>
                  {service.daysOpen && (
                    <p className="mt-1 text-sm text-gray-500">
                      {service.daysOpen}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">Contact Number</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {service.contactNumber || 'Not provided'}
                  </p>
                </div>

                {/* WhatsApp */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {service.whatsappNumber || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="mb-6 flex flex-wrap gap-3">
                {service.contactNumber && (
                  <button
                    onClick={handleCall}
                    className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 font-medium text-green-700 transition-colors hover:bg-green-100"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </button>
                )}
                {service.whatsappNumber && (
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 font-medium text-green-700 transition-colors hover:bg-green-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              {/* Service ID */}
              <div className="mb-6 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Service ID
                </p>
                <p className="mt-1 font-mono text-sm text-gray-700">
                  {service.serviceId}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Service
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewAssignments}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
                >
                  <Calendar className="h-4 w-4" />
                  View Assignments
                  {serviceAssignments.length > 0 && (
                    <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                      {serviceAssignments.length}
                    </span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </motion.button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Service Assignments Modal */}
      <ServiceAssignmentsModal
        isOpen={isAssignmentsModalOpen}
        onClose={() => setIsAssignmentsModalOpen(false)}
        serviceName={service.serviceTitle}
        assignments={serviceAssignments}
        onViewDetails={handleViewBookingDetails}
      />
    </BusinessProtected>
  );
}
