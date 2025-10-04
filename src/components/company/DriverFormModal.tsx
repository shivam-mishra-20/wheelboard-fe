'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Driver } from '@/lib/mockApi';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Upload } from 'lucide-react';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  driver?: Driver | null;
  mode: 'add' | 'edit';
}

type FormData = Partial<Driver> & {
  vehicleCategory?: string;
  vehicleCategoryDetail?: string;
};

export default function DriverFormModal({
  isOpen,
  onClose,
  onSave,
  driver,
  mode,
}: DriverFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    experience: '',
    status: 'Available',
    licenseNumber: '',
    phoneNumber: '',
    rating: 4.0,
    totalTrips: 0,
    currentVehicle: '',
    location: '',
    image: '/staring-man.jpg',
    joinedDate: new Date().toISOString().split('T')[0],
    email: '',
    address: '',
    emergencyContact: '',
    vehicleCategory: '',
    vehicleCategoryDetail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Initialize form with driver data or reset
  useEffect(() => {
    if (driver && mode === 'edit') {
      setFormData({
        ...driver,
        vehicleCategory: '',
        vehicleCategoryDetail: '',
      });
      setImagePreview(driver.image || null);
      setConfirmChecked(false);
    } else if (mode === 'add' || !isOpen) {
      setFormData({
        name: '',
        experience: '',
        status: 'Available',
        licenseNumber: '',
        phoneNumber: '',
        rating: 4.0,
        totalTrips: 0,
        currentVehicle: '',
        location: '',
        image: '/staring-man.jpg',
        joinedDate: new Date().toISOString().split('T')[0],
        email: '',
        address: '',
        emergencyContact: '',
        vehicleCategory: '',
        vehicleCategoryDetail: '',
      });
      setImagePreview(null);
      setConfirmChecked(false);
    }
    setErrors({});
  }, [driver, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Driver name is required';
    }
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.vehicleCategory?.trim()) {
      newErrors.vehicleCategory = 'Vehicle category is required';
    }
    if (
      formData.vehicleCategory === 'Others' &&
      !formData.vehicleCategoryDetail?.trim()
    ) {
      newErrors.vehicleCategoryDetail = 'Please specify vehicle type';
    }
    if (!formData.licenseNumber?.trim()) {
      newErrors.licenseNumber = 'Vehicle number is required';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Description is required';
    }
    if (!confirmChecked) {
      newErrors.confirm = 'Please confirm the information is correct';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const driverData: Driver = {
      id: driver?.id || `d${Date.now()}`,
      name: formData.name!,
      experience: formData.experience || '',
      status: formData.status!,
      licenseNumber: formData.licenseNumber!,
      phoneNumber: formData.phoneNumber!,
      rating: formData.rating || 4.0,
      totalTrips: formData.totalTrips || 0,
      currentVehicle: formData.currentVehicle,
      location: formData.location || '',
      image: formData.image || '/staring-man.jpg',
      joinedDate: formData.joinedDate!,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      performance: driver?.performance ?? {
        timelyDelivery: 0,
        tripEfficiency: 0,
        safety: 0,
      },
      reviews: driver?.reviews ?? [],
    };

    onSave(driverData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError(name);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError(name);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-semibold">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {mode === 'add' ? 'Add New Driver' : 'Edit Driver'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Section Title */}
          <h3 className="text-center text-sm font-medium text-gray-500">
            Driver Details
          </h3>

          {/* Driver Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Driver Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Contact Number *
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              placeholder="Enter number"
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Vehicle Category */}
          <div className="space-y-2">
            <Label htmlFor="vehicleCategory" className="text-sm font-medium">
              Select Vehicle Type *
            </Label>
            <Select
              value={formData.vehicleCategory || ''}
              onValueChange={(value) => {
                handleSelectChange('vehicleCategory', value);
                if (value !== 'Others') {
                  setFormData((prev) => ({
                    ...prev,
                    vehicleCategoryDetail: '',
                  }));
                }
              }}
            >
              <SelectTrigger
                className={errors.vehicleCategory ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shipment">Shipment</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Mining">Mining</SelectItem>
                <SelectItem value="Others">Others (specify)</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleCategory && (
              <p className="text-sm text-red-500">{errors.vehicleCategory}</p>
            )}
          </div>

          {/* Conditional: Vehicle Category Detail */}
          {formData.vehicleCategory === 'Others' && (
            <div className="space-y-2">
              <Label
                htmlFor="vehicleCategoryDetail"
                className="text-sm font-medium"
              >
                Specify Vehicle Type *
              </Label>
              <Input
                id="vehicleCategoryDetail"
                name="vehicleCategoryDetail"
                value={formData.vehicleCategoryDetail || ''}
                onChange={handleInputChange}
                placeholder="e.g., Heavy Duty Excavator"
                className={errors.vehicleCategoryDetail ? 'border-red-500' : ''}
              />
              {errors.vehicleCategoryDetail && (
                <p className="text-sm text-red-500">
                  {errors.vehicleCategoryDetail}
                </p>
              )}
            </div>
          )}

          {/* Vehicle Number (License Number) */}
          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-sm font-medium">
              Enter Vehicle Number *
            </Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber || ''}
              onChange={handleInputChange}
              placeholder="DD Q9 1644"
              className={errors.licenseNumber ? 'border-red-500' : ''}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500">{errors.licenseNumber}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="Enter driver description"
              rows={3}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Upload Image of Driver (Optional)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label
                htmlFor="image"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-4 py-2 transition-colors hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Image</span>
              </Label>
              {imagePreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image
                    src={imagePreview}
                    alt="Driver preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-4">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmChecked}
              onChange={(e) => {
                setConfirmChecked(e.target.checked);
                clearError('confirm');
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label
              htmlFor="confirm"
              className="cursor-pointer text-sm font-normal"
            >
              By adding this you are explicitly entitled to submit the
              information and is correct.
            </Label>
          </div>
          {errors.confirm && (
            <p className="text-sm text-red-500">{errors.confirm}</p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#F36565] to-[#FF8E8E] hover:from-[#E55555] hover:to-[#FF7E7E]"
            >
              <Check className="mr-2 h-4 w-4" />
              {mode === 'add' ? 'Confirm Details' : 'Update Driver'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
