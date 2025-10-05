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
import { Textarea } from '@/components/ui/textarea';
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
  DollarSign,
  FileText,
  CheckCircle2,
  Edit3,
  Send,
} from 'lucide-react';

interface TripFormData {
  vehicleId: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
  payRange: string;
}

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onTripCreated: () => void;
  vehicles: Array<{ id: string; name: string; registrationNumber: string }>;
}

export default function CreateTripModal({
  open,
  onClose,
  onTripCreated,
  vehicles,
}: CreateTripModalProps) {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState<TripFormData>({
    vehicleId: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    pickupTime: '',
    specialInstructions: '',
    payRange: '',
  });

  const handleInputChange = (field: keyof TripFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Validate form
    if (
      !formData.vehicleId ||
      !formData.pickupLocation ||
      !formData.deliveryLocation ||
      !formData.pickupDate ||
      !formData.pickupTime
    ) {
      alert('Please fill in all required fields');
      return;
    }
    setStep('confirmation');
  };

  const handleEdit = () => {
    setStep('form');
  };

  const handlePostTrip = () => {
    // Here you would make an API call to create the trip
    console.log('Creating trip:', formData);

    // Call the success callback
    onTripCreated();

    // Reset form and close modal
    setFormData({
      vehicleId: '',
      pickupLocation: '',
      deliveryLocation: '',
      pickupDate: '',
      pickupTime: '',
      specialInstructions: '',
      payRange: '',
    });
    setStep('form');
    onClose();
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

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
                      placeholder="Pick your time"
                      value={formData.pickupTime}
                      onChange={(e) =>
                        handleInputChange('pickupTime', e.target.value)
                      }
                      className="h-12 border-gray-300 bg-gray-50 pr-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label
                    htmlFor="specialInstructions"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Special Instructions
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Textarea
                      id="specialInstructions"
                      placeholder="Special Instructions"
                      value={formData.specialInstructions}
                      onChange={(e) =>
                        handleInputChange('specialInstructions', e.target.value)
                      }
                      className="min-h-[80px] border-gray-300 bg-gray-50 pl-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Pay Range */}
                <div className="space-y-2">
                  <Label
                    htmlFor="payRange"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Pay Range
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="payRange"
                      type="text"
                      placeholder="Enter Pay Range (Rs 200- Rs 900)"
                      value={formData.payRange}
                      onChange={(e) =>
                        handleInputChange('payRange', e.target.value)
                      }
                      className="h-12 border-gray-300 bg-gray-50 pl-10 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <DialogTitle className="text-center text-2xl font-bold text-gray-900">
                  Confirm Trip Details
                </DialogTitle>
                <p className="text-center text-sm text-gray-600">
                  Please review your trip information before posting
                </p>
              </DialogHeader>

              <div className="mb-6 space-y-4 rounded-2xl bg-gray-50 p-5">
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

                {/* Date & Time */}
                <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
                  <Calendar className="mt-1 h-5 w-5 text-primary-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500">
                      Pickup Schedule
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

                {/* Pay Range */}
                <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
                  <DollarSign className="mt-1 h-5 w-5 text-primary-500" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500">
                      Pay Range
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formData.payRange || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Special Instructions */}
                {formData.specialInstructions && (
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 text-primary-500" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500">
                        Special Instructions
                      </p>
                      <p className="text-sm text-gray-700">
                        {formData.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Trip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePostTrip}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <Send className="h-4 w-4" />
                  Post Trip
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
