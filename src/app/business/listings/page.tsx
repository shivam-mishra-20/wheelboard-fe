'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import AddServiceModal from '../../../components/AddServiceModal';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

// Import the shared ServiceData type
import type { ServiceData } from '@/types/ServiceData';

function BusinessListingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'Published' | 'Draft'
  >('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null
  );
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);

        // Get current user via unified adapter
        const user = api.getCurrentUser();
        if (!user) {
          setError('Please log in to view services');
          setIsLoading(false);
          return;
        }
        setCurrentUser(user);

        // Fetch services for this business user
        const response = await wheelboardApi.service.getServiceList(user.id);
        console.log('📦 Business Services Response:', response);

        // Handle response - could be direct array or wrapped in data
        const servicesData: any[] = Array.isArray(response)
          ? response
          : (response as any)?.data || [];

        // Log first service to see what fields are available
        if (servicesData.length > 0) {
          console.log('🔍 Sample service from API:', servicesData[0]);
        }

        // Map API data to ServiceData format
        const mappedServices: ServiceData[] = servicesData.map(
          (apiService: any, index: number) => {
            const serviceName =
              apiService.serviceTitle ||
              apiService.serviceName ||
              `Service ${index + 1}`;

            return {
              id:
                apiService.serviceId ||
                apiService.jobId ||
                apiService.id ||
                `service-${index}`,
              title: serviceName,
              category: apiService.category || 'General',
              categoryColor: apiService.categoryColor || '#f36969',
              description:
                apiService.description ||
                'Professional service for your business',
              status: (apiService.isVisible ? 'Published' : 'Draft') as
                | 'Published'
                | 'Draft',
              pricing: {
                type: apiService.isFlatPrice
                  ? ('Fixed' as const)
                  : ('On Request' as const),
                amount: String(apiService.price || 0),
                currency: 'INR',
              },
              location: apiService.city || apiService.fullAddress || 'India',
              contactNumber: apiService.contactNumber || user.mobileNo || '',
              email: user.email || '',
              createdAt: apiService.dateEntered || new Date().toISOString(),
              updatedAt:
                apiService.dateModified ||
                apiService.dateEntered ||
                new Date().toISOString(),
              images: apiService.imageUrls || [],
            };
          }
        );

        setServices(mappedServices);
        console.log('✅ Mapped Services:', mappedServices);
      } catch (error) {
        console.error('❌ Error fetching services:', error);
        setError('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle edit from URL parameter
  useEffect(() => {
    if (editId) {
      const serviceToEdit = services.find((s) => s.id === editId);
      if (serviceToEdit) {
        setSelectedService(serviceToEdit);
        setShowAddModal(true);
      }
    }
  }, [editId, services]);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === '' ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || service.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    if (!currentUser) return;

    try {
      console.log('🗑️ Deleting service:', id, 'for user:', currentUser.id);

      // Call API to delete service
      const deleteResponse = await wheelboardApi.service.deleteService(
        id,
        currentUser.id
      );
      console.log('✅ Delete response:', deleteResponse);

      // Update local state
      setServices((prev) => prev.filter((s) => s.id !== id));
      console.log('✅ Service deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      if (error instanceof Error) {
        alert(`Failed to delete service: ${error.message}`);
      } else {
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const handleEdit = (service: ServiceData) => {
    setSelectedService(service);
    setShowAddModal(true);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setShowAddModal(true);
  };

  const handleSubmitService = async (serviceData: ServiceData) => {
    if (!currentUser) {
      alert('Please log in to manage services');
      return;
    }

    try {
      setIsLoading(true);

      // Ensure status is strictly "Published" or "Draft"
      const normalizedStatus: 'Published' | 'Draft' =
        serviceData.status === 'Published' ? 'Published' : 'Draft';

      if (selectedService) {
        // Validate required fields
        const contactNumber = serviceData.contactNumber || currentUser.mobileNo;
        if (!contactNumber) {
          alert('Contact number is required');
          return;
        }

        // Update existing service
        const updatePayload = {
          ServiceId: selectedService.id,
          UserId: currentUser.id,
          ServiceTitle: serviceData.title,
          ContactNumber: contactNumber,
          WhatsappNumber: contactNumber,
          Description: serviceData.description,
          IsFlatPrice: serviceData.pricing?.type === 'Fixed',
          Price: parseFloat(serviceData.pricing?.amount || '0'),
          City: serviceData.location || '',
          FullAddress: serviceData.location || '',
          IsVisible: normalizedStatus === 'Published',
          BusinessFrom: '09:00',
          BusinessTo: '18:00',
          DaysOpen: 'Mon-Fri',
          ModifiedBy: currentUser.id,
          NewImages: serviceData.images as File[] | undefined,
        };

        console.log('🔄 Updating service with full payload:', {
          ServiceId: updatePayload.ServiceId,
          UserId: updatePayload.UserId,
          ModifiedBy: updatePayload.ModifiedBy,
          ServiceTitle: updatePayload.ServiceTitle,
          '--- IDs validation ---': '',
          'ServiceId type': typeof updatePayload.ServiceId,
          'ServiceId value': updatePayload.ServiceId,
          'UserId type': typeof updatePayload.UserId,
          'UserId value': updatePayload.UserId,
          'ModifiedBy type': typeof updatePayload.ModifiedBy,
          'ModifiedBy value': updatePayload.ModifiedBy,
        });

        const updateResponse =
          await wheelboardApi.service.updateService(updatePayload);

        console.log('✅ Service update response:', updateResponse);

        // Update local state
        setServices((prev) =>
          prev.map((s) =>
            s.id === selectedService.id
              ? {
                  ...serviceData,
                  status: normalizedStatus,
                  id: selectedService.id,
                  createdAt: s.createdAt,
                  updatedAt: new Date().toISOString(),
                }
              : s
          )
        );
        console.log('✅ Service updated successfully');
      } else {
        // Validate required fields
        const contactNumber = serviceData.contactNumber || currentUser.mobileNo;
        if (!contactNumber) {
          alert('Contact number is required');
          return;
        }

        // Add new service
        const response = await wheelboardApi.service.addService({
          UserId: currentUser.id,
          ServiceTitle: serviceData.title,
          ContactNumber: contactNumber,
          WhatsappNumber: contactNumber,
          Description: serviceData.description,
          IsFlatPrice: serviceData.pricing?.type === 'Fixed',
          Price: parseFloat(serviceData.pricing?.amount || '0'),
          City: serviceData.location || '',
          FullAddress: serviceData.location || '',
          IsVisible: normalizedStatus === 'Published',
          BusinessFrom: '09:00',
          BusinessTo: '18:00',
          DaysOpen: 'Mon-Fri',
          CreatedBy: currentUser.id,
          Images: serviceData.images as File[] | undefined,
        });

        // Add to local state with generated ID
        console.log('✅ Add service response:', response);
        const responseData = (response as any).data || response;
        const newService = {
          ...serviceData,
          id:
            responseData.serviceId ||
            responseData.jobId ||
            `service-${Date.now()}`,
          status: normalizedStatus,
        };
        setServices((prev) => [...prev, newService]);
        console.log('✅ Service added successfully');
      }

      setShowAddModal(false);
      setSelectedService(null);

      // Clear edit parameter from URL if present
      if (editId) {
        router.push('/business/listings');
      }
    } catch (error: any) {
      console.error('❌ Error saving service:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Unknown error';
      alert(`Failed to save service: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (serviceId: string) => {
    router.push(`/business/listings/${serviceId}`);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedService(null);
    // Clear edit parameter from URL if present
    if (editId) {
      router.push('/business/listings');
    }
  };

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pt-16 font-poppins">
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              My Created Services
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track your Services here
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">All</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as 'all' | 'Published' | 'Draft'
                  )
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#f36969] border-t-transparent"></div>
              <p className="mt-4 text-sm text-gray-500">Loading services...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredServices.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <p className="text-sm text-gray-500">
                {searchQuery || filterStatus !== 'all'
                  ? 'No services found matching your filters'
                  : 'No services yet. Create your first service!'}
              </p>
            </div>
          )}

          {/* Services Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isLoading &&
              filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleCardClick(service.id)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="p-5">
                    {/* Title and Status */}
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="flex-1 text-lg font-bold text-gray-900">
                        {service.title}
                      </h3>
                      {service.status === 'Published' ? (
                        <span className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                          <Clock className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Category Badge */}
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

                    {/* Description */}
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {service.description}
                    </p>

                    {/* Updated Info */}
                    <div className="mb-4 flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Updated{' '}
                        {new Date(service.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(service);
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(service.id);
                        }}
                        className="flex items-center justify-center rounded-lg border border-red-200 bg-white p-2 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Add Service Button (Fixed Bottom Right) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddService}
            className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#f36969] text-white shadow-lg hover:bg-[#e85555] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-3"
          >
            <Plus className="h-6 w-6" />
            <span className="hidden font-semibold sm:inline">Add Service</span>
          </motion.button>
        </main>

        <Footer />
      </div>

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitService}
        editingService={selectedService ?? undefined}
      />
    </BusinessProtected>
  );
}

export default function BusinessListingsPage() {
  const LoadingFallback = () => (
    <div className="p-6 text-sm text-gray-500">Loading…</div>
  );
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusinessListingsInner />
    </Suspense>
  );
}
