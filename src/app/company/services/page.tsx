'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import ServiceEnquiryModal from '@/components/ServiceEnquiryModal';
import ServiceAssignmentModal from '@/components/ServiceAssignmentModal';

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

export default function ServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [assignedServices, setAssignedServices] = useState<string[]>([]);
  const [serviceEnquiryModalOpen, setServiceEnquiryModalOpen] = useState(false);
  const [serviceAssignmentModalOpen, setServiceAssignmentModalOpen] =
    useState(false);
  const [selectedServiceForAssignment, setSelectedServiceForAssignment] =
    useState<Service | null>(null);

  const handleAssign = (serviceId: string) => {
    setAssignedServices((prev) => {
      if (prev.includes(serviceId)) return prev;
      return [...prev, serviceId];
    });
  };

  const handleUnassign = (serviceId: string) => {
    setAssignedServices((prev) => prev.filter((i) => i !== serviceId));
  };

  const handleOpenAssignmentModal = (service: Service) => {
    setSelectedServiceForAssignment(service);
    setServiceAssignmentModalOpen(true);
  };

  const handleCloseAssignmentModal = () => {
    setServiceAssignmentModalOpen(false);
    setSelectedServiceForAssignment(null);
  };

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase());

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
          {assignedServices.length > 0 && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-bold">Assigned Services</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {assignedServices.map((sid) => {
                  const svc = mockServices.find((s) => s.id === sid);
                  if (!svc) return null;
                  return (
                    <div
                      key={sid}
                      className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {svc.name}
                        </p>
                        <p className="text-xs text-gray-600">{svc.provider}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setAssignedServices((prev) =>
                              prev.filter((i) => i !== sid)
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
                        >
                          Unassign
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
                        onClick={() =>
                          assignedServices.includes(service.id)
                            ? handleUnassign(service.id)
                            : handleOpenAssignmentModal(service)
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-md ${
                          assignedServices.includes(service.id)
                            ? 'bg-green-600'
                            : 'bg-gradient-to-r from-[#f36969] to-[#e85555]'
                        }`}
                      >
                        {assignedServices.includes(service.id) ? (
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

          {/* Empty State */}
          {filteredServices.length === 0 && (
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
