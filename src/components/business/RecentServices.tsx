'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Fleet Maintenance & Repair',
    description:
      'Comprehensive maintenance and repair services for all types of commercial vehicles. Regular servicing, emergency repairs, and preventive maintenance.',
    image: '/excavator.jpg',
    category: 'Maintenance',
  },
  {
    id: 2,
    title: 'Vehicle Parts Supply',
    description:
      'Genuine and aftermarket parts supply for trucks, buses, and heavy machinery. Fast delivery and quality assurance for all components.',
    image:
      '/Cards/450-4504112_engine-carens-automotive-motors-parts-kia-cerato-clipart 1.png',
    category: 'Parts',
  },
];

export default function RecentServices() {
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
                  <motion.button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm sm:flex-none sm:rounded-xl sm:px-4 sm:text-sm"
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Share</span>
                    <span className="sm:hidden">Share</span>
                  </motion.button>
                  <motion.button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#f36969]/10 px-3 py-2 text-xs font-semibold text-[#f36969] transition-all hover:bg-[#f36969] hover:text-white hover:shadow-md sm:flex-none sm:rounded-xl sm:px-4 sm:text-sm"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
