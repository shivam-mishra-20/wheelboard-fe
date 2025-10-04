'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, DollarSign } from 'lucide-react';

interface LeaseVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leaseData: LeaseFormData) => void;
  vehicleName: string;
  vehicleImage: string;
}

export interface LeaseFormData {
  startDate: string;
  endDate: string;
  monthlyRun: number;
  odometerStart: number;
  odometerBookingOnLease: number;
  pricingModel: 'flat' | 'km-based';
  flatPricePerDay?: number;
  pricePerKm?: number;
  topEfficiency?: number;
  businessDays: number[];
  businessHoursStart: string;
  businessHoursEnd: string;
  additionalInstructions?: string;
}

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const dayValues = [1, 2, 3, 4, 5, 6, 0];

export default function LeaseVehicleModal({
  isOpen,
  onClose,
  onSubmit,
  vehicleName,
  vehicleImage,
}: LeaseVehicleModalProps) {
  const [formData, setFormData] = useState<LeaseFormData>({
    startDate: '',
    endDate: '',
    monthlyRun: 0,
    odometerStart: 0,
    odometerBookingOnLease: 0,
    pricingModel: 'flat',
    flatPricePerDay: 0,
    pricePerKm: 0,
    topEfficiency: 0,
    businessDays: [1, 2, 3, 4, 5],
    businessHoursStart: '09:00',
    businessHoursEnd: '18:00',
    additionalInstructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleBusinessDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      businessDays: prev.businessDays.includes(day)
        ? prev.businessDays.filter((d) => d !== day)
        : [...prev.businessDays, day],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    if (!formData.monthlyRun || formData.monthlyRun <= 0) {
      newErrors.monthlyRun = 'Monthly run must be greater than 0';
    }
    if (!formData.odometerStart || formData.odometerStart < 0) {
      newErrors.odometerStart = 'Odometer reading is required';
    }
    if (
      !formData.odometerBookingOnLease ||
      formData.odometerBookingOnLease < 0
    ) {
      newErrors.odometerBookingOnLease = 'Odometer booking is required';
    }
    if (
      formData.pricingModel === 'flat' &&
      (!formData.flatPricePerDay || formData.flatPricePerDay <= 0)
    ) {
      newErrors.flatPricePerDay = 'Flat price per day is required';
    }
    if (
      formData.pricingModel === 'km-based' &&
      (!formData.pricePerKm || formData.pricePerKm <= 0)
    ) {
      newErrors.pricePerKm = 'Price per KM is required';
    }
    if (formData.businessDays.length === 0) {
      newErrors.businessDays = 'Select at least one business day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'monthlyRun' ||
        name === 'odometerStart' ||
        name === 'odometerBookingOnLease' ||
        name === 'flatPricePerDay' ||
        name === 'pricePerKm' ||
        name === 'topEfficiency'
          ? parseFloat(value) || 0
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Lease Vehicle
          </DialogTitle>
        </DialogHeader>

        {/* Vehicle Header */}
        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#F36565]/10 to-[#3B82F6]/10 p-3">
          <div className="h-12 w-12 overflow-hidden rounded-lg">
            <Image
              src={vehicleImage}
              alt={vehicleName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{vehicleName}</p>
            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Owned
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lease Details Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Lease Details
            </h3>

            {/* Vehicle Info Fields */}
            <div className="space-y-2">
              <Label htmlFor="vehicleTitle" className="text-xs text-gray-600">
                Title vehicle title
              </Label>
              <Input
                id="vehicleTitle"
                name="vehicleTitle"
                value={vehicleName}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="text-xs text-gray-600">
                Vehicle Number
              </Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                placeholder="Enter vehicle number"
                className={errors.vehicleNumber ? 'border-red-500' : ''}
              />
            </div>

            {/* Odometer Readings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="odometerStart"
                  className="text-xs text-gray-600"
                >
                  Odometer Reading on lease start (Kms)
                </Label>
                <Input
                  id="odometerStart"
                  name="odometerStart"
                  type="number"
                  value={formData.odometerStart || ''}
                  onChange={handleInputChange}
                  placeholder="63000"
                  className={errors.odometerStart ? 'border-red-500' : ''}
                />
                {errors.odometerStart && (
                  <p className="text-xs text-red-500">{errors.odometerStart}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="odometerBookingOnLease"
                  className="text-xs text-gray-600"
                >
                  Odometer Booking on lease (Kms)
                </Label>
                <Input
                  id="odometerBookingOnLease"
                  name="odometerBookingOnLease"
                  type="number"
                  value={formData.odometerBookingOnLease || ''}
                  onChange={handleInputChange}
                  placeholder="63000"
                  className={
                    errors.odometerBookingOnLease ? 'border-red-500' : ''
                  }
                />
              </div>
            </div>

            {/* Pricing Model */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">
                Choose Pricing Model
              </Label>
              <RadioGroup
                value={formData.pricingModel}
                onValueChange={(value: 'flat' | 'km-based') =>
                  setFormData((prev) => ({ ...prev, pricingModel: value }))
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat" id="flat" />
                  <Label htmlFor="flat" className="font-normal">
                    Flat Price per Day
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="km-based" id="km-based" />
                  <Label htmlFor="km-based" className="font-normal">
                    KM Based
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Pricing Inputs */}
            {formData.pricingModel === 'flat' && (
              <div className="space-y-2">
                <Label
                  htmlFor="flatPricePerDay"
                  className="text-xs text-gray-600"
                >
                  Enter price
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="flatPricePerDay"
                    name="flatPricePerDay"
                    type="number"
                    value={formData.flatPricePerDay || ''}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.flatPricePerDay ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.flatPricePerDay && (
                  <p className="text-xs text-red-500">
                    {errors.flatPricePerDay}
                  </p>
                )}
              </div>
            )}

            {formData.pricingModel === 'km-based' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pricePerKm" className="text-xs text-gray-600">
                    Avg. Monthly Run
                  </Label>
                  <Input
                    id="monthlyRun"
                    name="monthlyRun"
                    type="number"
                    value={formData.monthlyRun || ''}
                    onChange={handleInputChange}
                    placeholder="15002 KM"
                    className={errors.monthlyRun ? 'border-red-500' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="topEfficiency"
                    className="text-xs text-gray-600"
                  >
                    Top Efficiency
                  </Label>
                  <Input
                    id="topEfficiency"
                    name="topEfficiency"
                    type="number"
                    value={formData.topEfficiency || ''}
                    onChange={handleInputChange}
                    placeholder="3 KM"
                    className={errors.topEfficiency ? 'border-red-500' : ''}
                  />
                </div>
              </div>
            )}

            {/* Lease Period */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Lease Period</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs text-gray-500">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`pl-9 ${errors.startDate ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-xs text-red-500">{errors.startDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs text-gray-500">
                    End Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`pl-9 ${errors.endDate ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-xs text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Days */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Business Days</Label>
              <div className="flex gap-2">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleBusinessDay(dayValues[index])}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                      formData.businessDays.includes(dayValues[index])
                        ? 'border-[#3B82F6] bg-[#3B82F6] text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-[#3B82F6]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.businessDays && (
                <p className="text-xs text-red-500">{errors.businessDays}</p>
              )}
            </div>

            {/* Business Hours */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Business Hours</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="time"
                  name="businessHoursStart"
                  value={formData.businessHoursStart}
                  onChange={handleInputChange}
                  className="text-sm"
                />
                <Input
                  type="time"
                  name="businessHoursEnd"
                  value={formData.businessHoursEnd}
                  onChange={handleInputChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Additional Instructions */}
            <div className="space-y-2">
              <Label
                htmlFor="additionalInstructions"
                className="text-xs text-gray-600"
              >
                Additional Instructions (Optional)
              </Label>
              <Textarea
                id="additionalInstructions"
                name="additionalInstructions"
                value={formData.additionalInstructions}
                onChange={handleInputChange}
                placeholder="Special notes or instructions..."
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#F36565] to-[#3B82F6] text-white hover:opacity-90"
            >
              Post Lease
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
