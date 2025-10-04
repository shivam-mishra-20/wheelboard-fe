'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/lib/mockApi';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Check, Upload } from 'lucide-react';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  vehicle?: Vehicle | null;
  mode: 'add' | 'edit';
}

type FormData = Partial<Vehicle> & {
  vehicleCategory?: string;
  vehicleCategoryDetail?: string;
};

export default function VehicleFormModal({
  isOpen,
  onClose,
  onSave,
  vehicle,
  mode,
}: VehicleFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    year: new Date().getFullYear(),
    status: 'Owned',
    lastService: '',
    location: '',
    image: '/truck-01.jpg',
    model: '',
    registrationNumber: '',
    fuelType: 'Diesel',
    capacity: '',
    mileage: '',
    vehicleCategory: '',
    vehicleCategoryDetail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Initialize form with vehicle data or reset
  useEffect(() => {
    if (vehicle && mode === 'edit') {
      setFormData({
        ...vehicle,
        vehicleCategory: '',
        vehicleCategoryDetail: '',
      });
      setImagePreview(vehicle.image || null);
      setConfirmChecked(false);
    } else if (mode === 'add' || !isOpen) {
      setFormData({
        name: '',
        year: new Date().getFullYear(),
        status: 'Owned',
        lastService: '',
        location: '',
        image: '/truck-01.jpg',
        model: '',
        registrationNumber: '',
        fuelType: 'Diesel',
        capacity: '',
        mileage: '',
        vehicleCategory: '',
        vehicleCategoryDetail: '',
      });
      setImagePreview(null);
      setConfirmChecked(false);
    }
    setErrors({});
  }, [vehicle, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.model?.trim()) {
      newErrors.model = 'Vehicle model is required';
    }
    if (!formData.registrationNumber?.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = 'Please enter a valid year';
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
    if (!formData.location?.trim()) {
      newErrors.location = 'Description is required';
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

    const vehicleData: Vehicle = {
      id: vehicle?.id || `v${Date.now()}`,
      name: formData.model!,
      year: formData.year!,
      status: formData.status!,
      lastService:
        formData.lastService ||
        `Last service: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`,
      location: formData.location!,
      image: formData.image || '/truck-01.jpg',
      model: formData.model,
      registrationNumber: formData.registrationNumber,
      fuelType: formData.fuelType,
      capacity: formData.capacity,
      mileage: formData.mileage,
    };

    onSave(vehicleData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || '' : value,
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
            {mode === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Vehicle Model */}
          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium">
              Vehicle Model *
            </Label>
            <Input
              id="model"
              name="model"
              value={formData.model || ''}
              onChange={handleInputChange}
              placeholder="e.g., Tata-5218"
              className={errors.model ? 'border-red-500' : ''}
            />
            {errors.model && (
              <p className="text-sm text-red-500">{errors.model}</p>
            )}
          </div>

          {/* Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="registrationNumber" className="text-sm font-medium">
              Registration Number *
            </Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber || ''}
              onChange={handleInputChange}
              placeholder="e.g., DL-01-AB-1234"
              className={errors.registrationNumber ? 'border-red-500' : ''}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-red-500">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Year of Manufacturing *
            </Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year || ''}
              onChange={handleInputChange}
              placeholder="e.g., 2020"
              min="1900"
              max={new Date().getFullYear() + 1}
              className={errors.year ? 'border-red-500' : ''}
            />
            {errors.year && (
              <p className="text-sm text-red-500">{errors.year}</p>
            )}
          </div>

          {/* Ownership Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ownership Status *</Label>
            <RadioGroup
              value={formData.status || 'Owned'}
              onValueChange={(value) => handleSelectChange('status', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Owned" id="owned" />
                <Label htmlFor="owned" className="cursor-pointer font-normal">
                  Owned
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Attached" id="attached" />
                <Label
                  htmlFor="attached"
                  className="cursor-pointer font-normal"
                >
                  Attached
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Vehicle Category */}
          <div className="space-y-2">
            <Label htmlFor="vehicleCategory" className="text-sm font-medium">
              Vehicle Category *
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
                placeholder="Enter vehicle type"
                className={errors.vehicleCategoryDetail ? 'border-red-500' : ''}
              />
              {errors.vehicleCategoryDetail && (
                <p className="text-sm text-red-500">
                  {errors.vehicleCategoryDetail}
                </p>
              )}
            </div>
          )}

          {/* Fuel Type */}
          <div className="space-y-2">
            <Label htmlFor="fuelType" className="text-sm font-medium">
              Fuel Type
            </Label>
            <Select
              value={formData.fuelType || 'Diesel'}
              onValueChange={(value) => handleSelectChange('fuelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Capacity
            </Label>
            <Input
              id="capacity"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleInputChange}
              placeholder="e.g., 10 tons"
            />
          </div>

          {/* Mileage */}
          <div className="space-y-2">
            <Label htmlFor="mileage" className="text-sm font-medium">
              Mileage
            </Label>
            <Input
              id="mileage"
              name="mileage"
              value={formData.mileage || ''}
              onChange={handleInputChange}
              placeholder="e.g., 50,000 km"
            />
          </div>

          {/* Description/Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              placeholder="Enter vehicle description or current location"
              rows={3}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Vehicle Image
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
                className="border-input hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Image</span>
              </Label>
              {imagePreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-4">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmChecked}
              onChange={(e) => {
                setConfirmChecked(e.target.checked);
                clearError('confirm');
              }}
              className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-gray-300"
            />
            <Label
              htmlFor="confirm"
              className="cursor-pointer text-sm font-normal"
            >
              I confirm that all the information provided above is correct and
              accurate to the best of my knowledge.
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
              {mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
