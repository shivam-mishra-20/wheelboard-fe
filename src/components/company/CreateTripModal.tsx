'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
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
}

export default function CreateTripModal({
  open,
  onClose,
  onTripCreated,
}: CreateTripModalProps) {
  const [vehicles, setVehicles] = useState<
    Array<{ id: string; name: string; registrationNumber: string }>
  >([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
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

  // Fetch vehicles when modal opens
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!open) return;

      try {
        setIsLoadingVehicles(true);
        const user = api.getCurrentUser();
        if (!user) return;

        const response = await wheelboardApi.transport.getVehiclesByUser(
          user.id
        );
        const vehiclesData = (response.data as any[]) || [];

        const mappedVehicles = vehiclesData.map((v: any) => ({
          id: v.vehicleId,
          name:
            v.vehicleName ||
            v.vehicleModel ||
            v.vehicleType ||
            'Unknown Vehicle',
          registrationNumber: v.vehicleNumber || v.registrationNumber || 'N/A',
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, [open]);

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

  const handlePostTrip = async () => {
    try {
      const user = api.getCurrentUser();
      if (!user) {
        alert('Please log in to create a trip');
        return;
      }

      // Call the add-trip API
      console.log('Creating trip with data:', {
        UserId: user.id,
        VehicleId: formData.vehicleId,
        DriverId: '',
        PickupLocation: formData.pickupLocation,
        DeliveryLocation: formData.deliveryLocation,
        PickupDate: formData.pickupDate,
        PickupTime: formData.pickupTime,
        SpecialInstructions: formData.specialInstructions,
        PayRange: formData.payRange,
        TripStatus: 'Upcoming',
      });

      const response = await wheelboardApi.trip.addTrip({
        UserId: user.id,
        VehicleId: formData.vehicleId,
        DriverId: '', // Will be assigned later via bidding
        PickupLocation: formData.pickupLocation,
        DeliveryLocation: formData.deliveryLocation,
        PickupDate: formData.pickupDate,
        PickupTime: formData.pickupTime,
        SpecialInstructions: formData.specialInstructions,
        PayRange: formData.payRange,
        TripStatus: 'Upcoming', // Changed from 'Pending' to 'Upcoming'
      });

      console.log('Trip created successfully:', response);

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
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    }
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
                      {isLoadingVehicles ? (
                        <div className="py-2 text-center text-sm text-gray-500">
                          Loading vehicles...
                        </div>
                      ) : vehicles.length === 0 ? (
                        <div className="py-2 text-center text-sm text-gray-500">
                          No vehicles available
                        </div>
                      ) : (
                        vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} - {vehicle.registrationNumber}
                          </SelectItem>
                        ))
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 text-left text-sm font-normal hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500',
                          !formData.pickupDate && 'text-gray-500'
                        )}
                      >
                        <span>
                          {formData.pickupDate
                            ? format(new Date(formData.pickupDate), 'PPP')
                            : 'Choose a date'}
                        </span>
                        <Calendar className="h-5 w-5 text-primary-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          formData.pickupDate
                            ? new Date(formData.pickupDate)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleInputChange(
                            'pickupDate',
                            date ? format(date, 'yyyy-MM-dd') : ''
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
