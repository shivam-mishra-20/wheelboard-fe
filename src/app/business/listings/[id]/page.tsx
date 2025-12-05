'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Img from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  CheckCircle,
  Edit2,
  Trash2,
  Share2,
  Heart,
  Users,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import Header from '../../../../components/Header';
import LoginSimulator from '../../../../components/LoginSimulator';
import Footer from '../../../../components/Footer';
import { BusinessProtected } from '../../../../components/ProtectedRoute';
import ServiceAssignmentsModal from '@/components/business/ServiceAssignmentsModal';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
import type { ServiceData } from '@/types/ServiceData';

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id as string;

  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Mock data for service assignments
  const serviceAssignments: any[] = [];

  // Fetch service details from API
  React.useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const user = api.getCurrentUser();
        if (!user) {
          setError('Please log in to view service details');
          return;
        }
        setCurrentUser(user);

        // Fetch all services and find the matching one
        const response = await wheelboardApi.service.getServiceList(user.id);
        const servicesData: any[] = Array.isArray(response)
          ? response
          : (response as any)?.data || [];

        const apiService = servicesData.find(
          (s: any) => (s.serviceId || s.jobId || s.id) === serviceId
        );

        if (apiService) {
          const mappedService: ServiceData = {
            id: apiService.serviceId || apiService.jobId || apiService.id,
            title:
              apiService.serviceTitle || apiService.serviceName || 'Service',
            category: apiService.category || 'General',
            categoryColor: apiService.categoryColor || '#f36969',
            description: apiService.description || '',
            status: apiService.isVisible ? 'Published' : 'Draft',
            pricing: {
              type: apiService.isFlatPrice ? 'Fixed' : 'On Request',
              amount: String(apiService.price || 0),
              currency: 'INR',
            },
            location: apiService.city || apiService.fullAddress || '',
            contactNumber: apiService.contactNumber || user.mobileNo || '',
            email: user.email || '',
            createdAt: apiService.dateEntered || new Date().toISOString(),
            updatedAt:
              apiService.dateModified ||
              apiService.dateEntered ||
              new Date().toISOString(),
            images: apiService.imageUrls || [],
          };
          setService(mappedService);
        } else {
          setError('Service not found');
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
        <p className="ml-3 text-gray-600">Loading service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {error || 'Service not found'}
          </p>
          <button
            onClick={() => router.push('/business/listings')}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

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
      console.log(
        '🗑️ Deleting service:',
        serviceId,
        'for user:',
        currentUser.id
      );
      const deleteResponse = await wheelboardApi.service.deleteService(
        serviceId,
        currentUser.id
      );
      console.log('✅ Delete response:', deleteResponse);
      console.log('✅ Service deleted successfully');
      router.push('/business/listings');
    } catch (error: any) {
      console.error('❌ Error deleting service:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Unknown error';
      alert(`Failed to delete service: ${errorMessage}`);
    }
  };

  const galleryImages =
    service.images && service.images.length > 0
      ? service.images
      : ['/tires.png'];

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-lg">
                <div className="relative aspect-video w-full">
                  <Img
                    width={800}
                    height={600}
                    src={galleryImages[activeImageIndex]}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                  {service.status === 'Published' ? (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
                      <CheckCircle className="h-4 w-4" />
                      Published
                    </div>
                  ) : (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-gray-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
                      <Clock className="h-4 w-4" />
                      Draft
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 p-4">
                    {galleryImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                          activeImageIndex === index
                            ? 'border-[#f36969] ring-2 ring-[#f36969]/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Img
                          src={img}
                          width={80}
                          height={80}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Title and Category */}
              <div className="mb-4 rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-3">
                  <span
                    className="inline-block rounded-lg px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: service.categoryColor,
                      color: '#374151',
                    }}
                  >
                    {service.category}
                  </span>
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {service.title}
                </h1>

                {/* Rating and Stats */}
                <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4">
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">
                        {service.rating}
                      </span>
                      {service.reviewCount && (
                        <span className="text-sm text-gray-600">
                          ({service.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {service.completedJobs && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {service.completedJobs} jobs completed
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                {service.pricing && (
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#f36969]">
                        {service.pricing.currency}
                        {service.pricing.amount || 'On Request'}
                      </span>
                      {service.pricing.details && (
                        <span className="text-gray-600">
                          {service.pricing.details}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* About this Service */}
              <div className="mb-4 rounded-3xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  About this Service
                </h2>
                <p className="leading-relaxed text-gray-700">
                  {service.detailedDescription || service.description}
                </p>

                {service.tags && service.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery Section (if multiple images) */}
              {galleryImages.length > 0 && (
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {galleryImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className="aspect-square overflow-hidden rounded-xl"
                      >
                        <Img
                          src={img}
                          width={200}
                          height={200}
                          alt={`Gallery ${index + 1}`}
                          className="h-full w-full object-cover transition-transform hover:scale-110"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact and Info */}
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Service
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>

                  <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                    <Heart className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              {service.contactInfo && (
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {service.contactInfo.phone && (
                      <a
                        href={`tel:${service.contactInfo.phone}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-900">
                            {service.contactInfo.phone}
                          </p>
                        </div>
                      </a>
                    )}

                    {service.contactInfo.email && (
                      <a
                        href={`mailto:${service.contactInfo.email}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">
                            {service.contactInfo.email}
                          </p>
                        </div>
                      </a>
                    )}

                    {service.location && (
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {service.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Availability */}
              {service.availability && (
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Availability
                  </h3>

                  {service.availability.hours && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Working Hours</p>
                        <p className="font-semibold text-gray-900">
                          {service.availability.hours}
                        </p>
                      </div>
                    </div>
                  )}

                  {service.availability.days &&
                    service.availability.days.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs text-gray-600">
                          Available Days
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {service.availability.days.map((day) => (
                            <span
                              key={day}
                              className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                            >
                              {day.slice(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Stats Card */}
              <div className="rounded-3xl bg-gradient-to-br from-[#f36969] to-[#e85555] p-6 text-white shadow-lg">
                <h3 className="mb-4 text-lg font-bold">Service Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      <span className="text-sm">Jobs Completed</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {service.completedJobs || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span className="text-sm">Total Reviews</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {service.reviewCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm">Success Rate</span>
                    </div>
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                </div>
              </div>

              {/* View Assigns Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewAssignments}
                className="relative w-full rounded-2xl bg-[#f36969] px-6 py-4 font-semibold text-white shadow-lg hover:bg-[#e85555]"
              >
                View Assigns
                {serviceAssignments.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#f36969] ring-4 ring-pink-100">
                    {serviceAssignments.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Service Assignments Modal */}
      <ServiceAssignmentsModal
        isOpen={isAssignmentsModalOpen}
        onClose={() => setIsAssignmentsModalOpen(false)}
        serviceName={service.title}
        assignments={serviceAssignments}
        onViewDetails={handleViewBookingDetails}
      />
    </BusinessProtected>
  );
}
