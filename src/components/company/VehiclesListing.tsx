'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Vehicle {
  id: string;
  name: string;
  year: number;
  status: 'Attached' | 'Owned' | 'Rented';
  lastService: string;
  location: string;
  image: string;
}

interface VehiclesListingProps {
  vehicles: Vehicle[];
}

export default function VehiclesListing({ vehicles }: VehiclesListingProps) {
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles'>(
    'vehicles'
  );

  // Badge color based on status
  const statusColors = {
    Attached: 'bg-blue-100 text-blue-800',
    Owned: 'bg-green-100 text-green-800',
    Rented: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="mb-12">
      {/* Top tabs centered as a rounded pill toggle (design match) */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-1 py-1 shadow-sm">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`rounded-full px-8 py-2 text-sm font-medium transition-all ${
              activeTab === 'drivers'
                ? 'bg-white text-red-500'
                : 'bg-transparent text-red-400 hover:bg-white'
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`rounded-full px-8 py-2 text-sm font-medium transition-all ${
              activeTab === 'vehicles'
                ? 'bg-red-400 text-white shadow'
                : 'bg-transparent text-red-400 hover:bg-white'
            }`}
          >
            Vehicles
          </button>
        </div>
      </div>

      {/* Heading and controls row */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vehicles Listed</h1>

        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none">
            <option>All Status</option>
            <option>Attached</option>
            <option>Owned</option>
            <option>Rented</option>
          </select>

          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none">
            <option>Vehicle Type</option>
            <option>Trucks</option>
            <option>Vans</option>
            <option>Buses</option>
          </select>

          <button className="rounded-lg bg-red-400 px-2 py-2 text-xs text-white transition hover:bg-red-500 md:text-sm md:font-medium">
            + Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicles List */}
      <AnimatePresence mode="wait">
        {activeTab === 'vehicles' && (
          <motion.div
            key="vehicles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm sm:flex-row md:h-[140px]"
              >
                {/* Mobile image for smaller screens */}
                <div className="relative h-48 sm:hidden">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} - ${vehicle.year}`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 sm:flex-row sm:items-center">
                  <div className="space-y-2 pb-3 sm:pb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {vehicle.name} - {vehicle.year}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[vehicle.status]}`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg
                          className="mr-1.5 h-4 w-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{vehicle.lastService}</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="mr-1.5 h-4 w-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{vehicle.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button className="rounded-full bg-red-100 p-2 text-red-600 transition hover:bg-red-200">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Desktop image - hidden on mobile */}
                <div className="relative hidden h-auto w-48 sm:block">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} - ${vehicle.year}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'drivers' && (
          <motion.div
            key="drivers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-white p-6 text-center"
          >
            <p className="text-gray-600">Drivers listing would appear here.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
