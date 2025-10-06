'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Truck,
  MapPin,
  Calendar,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Fuel,
  Settings,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { CompanyProtected } from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginSimulator from '@/components/LoginSimulator';
import Image from 'next/image';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plateNumber: string;
  status: 'active' | 'maintenance' | 'inactive';
  driver: string | null;
  location: string;
  lastService: string;
  nextService: string;
  mileage: number;
  fuelEfficiency: number;
  trips: number;
  image: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Heavy Truck 01',
    type: 'Heavy Duty',
    plateNumber: 'DL-12-AB-3456',
    status: 'active',
    driver: 'Jon Doe',
    location: 'Delhi, India',
    lastService: '2024-09-15',
    nextService: '2024-12-15',
    mileage: 45230,
    fuelEfficiency: 8.5,
    trips: 127,
    image: '/black-truck.png',
  },
  {
    id: 'v2',
    name: 'Medium Truck 02',
    type: 'Medium Duty',
    plateNumber: 'MH-14-CD-7890',
    status: 'active',
    driver: 'Sarah Smith',
    location: 'Mumbai, India',
    lastService: '2024-10-01',
    nextService: '2025-01-01',
    mileage: 32100,
    fuelEfficiency: 12.3,
    trips: 89,
    image: '/red-truck.png',
  },
  {
    id: 'v3',
    name: 'Light Van 03',
    type: 'Light Duty',
    plateNumber: 'KA-03-EF-1234',
    status: 'maintenance',
    driver: null,
    location: 'Bangalore, India',
    lastService: '2024-10-20',
    nextService: '2024-11-05',
    mileage: 18450,
    fuelEfficiency: 15.8,
    trips: 45,
    image: '/VAN 1.png',
  },
  {
    id: 'v4',
    name: 'Heavy Truck 04',
    type: 'Heavy Duty',
    plateNumber: 'UP-16-GH-5678',
    status: 'active',
    driver: 'Michael Chen',
    location: 'Noida, India',
    lastService: '2024-08-30',
    nextService: '2024-11-30',
    mileage: 52890,
    fuelEfficiency: 7.9,
    trips: 156,
    image: '/Yellow-truck.jpg',
  },
  {
    id: 'v5',
    name: 'Medium Truck 05',
    type: 'Medium Duty',
    plateNumber: 'GJ-01-IJ-9012',
    status: 'inactive',
    driver: null,
    location: 'Ahmedabad, India',
    lastService: '2024-07-15',
    nextService: '2024-10-15',
    mileage: 28340,
    fuelEfficiency: 11.2,
    trips: 67,
    image: '/mining truck.png',
  },
];

const statusColors = {
  active: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Active',
  },
  maintenance: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: <Settings className="h-4 w-4" />,
    label: 'Maintenance',
  },
  inactive: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Inactive',
  },
};

export default function FleetsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || vehicle.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockVehicles.length,
    active: mockVehicles.filter((v) => v.status === 'active').length,
    maintenance: mockVehicles.filter((v) => v.status === 'maintenance').length,
    inactive: mockVehicles.filter((v) => v.status === 'inactive').length,
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
                  Fleet Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage and monitor your vehicle fleet
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Add New Vehicle
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
                  Total Fleet
                </span>
                <Truck className="h-5 w-5 text-[#f36969]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="mt-1 text-xs text-gray-500">All vehicles</p>
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
              <p className="mt-1 text-xs text-green-600">On the road</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Maintenance
                </span>
                <Settings className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-900">
                {stats.maintenance}
              </p>
              <p className="mt-1 text-xs text-yellow-600">In service</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Inactive
                </span>
                <AlertCircle className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.inactive}
              </p>
              <p className="mt-1 text-xs text-gray-600">Not in use</p>
            </motion.div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, plate number, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20"
              />
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 sm:w-auto"
              >
                <Filter className="h-5 w-5" />
                Filter
                {filterStatus !== 'all' && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f36969] text-xs text-white">
                    1
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-10 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
                  >
                    <p className="mb-2 text-xs font-bold text-gray-500">
                      STATUS
                    </p>
                    {['all', 'active', 'maintenance', 'inactive'].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setShowFilterMenu(false);
                          }}
                          className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition-all ${
                            filterStatus === status
                              ? 'bg-[#f36969] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle, index) => {
              const statusStyle = statusColors[vehicle.status];
              return (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border ${statusStyle.border} ${statusStyle.bg} px-3 py-1.5 ${statusStyle.text}`}
                    >
                      {statusStyle.icon}
                      <span className="text-xs font-bold">
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-5">
                    <div className="mb-4 border-b border-gray-100 pb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {vehicle.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {vehicle.type}
                      </p>
                      <p className="mt-1 font-mono text-xs font-bold text-[#f36969]">
                        {vehicle.plateNumber}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-1 flex items-center gap-1 text-gray-600">
                          <Activity className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Trips</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {vehicle.trips}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-1 flex items-center gap-1 text-gray-600">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Mileage</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {(vehicle.mileage / 1000).toFixed(1)}k
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-1 flex items-center gap-1 text-gray-600">
                          <Fuel className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Fuel Eff.</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {vehicle.fuelEfficiency} km/l
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-1 flex items-center gap-1 text-gray-600">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Service</span>
                        </div>
                        <p className="text-xs font-bold text-gray-900">
                          {new Date(vehicle.nextService).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric' }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Driver and Location */}
                    <div className="mb-4 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-900">
                          {vehicle.driver || 'No Driver Assigned'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          {vehicle.location}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-[#f36969] hover:bg-[#f36969]/5 hover:text-[#f36969]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredVehicles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <Truck className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No vehicles found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </CompanyProtected>
  );
}
