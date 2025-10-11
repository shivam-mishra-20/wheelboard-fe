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
    <div className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Services</h2>
        <Link
          href="/business/listings"
          className="group flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium text-primary-600 transition-all hover:shadow-glow"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-start justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-lg"
          >
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-2">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                  {service.category}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
                {service.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {service.description}
              </p>
              <div className="flex space-x-3">
                <button className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50">
                  Share
                </button>
                <button className="rounded-lg border-2 border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition-all hover:bg-primary-100">
                  Edit
                </button>
              </div>
            </div>
            <div className="ml-6 h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
              <Image
                src={service.image}
                alt={service.title}
                width={96}
                height={96}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </motion.div>
        ))}
      </div>
      {/* <div className="mt-6 text-center">
        <button className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-lg">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add New Service</span>
        </button>
      </div> */}
    </div>
  );
}
