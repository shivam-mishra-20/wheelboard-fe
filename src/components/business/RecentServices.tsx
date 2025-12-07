'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
import { Loader2 } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export default function RecentServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const currentUser = api.getCurrentUser();

        if (!currentUser) {
          console.log('No user logged in');
          setServices([]);
          setIsLoading(false);
          return;
        }

        const response = await wheelboardApi.service.getServiceList(
          currentUser.id
        );
        console.log('🔧 Recent Services Response:', response);

        const apiResponse = response as any;
        let servicesData: any[] = [];

        if (apiResponse.success && apiResponse.data) {
          servicesData = Array.isArray(apiResponse.data)
            ? apiResponse.data
            : [apiResponse.data];
        } else if (Array.isArray(apiResponse)) {
          servicesData = apiResponse;
        }

        // Transform and take first 2 services
        const transformedServices: Service[] = servicesData
          .slice(0, 2)
          .map((service: any) => ({
            id: service.serviceId,
            title: service.title || service.serviceTitle,
            description: service.description || 'No description available',
            image: (service.images && service.images[0]) || '/excavator.jpg',
            category: service.serviceCategory || service.category || 'Service',
          }));

        setServices(transformedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-12 md:mb-20">
        <div className="mb-6 flex items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-8 lg:mb-10">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            Recent <span className="text-[#f36969]">Services</span>
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="mb-12 md:mb-20">
        <div className="mb-6 flex items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-8 lg:mb-10">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            Recent <span className="text-[#f36969]">Services</span>
          </h2>
        </div>
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
          <p className="text-gray-500">
            No services available. Add your first service!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 md:mb-20">
      {/* Header Section */}
      <div className="flex-col-span-2 mb-6 flex items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-8 lg:mb-10">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
          Recent <span className="text-[#f36969]">Services</span>
        </h2>
        <Link
          href="/business/listings"
          className="group flex items-center gap-2 rounded-full bg-[#f36969] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#f36969]/10 hover:shadow-md sm:px-5 sm:py-2.5"
        >
          <span>View All</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>

      {/* Services Grid */}
      <div className="space-y-4 md:space-y-5 lg:space-y-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-[#f36969]/20 hover:shadow-xl hover:shadow-[#f36969]/5 sm:rounded-2xl md:rounded-3xl"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image Section - Top on mobile, Right on desktop */}
              <div className="relative order-1 h-48 w-full flex-shrink-0 overflow-hidden sm:order-2 sm:h-auto sm:w-40 md:w-48 lg:w-56">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent sm:bg-gradient-to-l" />
              </div>

              {/* Content Section */}
              <div className="order-2 flex flex-1 flex-col p-4 sm:order-1 sm:p-5 md:p-6 lg:p-7">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block rounded-full bg-[#f36969]/10 px-3 py-1 text-xs font-semibold text-[#f36969] sm:text-sm">
                    {service.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#f36969] sm:text-xl md:mb-3 md:text-2xl">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 sm:line-clamp-3 md:mb-5 md:text-base">
                  {service.description}
                </p>

                {/* Action Buttons */}
                <div className="mt-auto flex flex-wrap gap-2 sm:gap-3">
                  <Link href={`/business/listings/${service.id}`}>
                    <motion.button
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#f36969]/10 px-3 py-2 text-xs font-semibold text-[#f36969] transition-all hover:bg-[#f36969] hover:text-white hover:shadow-md sm:rounded-xl sm:px-4 sm:text-sm"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>View Details</span>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
