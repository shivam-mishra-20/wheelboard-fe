'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  Package,
  Truck,
  Shield,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Settings,
  TrendingUp,
  Eye,
  Calendar,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import ServiceEnquiryModal from '@/components/ServiceEnquiryModal';
import ServiceAssignmentModal from '@/components/ServiceAssignmentModal';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
import toast from 'react-hot-toast';

// UI Service interface (separate from API)
interface Service {
  id: string;
  name: string;
  category: 'transport' | 'storage' | 'insurance' | 'maintenance';
  description: string;
  provider: string;
  rating: number;
  reviews: number;
  price: number;
  status: 'active' | 'inactive';
  coverage: string;
  response: string;
  // Icon component type
  icon: React.ComponentType<Record<string, unknown>>;
  // Optional API fields
  serviceId?: string;
  serviceName?: string;
  availability?: string;
  providerId?: string;
  providerName?: string;
  imageUrls?: string[];
}

const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Express Delivery Service',
    category: 'transport',
    description: 'Fast and reliable delivery for time-sensitive shipments',
    provider: 'QuickTransit Logistics',
    rating: 4.8,
    reviews: 245,
    price: 5000,
    status: 'active',
    coverage: 'Pan India',
    response: '< 2 hours',
    icon: Truck,
  },
  {
    id: 's2',
    name: 'Warehouse Storage',
    category: 'storage',
    description: 'Secure storage facilities with 24/7 monitoring',
    provider: 'SafeStore Solutions',
    rating: 4.7,
    reviews: 189,
    price: 15000,
    status: 'active',
    coverage: 'Metro Cities',
    response: '24 hours',
    icon: Package,
  },
  {
    id: 's3',
    name: 'Vehicle Insurance Premium',
    category: 'insurance',
    description: 'Comprehensive coverage for your fleet',
    provider: 'Shield Insurance Co.',
    rating: 4.9,
    reviews: 312,
    price: 25000,
    status: 'active',
    coverage: 'Nationwide',
    response: 'Instant',
    icon: Shield,
  },
  {
    id: 's4',
    name: 'Fleet Maintenance',
    category: 'maintenance',
    description: 'Regular servicing and emergency repairs',
    provider: 'AutoCare Services',
    rating: 4.6,
    reviews: 156,
    price: 8000,
    status: 'active',
    coverage: 'Major Cities',
    response: '< 4 hours',
    icon: Settings,
  },
  {
    id: 's5',
    name: 'Overnight Cargo',
    category: 'transport',
    description: 'Night-time deliveries for large shipments',
    provider: 'NightHaul Express',
    rating: 4.5,
    reviews: 98,
    price: 12000,
    status: 'active',
    coverage: 'Regional',
    response: '< 3 hours',
    icon: Truck,
  },
  {
    id: 's6',
    name: 'Cold Storage',
    category: 'storage',
    description: 'Temperature-controlled storage for perishables',
    provider: 'FreshKeep Logistics',
    rating: 4.8,
    reviews: 134,
    price: 20000,
    status: 'inactive',
    coverage: 'Select Cities',
    response: '12 hours',
    icon: Package,
  },
];

const categoryConfig = {
  transport: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    label: 'Transport',
  },
  storage: {
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    label: 'Storage',
  },
  insurance: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    gradient: 'from-green-500 to-green-600',
    label: 'Insurance',
  },
  maintenance: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    gradient: 'from-orange-500 to-orange-600',
    label: 'Maintenance',
  },
};

// Assignment interface for tracking
interface Assignment {
  assignmentId: string;
  serviceId: string;
  assignedToUserId: string;
  vehicleNumber: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  status: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [assignedServices, setAssignedServices] = useState<Assignment[]>([]);
  const [serviceEnquiryModalOpen, setServiceEnquiryModalOpen] = useState(false);
  const [serviceAssignmentModalOpen, setServiceAssignmentModalOpen] =
    useState(false);

  // API State
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch services and assigned services from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get current user
        const user = api.getCurrentUser() || {
          id: '48e36413-ba01-4850-8aae-8c8d05206dc7',
        };
        setCurrentUser(user);
        console.log('👤 Current User:', user);

        // Fetch all available services
        const servicesResponse =
          await wheelboardApi.service.getAllServiceList();
        console.log('🔍 Services API Response:', servicesResponse);

        // Extract data from response
        const servicesData: any[] = Array.isArray(servicesResponse)
          ? servicesResponse
          : Array.isArray(servicesResponse?.data)
            ? servicesResponse.data
            : [];
        console.log('📦 Parsed Services Data:', servicesData);

        // Fetch assigned services for current user
        try {
          console.log('🔄 Fetching assigned services for user:', user.id);
          const assignedResponse =
            await wheelboardApi.service.getAssignedServices(user.id);
          console.log('✅ Assigned Services Raw Response:', assignedResponse);

          // API returns flat array directly or nested in data property
          const assignedData: Assignment[] = Array.isArray(assignedResponse)
            ? assignedResponse
            : Array.isArray(assignedResponse?.data)
              ? assignedResponse.data
              : [];

          console.log('📌 Assigned Services Parsed:', assignedData);
          console.log('📊 Number of assigned services:', assignedData.length);
          setAssignedServices(assignedData);
        } catch (err) {
          console.error('❌ Error fetching assigned services:', err);
          setAssignedServices([]);
        }

        // Map API services to UI format
        // API returns: {serviceId, serviceTitle, city, fullAddress, isAvailable, businessName, businessType}
        const mappedServices: Service[] = servicesData.map(
          (apiService: any) => {
            const serviceName = apiService.serviceTitle || 'Untitled Service';
            const lowerName = serviceName.toLowerCase();

            // Icon mapping based on service name and business type
            const getIcon = () => {
              const lowerType = (apiService.businessType || '').toLowerCase();

              if (
                lowerName.includes('tyre') ||
                lowerName.includes('tire') ||
                lowerType.includes('dealer')
              )
                return Settings;
              if (
                lowerName.includes('vehicle') ||
                lowerName.includes('maintenance') ||
                lowerName.includes('repair') ||
                lowerType.includes('manufacturer')
              )
                return Settings;
              if (
                lowerName.includes('transport') ||
                lowerName.includes('delivery')
              )
                return Truck;
              if (
                lowerName.includes('storage') ||
                lowerName.includes('warehouse')
              )
                return Package;
              if (
                lowerName.includes('insurance') ||
                lowerName.includes('cover')
              )
                return Shield;
              return Settings;
            };

            // Category mapping based on service name
            const getCategory = ():
              | 'transport'
              | 'storage'
              | 'insurance'
              | 'maintenance' => {
              if (
                lowerName.includes('storage') ||
                lowerName.includes('warehouse')
              )
                return 'storage';
              if (
                lowerName.includes('insurance') ||
                lowerName.includes('cover')
              )
                return 'insurance';
              if (
                lowerName.includes('transport') ||
                lowerName.includes('delivery')
              )
                return 'transport';
              return 'maintenance';
            };

            // Description based on service info
            const getDescription = () => {
              if (apiService.businessName && apiService.businessType) {
                return `${apiService.businessType} service provided by ${apiService.businessName}`;
              }
              if (lowerName.includes('tyre'))
                return 'Professional tyre services including replacement, repair, and maintenance';
              return 'Professional service for your business needs';
            };

            return {
              // API fields
              serviceId: apiService.serviceId,
              serviceName: serviceName,

              // UI fields (required for display)
              id: apiService.serviceId,
              name: serviceName,
              category: getCategory(),
              description: getDescription(),
              provider: apiService.businessName || 'WheelBoard Services',
              rating: 4.5 + Math.random() * 0.4,
              reviews: Math.floor(50 + Math.random() * 150),
              price: Math.floor(3000 + Math.random() * 12000),
              status: apiService.isAvailable
                ? ('active' as const)
                : ('inactive' as const),
              coverage: apiService.city || 'Pan India',
              response: '< 24 hours',
              icon: getIcon(),
            };
          }
        );

        console.log('🎯 Final Mapped Services:', mappedServices);

        // Always use API data (even if empty)
        setServices(mappedServices);

        if (mappedServices.length === 0) {
          setError(
            'No services available. Please add services from admin panel.'
          );
        }
      } catch (error) {
        console.error('❌ Error fetching services:', error);
        setError(
          'Failed to load services from API. Please check your connection.'
        );
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const [selectedServiceForAssignment, setSelectedServiceForAssignment] =
    useState<Service | null>(null);

  const handleAssign = async (serviceId: string, assignmentData?: any) => {
    try {
      if (!currentUser) {
        setError('Please log in to assign services');
        toast.error('Please log in to assign services');
        return;
      }

      // Call API to assign service
      const response = await wheelboardApi.service.assignService({
        serviceId: serviceId,
        assignedToUserId: currentUser.id,
        scheduledDate:
          assignmentData?.scheduledDate ||
          `${new Date().toISOString().split('T')[0]}T00:00:00.000Z`,
        scheduledTime: assignmentData?.scheduledTime || '09:00',
        description: assignmentData?.description || 'Service assigned',
        vehicleNumber: assignmentData?.vehicleNumber || '',
        status: assignmentData?.status || 'pending',
      });

      console.log('Assignment response:', response);

      // Refresh assigned services from API to get the latest data with proper assignmentId
      try {
        const assignedResponse =
          await wheelboardApi.service.getAssignedServices(currentUser.id);
        const assignedData: Assignment[] = Array.isArray(assignedResponse)
          ? assignedResponse
          : [];
        setAssignedServices(assignedData);
        toast.success('Service assigned successfully!');
      } catch (err) {
        console.error('Error refreshing assigned services:', err);
        // Fallback: add to local state if refresh fails
        const newAssignment: Assignment = {
          assignmentId: response.serviceId || serviceId,
          serviceId: serviceId,
          assignedToUserId: currentUser.id,
          vehicleNumber: assignmentData?.vehicleNumber || '',
          scheduledDate:
            assignmentData?.scheduledDate ||
            new Date().toISOString().split('T')[0],
          scheduledTime: assignmentData?.scheduledTime || '09:00',
          description: assignmentData?.description || 'Service assigned',
          status: assignmentData?.status || 'pending',
        };

        setAssignedServices((prev) => {
          if (prev.some((a) => a.serviceId === serviceId)) return prev;
          return [...prev, newAssignment];
        });
        toast.success('Service assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      toast.error('Failed to assign service');
      setError('Failed to assign service');
    }
  };

  const handleUnassign = async (assignmentId: string) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to remove this service assignment?'
    );
    if (!confirmed) return;

    try {
      // Call API to delete service assignment
      await wheelboardApi.service.deleteServiceAssignment(assignmentId);
      toast.success('Service unassigned successfully');

      // Update local state
      setAssignedServices((prev) =>
        prev.filter((a) => a.assignmentId !== assignmentId)
      );
    } catch (error) {
      console.error('Error unassigning service:', error);
      toast.error('Failed to unassign service');
      setError('Failed to unassign service');
    }
  };

  const handleOpenAssignmentModal = (service: Service) => {
    setSelectedServiceForAssignment(service);
    setServiceAssignmentModalOpen(true);
  };

  const handleCloseAssignmentModal = () => {
    setServiceAssignmentModalOpen(false);
    setSelectedServiceForAssignment(null);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase());

    // Handle 'assigned' filter - show only services that are assigned
    if (filterCategory === 'assigned') {
      const isAssigned = assignedServices.some(
        (assignment) => assignment.serviceId === service.id
      );
      return matchesSearch && isAssigned;
    }

    const matchesCategory =
      filterCategory === 'all' || service.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: mockServices.length,
    active: mockServices.filter((s) => s.status === 'active').length,
    avgRating:
      mockServices.reduce((sum, s) => sum + s.rating, 0) / mockServices.length,
    providers: new Set(mockServices.map((s) => s.provider)).size,
    assigned: assignedServices.length,
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
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
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </motion.button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-[#f36969] to-[#e85555] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                  Services Marketplace
                </h1>
                <p className="mt-2 text-gray-600">
                  Browse and manage logistics services
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setServiceEnquiryModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Request Service
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Services
                </span>
                <Package className="h-5 w-5 text-[#f36969]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="mt-1 text-xs text-gray-500">Available services</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  Active
                </span>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-900">
                {stats.active}
              </p>
              <p className="mt-1 text-xs text-green-600">Currently active</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Avg Rating
                </span>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-900">
                {stats.avgRating.toFixed(1)}
              </p>
              <p className="mt-1 text-xs text-yellow-600">Overall quality</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-[#f36969]/30 bg-[#f36969]/5 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#f36969]">
                  Providers
                </span>
                <TrendingUp className="h-5 w-5 text-[#f36969]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.providers}
              </p>
              <p className="mt-1 text-xs text-[#f36969]">Service providers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-700">
                  Assigned
                </span>
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-indigo-900">
                {stats.assigned}
              </p>
              <p className="mt-1 text-xs text-indigo-600">Assigned services</p>
            </motion.div>
          </div>

          {/* Assigned Services List */}
          {assignedServices.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      My Assigned Services
                    </h3>
                    <p className="text-sm text-gray-600">
                      {assignedServices.length} service
                      {assignedServices.length !== 1 ? 's' : ''} currently
                      assigned
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {assignedServices.map((assignment) => {
                  const svc = services.find(
                    (s) => s.id === assignment.serviceId
                  );
                  if (!svc)
                    return (
                      <div
                        key={assignment.assignmentId}
                        className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <p className="text-sm text-gray-500">
                          Service details not available
                        </p>
                        <button
                          onClick={() =>
                            handleUnassign(assignment.assignmentId)
                          }
                          className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  return (
                    <motion.div
                      key={assignment.assignmentId}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {svc.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {svc.provider}
                          </p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {assignment.status}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                          <span>
                            {new Date(
                              assignment.scheduledDate
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <Clock className="ml-2 h-3.5 w-3.5 text-indigo-600" />
                          <span>{assignment.scheduledTime}</span>
                        </div>
                        {assignment.vehicleNumber && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Truck className="h-3.5 w-3.5 text-indigo-600" />
                            <span className="font-mono">
                              {assignment.vehicleNumber}
                            </span>
                          </div>
                        )}
                        {assignment.description && (
                          <p className="line-clamp-2 text-xs text-gray-500">
                            {assignment.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleUnassign(assignment.assignmentId)}
                        className="mt-auto rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50"
                      >
                        Remove Assignment
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <CheckCircle2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No Assigned Services
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                You haven&apos;t assigned any services yet. Browse available
                services below and assign them to your fleet.
              </p>
            </motion.div>
          )}

          {/* Category Filter Pills */}
          <div className="mb-6 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory('all')}
              className={`rounded-xl px-5 py-2.5 font-semibold transition-all ${
                filterCategory === 'all'
                  ? 'bg-gradient-to-r from-[#f36969] to-[#e85555] text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-[#f36969] hover:bg-[#f36969]/5'
              }`}
            >
              All Services
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory('assigned')}
              className={`rounded-xl px-5 py-2.5 font-semibold transition-all ${
                filterCategory === 'assigned'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                  : 'border border-indigo-200 bg-indigo-50 text-indigo-600 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Assigned ({assignedServices.length})</span>
              </div>
            </motion.button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterCategory(key)}
                className={`rounded-xl px-5 py-2.5 font-semibold transition-all ${
                  filterCategory === key
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                    : `border ${config.border} ${config.bg} ${config.color} hover:shadow-sm`
                }`}
              >
                {config.label}
              </motion.button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services by name, description, or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service, index) => {
              const categoryStyle = categoryConfig[service.category];
              const ServiceIcon = service.icon;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Header with Gradient */}
                  <div
                    className={`bg-gradient-to-r ${categoryStyle.gradient} p-6`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div
                        className={`rounded-xl ${categoryStyle.bg} p-3 shadow-lg`}
                      >
                        <ServiceIcon
                          className={`h-8 w-8 ${categoryStyle.color}`}
                        />
                      </div>
                      <span
                        className={`rounded-lg border ${categoryStyle.border} ${categoryStyle.bg} px-3 py-1 text-xs font-bold ${categoryStyle.color}`}
                      >
                        {categoryStyle.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {service.name}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="mb-4 text-sm text-gray-600">
                      {service.description}
                    </p>

                    {/* Provider Info */}
                    <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p className="mb-1 text-xs font-medium text-gray-500">
                        Service Provider
                      </p>
                      <p className="font-semibold text-gray-900">
                        {service.provider}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <div className="mb-1 flex items-center gap-1">
                          {renderStars(service.rating)}
                        </div>
                        <p className="text-xs text-gray-600">
                          {service.reviews} reviews
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#f36969]">
                          ₹{(service.price / 1000).toFixed(1)}k
                        </p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          {service.coverage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          Response: {service.response}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {service.status === 'active' ? (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Active Service
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Temporarily Unavailable
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Assign / Enquire */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const assignment = assignedServices.find(
                            (a) => a.serviceId === service.id
                          );
                          if (assignment) {
                            handleUnassign(assignment.assignmentId);
                          } else {
                            handleOpenAssignmentModal(service);
                          }
                        }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-md ${
                          assignedServices.some(
                            (a) => a.serviceId === service.id
                          )
                            ? 'bg-green-600'
                            : 'bg-gradient-to-r from-[#f36969] to-[#e85555]'
                        }`}
                      >
                        {assignedServices.some(
                          (a) => a.serviceId === service.id
                        ) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Assign
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          router.push(`/company/services/${service.id}`)
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600"></div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Loading Services...
              </h3>
              <p className="text-gray-600">
                Fetching available services from our network
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-4 text-red-500">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{error}</h3>
              <p className="text-gray-600">Showing cached services data</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No services found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </main>

        {/* Service Enquiry Modal */}
        <ServiceEnquiryModal
          isOpen={serviceEnquiryModalOpen}
          onClose={() => setServiceEnquiryModalOpen(false)}
        />

        {/* Service Assignment Modal */}
        <ServiceAssignmentModal
          isOpen={serviceAssignmentModalOpen}
          onClose={handleCloseAssignmentModal}
          service={selectedServiceForAssignment}
          onAssign={handleAssign}
        />

        <Footer />
      </div>
    </CompanyProtected>
  );
}
