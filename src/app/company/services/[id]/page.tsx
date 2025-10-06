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
  TrendingUp,
  Award,
  Users,
  Calendar,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Img from 'next/image';
import { useState } from 'react';
import ServiceAssignmentModal from '@/components/ServiceAssignmentModal';

// This would typically come from an API or database
const mockServiceDetails = {
  s1: {
    id: 's1',
    name: 'Express Delivery Service',
    category: 'Transport',
    description:
      'Fast and reliable delivery for time-sensitive shipments with real-time tracking and dedicated support. Our express delivery service ensures your cargo reaches its destination on time, every time. We handle everything from documentation to last-mile delivery with utmost care and professionalism.',
    provider: 'QuickTransit Logistics',
    location: 'Pan India',
    rating: 4.8,
    reviews: 245,
    price: 5000,
    priceUnit: 'per trip',
    availability: 'On-demand',
    timing: '24/7',
    responseTime: '< 2 hours',
    coverage: 'Pan India',
    status: 'verified',
    image: '/truck-01.jpg',
    features: [
      'Real-time GPS tracking',
      'Dedicated support team',
      'Insurance coverage included',
      'Express delivery guarantee',
      'Professional drivers',
      '24/7 customer support',
    ],
    stats: {
      projectsCompleted: '2,500+',
      yearsExperience: '8',
      successRate: '99.2%',
      customerSatisfaction: '4.8/5',
    },
  },
  s2: {
    id: 's2',
    name: 'Warehouse Storage',
    category: 'Storage',
    description:
      'Secure storage facilities with 24/7 monitoring and climate control. Perfect for businesses needing flexible storage solutions with easy access. Our warehouse facilities are equipped with modern security systems, fire protection, and inventory management tools to keep your goods safe.',
    provider: 'SafeStore Solutions',
    location: 'Metro Cities',
    rating: 4.7,
    reviews: 189,
    price: 15000,
    priceUnit: 'per month',
    availability: 'Always Available',
    timing: '24/7 Access',
    responseTime: '24 hours',
    coverage: 'Metro Cities',
    status: 'verified',
    image: '/mining-truck.jpg',
    features: [
      '24/7 CCTV surveillance',
      'Climate-controlled environment',
      'Fire safety systems',
      'Flexible rental terms',
      'Easy loading/unloading access',
      'Inventory management support',
    ],
    stats: {
      projectsCompleted: '850+',
      yearsExperience: '15',
      successRate: '98.5%',
      customerSatisfaction: '4.7/5',
    },
  },
  s3: {
    id: 's3',
    name: 'Vehicle Insurance Premium',
    category: 'Insurance',
    description:
      'Comprehensive coverage for your fleet with competitive premiums and hassle-free claims. Protect your business assets with our tailored insurance solutions that cover accidents, theft, third-party liability, and natural disasters. Quick claim processing and dedicated support team.',
    provider: 'Shield Insurance Co.',
    location: 'Nationwide',
    rating: 4.9,
    reviews: 312,
    price: 25000,
    priceUnit: 'per year',
    availability: 'Instant Quote',
    timing: 'Online 24/7',
    responseTime: 'Instant',
    coverage: 'Nationwide',
    status: 'verified',
    image: '/red-truck.png',
    features: [
      'Comprehensive coverage',
      'Third-party liability',
      'Theft and accident protection',
      'Natural disaster coverage',
      'Quick claim settlement',
      'Dedicated claim support',
    ],
    stats: {
      projectsCompleted: '5,000+',
      yearsExperience: '20',
      successRate: '99.5%',
      customerSatisfaction: '4.9/5',
    },
  },
  s4: {
    id: 's4',
    name: 'Fleet Maintenance',
    category: 'Maintenance',
    description:
      'Regular servicing and emergency repairs for your entire fleet. Our certified technicians provide comprehensive maintenance services including engine diagnostics, brake systems, tire rotation, oil changes, and emergency roadside assistance. Keep your vehicles running smoothly and safely.',
    provider: 'AutoCare Services',
    location: 'Major Cities',
    rating: 4.6,
    reviews: 156,
    price: 8000,
    priceUnit: 'per service',
    availability: 'Scheduled',
    timing: 'Mon-Sat 8AM - 6PM',
    responseTime: '< 4 hours',
    coverage: 'Major Cities',
    status: 'verified',
    image: '/excavator.jpg',
    features: [
      'Certified mechanics',
      'Complete diagnostic tools',
      'Genuine spare parts',
      'Emergency roadside assistance',
      'Preventive maintenance plans',
      'Service history tracking',
    ],
    stats: {
      projectsCompleted: '3,200+',
      yearsExperience: '10',
      successRate: '97.8%',
      customerSatisfaction: '4.6/5',
    },
  },
  s5: {
    id: 's5',
    name: 'Overnight Cargo',
    category: 'Transport',
    description:
      'Night-time deliveries for large shipments with specialized handling. Perfect for businesses that need to move goods during off-peak hours. Our overnight cargo service ensures your shipments travel efficiently while avoiding daytime traffic, with full tracking and security.',
    provider: 'NightHaul Express',
    location: 'Regional',
    rating: 4.5,
    reviews: 98,
    price: 12000,
    priceUnit: 'per shipment',
    availability: 'Night Only',
    timing: '8PM - 6AM',
    responseTime: '< 3 hours',
    coverage: 'Regional',
    status: 'verified',
    image: '/Yellow-truck.jpg',
    features: [
      'Specialized night-time logistics',
      'Large cargo capacity',
      'GPS tracking',
      'Experienced drivers',
      'Secure transportation',
      'Flexible scheduling',
    ],
    stats: {
      projectsCompleted: '1,800+',
      yearsExperience: '6',
      successRate: '96.5%',
      customerSatisfaction: '4.5/5',
    },
  },
  s6: {
    id: 's6',
    name: 'Cold Storage',
    category: 'Storage',
    description:
      'Temperature-controlled storage for perishables with precise climate management. Ideal for food, pharmaceuticals, and other temperature-sensitive goods. Our cold storage facilities maintain consistent temperatures with backup power systems and regular monitoring.',
    provider: 'FreshKeep Logistics',
    location: 'Select Cities',
    rating: 4.8,
    reviews: 134,
    price: 20000,
    priceUnit: 'per month',
    availability: 'Limited',
    timing: '24/7 Monitoring',
    responseTime: '12 hours',
    coverage: 'Select Cities',
    status: 'verified',
    image: '/black-truck.png',
    features: [
      'Temperature-controlled (2-8°C)',
      'Backup power systems',
      '24/7 temperature monitoring',
      'FSSAI certified',
      'Hygiene compliance',
      'Quick access for urgent needs',
    ],
    stats: {
      projectsCompleted: '650+',
      yearsExperience: '12',
      successRate: '99.1%',
      customerSatisfaction: '4.8/5',
    },
  },
};

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id as string | undefined;
  const service = serviceId
    ? mockServiceDetails[serviceId as keyof typeof mockServiceDetails]
    : undefined;

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);

  const openAssignmentModal = () => setAssignmentModalOpen(true);
  const closeAssignmentModal = () => setAssignmentModalOpen(false);

  // Map page service shape to modal's expected Service shape
  const modalService = service
    ? {
        id: service.id,
        name: service.name,
        category: service.category.toLowerCase(),
        description: service.description,
        provider: service.provider,
        rating: service.rating,
        reviews: service.reviews,
        price: service.price,
        status: service.status,
        coverage: service.coverage ?? service.location,
        response: service.responseTime ?? '',
        icon: null,
      }
    : null;

  // If service not found, show error or redirect
  if (!service) {
    return (
      <CompanyProtected>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Service not found
            </h1>
            <button
              onClick={() => router.back()}
              className="mt-4 text-[#f36969] hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </CompanyProtected>
    );
  }

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
                    src={service.image}
                    width={800}
                    height={600}
                    alt={service.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                    {service.status === 'verified' && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-6 sm:p-8">
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {service.category}
                    </span>
                  </div>

                  <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                    {service.name}
                  </h1>

                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      {renderStars(service.rating)}
                      <span className="text-lg font-bold text-gray-900">
                        {service.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({service.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f36969]">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Workshop</p>
                      <p className="font-semibold text-gray-900">
                        {service.provider}
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

                  {/* Features */}
                  <div>
                    <h2 className="mb-3 text-xl font-bold text-gray-900">
                      What&apos;s Included
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 rounded-lg bg-green-50 p-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
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
                  Performance Metrics
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-[#f36969]" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {service.stats.projectsCompleted}
                    </p>
                    <p className="text-xs text-gray-600">Projects Done</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {service.stats.yearsExperience}
                    </p>
                    <p className="text-xs text-gray-600">Years Exp.</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {service.stats.successRate}
                    </p>
                    <p className="text-xs text-gray-600">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {service.stats.customerSatisfaction}
                    </p>
                    <p className="text-xs text-gray-600">Rating</p>
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
                    <p className="mb-1 text-sm opacity-90">Starting from</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        ₹{service.price.toLocaleString()}
                      </span>
                      <span className="text-sm opacity-90">
                        / {service.priceUnit}
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
                          {service.location}
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
                          Mon-Sat • {service.timing}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Response Time
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.responseTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Availability
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.availability}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      <Phone className="h-5 w-5" />
                      Call Now
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                  onAssign={(sid) => {
                    // TODO: wire real assign API here. sid is the assigned service id
                    console.log('assigned', sid);
                    closeAssignmentModal();
                  }}
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
