'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Mail, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Driver } from '@/lib/mockApi';

interface DriverInfoCardProps {
  driver: Driver;
  onToggleFavorite: () => void;
  onRemove: () => void;
}

export default function DriverInfoCard({
  driver,
  onToggleFavorite,
  onRemove,
}: DriverInfoCardProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      {/* Gradient Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-[#F36565] via-purple-500 to-[#3B82F6]" />

      {/* Card Content */}
      <div className="p-6">
        {/* Driver Avatar & Status */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                src={driver.image}
                alt={driver.name}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Status Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F36565] to-[#3B82F6] px-3 py-1 text-xs font-semibold text-white shadow-md">
              {driver.statusBadge}
            </div>
          </div>

          {/* Driver Name & Plate */}
          <h2 className="mb-1 text-2xl font-bold text-gray-900">
            {driver.name}
          </h2>
          <p className="text-sm font-medium text-gray-500">
            {driver.licenseNumber}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-[#3B82F6] text-[#3B82F6] transition-all hover:bg-[#3B82F6] hover:text-white"
            onClick={() => window.open(`tel:${driver.phoneNumber}`, '_self')}
          >
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-[#3B82F6] text-[#3B82F6] transition-all hover:bg-[#3B82F6] hover:text-white"
            onClick={() => window.open(`mailto:${driver.email}`, '_blank')}
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          <Button
            variant="outline"
            className={`flex items-center justify-center gap-2 transition-all ${
              driver.isFavorite
                ? 'border-[#F36565] bg-[#F36565] text-white hover:bg-[#d54d4d]'
                : 'border-[#F36565] text-[#F36565] hover:bg-[#F36565] hover:text-white'
            }`}
            onClick={onToggleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${driver.isFavorite ? 'fill-current' : ''}`}
            />
            <span>Favorite</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-red-600 text-red-600 transition-all hover:bg-red-600 hover:text-white"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove</span>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="space-y-3 border-t border-gray-100 pt-6">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Experience</span>
            <span className="text-sm font-semibold text-gray-900">
              {driver.experience}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total Trips</span>
            <span className="text-sm font-semibold text-gray-900">
              {driver.totalTrips.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span
              className={`text-sm font-semibold ${
                driver.status === 'Available'
                  ? 'text-green-600'
                  : driver.status === 'On Trip'
                    ? 'text-blue-600'
                    : 'text-gray-500'
              }`}
            >
              {driver.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Rating</span>
            <span className="text-sm font-semibold text-gray-900">
              ⭐ {driver.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
