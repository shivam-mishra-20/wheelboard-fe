'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vehicle, Driver } from '@/lib/mockApi';

interface VehiclesListingProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddVehicle?: () => void;
  onEditVehicle?: (vehicle: Vehicle) => void;
  onDeleteVehicle?: (vehicle: Vehicle) => void;
  onVehicleClick?: (vehicleId: string) => void;
  onAddDriver?: () => void;
  onEditDriver?: (driver: Driver) => void;
  onDeleteDriver?: (driver: Driver) => void;
  onDriverClick?: (driverId: string) => void;
}

export default function VehiclesListing({
  vehicles,
  drivers,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onVehicleClick,
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
  onDriverClick,
}: VehiclesListingProps) {
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles'>(
    'vehicles'
  );

  // Badge color based on vehicle status
  const vehicleStatusColors = {
    Attached: 'bg-blue-100 text-blue-800',
    Owned: 'bg-green-100 text-green-800',
    Rented: 'bg-orange-100 text-orange-800',
  };

  // Badge color based on driver status
  const driverStatusColors = {
    Available: 'bg-green-100 text-green-800',
    'On Trip': 'bg-blue-100 text-blue-800',
    'Off Duty': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="mb-16">
      {/* Top tabs centered as a rounded pill toggle with premium styling */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-1.5 shadow-premium">
          <motion.button
            onClick={() => setActiveTab('drivers')}
            className={`rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'drivers'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-transparent text-gray-600 hover:bg-white hover:text-primary-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Drivers
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('vehicles')}
            className={`rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'vehicles'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-transparent text-gray-600 hover:bg-white hover:text-primary-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Vehicles
          </motion.button>
        </div>
      </div>

      {/* Heading and controls row */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="bg-gradient-premium bg-clip-text text-3xl font-bold text-transparent">
          {activeTab === 'vehicles' ? 'Vehicles Listed' : 'Drivers Listed'}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'vehicles' ? (
            <>
              <select className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                <option>All Status</option>
                <option>Attached</option>
                <option>Owned</option>
                <option>Rented</option>
              </select>

              <select className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                <option>Vehicle Type</option>
                <option>Trucks</option>
                <option>Vans</option>
                <option>Buses</option>
              </select>

              <motion.button
                onClick={onAddVehicle}
                className="btn-primary flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
                <span>Add Vehicle</span>
              </motion.button>
            </>
          ) : (
            <>
              <select className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                <option>All Status</option>
                <option>Available</option>
                <option>On Trip</option>
                <option>Off Duty</option>
              </select>

              <select className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                <option>Experience</option>
                <option>0-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>

              <motion.button
                onClick={onAddDriver}
                className="btn-primary flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
                <span>Add Driver</span>
              </motion.button>
            </>
          )}
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
            className="space-y-5"
          >
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  transition: { duration: 0.3 },
                }}
                onClick={() => onVehicleClick?.(vehicle.id)}
                className="flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-premium transition-all duration-500 hover:border-primary-200 hover:shadow-premium-lg sm:flex-row md:h-[160px]"
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

                <div className="flex flex-1 flex-col justify-between p-6 sm:flex-row sm:items-center">
                  <div className="space-y-3 pb-4 sm:pb-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {vehicle.name} - {vehicle.year}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${vehicleStatusColors[vehicle.status as keyof typeof vehicleStatusColors]}`}
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
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditVehicle?.(vehicle);
                      }}
                      className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-blue-600 shadow-sm transition-all hover:from-blue-100 hover:to-blue-200 hover:shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVehicle?.(vehicle);
                      }}
                      className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-3 text-[#FF7A00] shadow-sm transition-all hover:from-orange-100 hover:to-orange-200 hover:shadow-md"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
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
                    </motion.button>
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
            className="space-y-5"
          >
            {drivers.map((driver) => (
              <motion.div
                key={driver.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  transition: { duration: 0.3 },
                }}
                onClick={() => onDriverClick?.(driver.id)}
                className="flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-premium transition-all duration-500 hover:border-primary-200 hover:shadow-premium-lg sm:flex-row md:h-[180px]"
              >
                {/* Mobile image for smaller screens */}
                <div className="relative h-48 sm:hidden">
                  <Image
                    src={driver.image}
                    alt={driver.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:flex-row sm:items-center">
                  <div className="space-y-3 pb-4 sm:pb-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {driver.name}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${driverStatusColors[driver.status]}`}
                      >
                        {driver.status}
                      </span>
                    </div>

                    {/* Driver Details */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg
                            className="mr-1.5 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            {driver.experience} exp
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="mr-1.5 h-4 w-4 text-yellow-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">
                            {driver.rating} rating
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="mr-1.5 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                          <span>{driver.totalTrips} trips</span>
                        </div>
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
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{driver.location}</span>
                        </div>
                        {driver.currentVehicle && (
                          <div className="flex items-center">
                            <svg
                              className="mr-1.5 h-4 w-4 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <span className="text-blue-600">
                              {driver.currentVehicle}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>License: {driver.licenseNumber}</span>
                        <span>•</span>
                        <span>{driver.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDriver?.(driver);
                      }}
                      className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-blue-600 shadow-sm transition-all hover:from-blue-100 hover:to-blue-200 hover:shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDriver?.(driver);
                      }}
                      className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-3 text-[#FF7A00] shadow-sm transition-all hover:from-orange-100 hover:to-orange-200 hover:shadow-md"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
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
                    </motion.button>
                  </div>
                </div>

                {/* Desktop image - hidden on mobile */}
                <div className="relative hidden h-auto w-48 sm:block">
                  <Image
                    src={driver.image}
                    alt={driver.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
