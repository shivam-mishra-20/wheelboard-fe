'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';

interface ScheduleTripFormData {
  vehicleId: string;
  driverId: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber?: string;
  phoneNumber?: string;
  status?: string;
}

interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
}

interface ScheduleTripModalProps {
  open: boolean;
  onClose: () => void;
  onTripScheduled: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export default function ScheduleTripModal({
  open,
  onClose,
  onTripScheduled,
  vehicles,
  drivers,
}: ScheduleTripModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<ScheduleTripFormData>({
    vehicleId: '',
    driverId: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    pickupTime: '',
  });

  const handleInputChange = (
    field: keyof ScheduleTripFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleNow = () => {
    // Validate form
    if (
      !formData.vehicleId ||
      !formData.driverId ||
      !formData.pickupLocation ||
      !formData.deliveryLocation ||
      !formData.pickupDate ||
      !formData.pickupTime
    ) {
      alert('Please fill in all required fields');
      return;
    }
    setStep('success');
  };

  const handleDone = () => {
    // Call the success callback
    onTripScheduled();

    // Reset form and close modal
    setFormData({
      vehicleId: '',
      driverId: '',
      pickupLocation: '',
      deliveryLocation: '',
      pickupDate: '',
      pickupTime: '',
    });
    setStep('form');
    onClose();
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
  const selectedDriver = drivers.find((d) => d.id === formData.driverId);

  // Filter available drivers (status is 'Available' or undefined)
  const availableDrivers = drivers.filter(
    (driver) => driver.status === 'Available' || !driver.status
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto p-0">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-center text-2xl font-bold text-gray-900">
                  Trip Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Select Vehicle */}
                <div className="space-y-2">
                  <Label
                    htmlFor="vehicle"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Select Vehicle
                  </Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) =>
                      handleInputChange('vehicleId', value)
                    }
                  >
                    <SelectTrigger
                      id="vehicle"
                      className="h-12 border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Select Vehicle" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.registrationNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Driver */}
                <div className="space-y-2">
                  <Label
                    htmlFor="driver"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Select Driver
                  </Label>
                  <Select
                    value={formData.driverId}
                    onValueChange={(value) =>
                      handleInputChange('driverId', value)
                    }
                  >
                    <SelectTrigger
                      id="driver"
                      className="h-12 border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Select Driver" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {availableDrivers.length > 0 ? (
                        availableDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                            {driver.licenseNumber &&
                              ` - ${driver.licenseNumber}`}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No available drivers
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pickup Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="pickupLocation"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Pickup Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="pickupLocation"
                      type="text"
                      placeholder="Enter pickup location"
                      value={formData.pickupLocation}
                      onChange={(e) =>
                        handleInputChange('pickupLocation', e.target.value)
                      }
                      className="h-12 border-gray-300 bg-gray-50 pl-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="deliveryLocation"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Delivery Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="deliveryLocation"
                      type="text"
                      placeholder="Enter delivery location"
                      value={formData.deliveryLocation}
                      onChange={(e) =>
                        handleInputChange('deliveryLocation', e.target.value)
                      }
                      className="h-12 border-gray-300 bg-gray-50 pl-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Pick up a Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="pickupDate"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Pick up a Date
                  </Label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
                    <Input
                      id="pickupDate"
                      type="date"
                      placeholder="Choose a date"
                      value={formData.pickupDate}
                      onChange={(e) =>
                        handleInputChange('pickupDate', e.target.value)
                      }
                      className="h-12 border-gray-300 bg-gray-50 pr-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Pick Time */}
                <div className="space-y-2">
                  <Label
                    htmlFor="pickupTime"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Pick Time
                  </Label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
                    <Input
                      id="pickupTime"
                      type="time"
                      placeholder="Pick your time."
                      value={formData.pickupTime}
                      onChange={(e) =>
                        handleInputChange('pickupTime', e.target.value)
                      }
                      className="h-12 border-gray-300 bg-gray-50 pr-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Schedule Now Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScheduleNow}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Schedule Now
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {/* Success Icon */}
              <div className="mb-6 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-2 text-2xl font-bold text-gray-900"
                >
                  Trip Scheduled!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-sm text-gray-600"
                >
                  Your trip has been successfully scheduled
                </motion.p>
              </div>

              {/* Trip Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6 space-y-4 rounded-2xl bg-gray-50 p-5"
              >
                <h3 className="mb-3 font-semibold text-gray-900">
                  Trip Overview
                </h3>

                {/* Vehicle */}
                <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
                  <Truck className="mt-1 h-5 w-5 text-primary-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500">
                      Vehicle
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedVehicle?.name} -{' '}
                      {selectedVehicle?.registrationNumber}
                    </p>
                  </div>
                </div>

                {/* Driver */}
                <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
                  <User className="mt-1 h-5 w-5 text-primary-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500">
                      Assigned Driver
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedDriver?.name}
                    </p>
                    {selectedDriver?.phoneNumber && (
                      <p className="text-sm text-gray-600">
                        {selectedDriver.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500">Route</p>
                    <p className="font-semibold text-gray-900">
                      {formData.pickupLocation} → {formData.deliveryLocation}
                    </p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 text-primary-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500">
                      Scheduled Time
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(formData.pickupDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}{' '}
                      at {formData.pickupTime}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Done Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDone}
                className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
