'use client';

import { useState, useEffect } from 'react';
import { Driver, VEHICLE_CATEGORIES } from '@/types/fleet';
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
import { ArrowLeft, Check, Upload, Search, Loader2 } from 'lucide-react';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { message } from 'antd';

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
  imageFile?: File;
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

  // License lookup state
  const [searchLicenseNumber, setSearchLicenseNumber] = useState('');
  const [searchDob, setSearchDob] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [licenseFound, setLicenseFound] = useState(false);

  // Validate and parse dd/mm/yyyy date format
  const validateDateFormat = (dateStr: string): boolean => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  };

  // Function to search license details
  const handleLicenseSearch = async () => {
    if (!searchLicenseNumber.trim()) {
      setSearchError('Please enter a license number');
      return;
    }
    if (!searchDob) {
      setSearchError('Please enter date of birth');
      return;
    }
    if (!validateDateFormat(searchDob)) {
      setSearchError('Date must be in dd/mm/yyyy format and valid!');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setLicenseFound(false);

    try {
      // DOB is already in dd/mm/yyyy format, send as-is to API
      const response = await wheelboardApi.vehicle.getLicenseDetails(
        searchLicenseNumber.trim().toUpperCase(),
        searchDob
      );

      console.log('License details response:', response);

      if (response.success && response.data) {
        const rawData = response.data as any;

        console.log('Raw license data:', rawData);

        // Extract data from the nested structure
        // API returns: { dlNumber, detailsOfDrivingLicence: { name, address, photo, ... }, badgeDetails: [{ classOfVehicle: [...] }] }
        const details = rawData.detailsOfDrivingLicence || rawData;
        const badgeDetails = rawData.badgeDetails?.[0] || {};

        // Get the complete address
        const completeAddress =
          details.address || details.addressList?.[0]?.completeAddress || '';

        // Get vehicle class from badgeDetails
        const vehicleClass = badgeDetails.classOfVehicle?.[0] || '';

        // Format name to Title Case and remove extra spaces
        const formatName = (name: string): string => {
          if (!name) return '';
          return name
            .toLowerCase()
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        };

        const formattedName = formatName(details.name || '');

        // Auto-fill the form with fetched data
        // NOTE: We only fill name and address from license
        // Image should be uploaded separately by user
        setFormData((prev) => ({
          ...prev,
          // Driver Name from license (formatted)
          name: formattedName,
          // Address/Description
          address: completeAddress,
          // Phone if available (not in this response, keep previous)
          phoneNumber: prev.phoneNumber,
          // Vehicle class/category from license (if matches our categories)
          vehicleCategory: vehicleClass || prev.vehicleCategory,
          // Keep the default image - don't use license photo as driver profile
          // The license photo is just for verification, not for driver profile
        }));

        // Don't set license photo as image preview
        // User should upload their own driver photo

        setLicenseFound(true);
        message.success(
          'License details fetched successfully! Please upload a driver photo and fill remaining details.'
        );
      } else {
        setSearchError(
          response.message ||
            'License not found. Please enter details manually.'
        );
      }
    } catch (error: any) {
      console.error('License search error:', error);
      setSearchError(
        'Failed to fetch license details. Please try again or enter manually.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize form with driver data or reset
  useEffect(() => {
    if (driver && mode === 'edit') {
      setFormData({
        name: driver.name || '',
        experience: driver.experience || '',
        status: driver.status || 'Available',
        licenseNumber: driver.licenseNumber || '',
        phoneNumber: driver.phoneNumber || (driver as any).phone || '',
        rating: driver.rating || 4.0,
        totalTrips: driver.totalTrips || 0,
        currentVehicle: driver.currentVehicle || (driver as any).vehicle || '',
        location: driver.location || '',
        image: driver.image || '/staring-man.jpg',
        joinedDate: driver.joinedDate || new Date().toISOString().split('T')[0],
        email: driver.email || '',
        address: driver.description || driver.address || '',
        emergencyContact: driver.emergencyContact || '',
        vehicleCategory: driver.vehicleType || '',
        vehicleCategoryDetail: '',
      });
      setImagePreview(driver.image || null);
      setConfirmChecked(true); // Auto-check for edit mode
      // Reset search state
      setSearchLicenseNumber('');
      setSearchDob('');
      setSearchError(null);
      setLicenseFound(false);
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
      // Reset search state
      setSearchLicenseNumber('');
      setSearchDob('');
      setSearchError(null);
      setLicenseFound(false);
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

    const driverData: any = {
      id: driver?.id || `d${Date.now()}`,
      name: formData.name!,
      experience: formData.experience || '',
      status: formData.status!,
      licenseNumber: formData.licenseNumber!,
      phoneNumber: formData.phoneNumber!,
      phone: formData.phoneNumber!,
      rating: formData.rating || 4.0,
      totalTrips: formData.totalTrips || 0,
      currentVehicle: formData.currentVehicle,
      vehicleType: formData.vehicleCategory || 'Truck',
      location: formData.location || '',
      image: formData.image || '/profile-pic.png',
      imageFile: formData.imageFile, // Include actual File object for upload
      joinedDate: formData.joinedDate!,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      description: formData.address || 'No description',
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
      console.log('[DriverForm] Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // Store the actual File object for API upload
      setFormData((prev) => ({ ...prev, imageFile: file }));

      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
          {/* Quick License Search - Only show in Add mode */}
          {mode === 'add' && (
            <div className="rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">
                  Quick License Search
                </h3>
              </div>
              <p className="mb-3 text-sm text-blue-700">
                Enter license number and DOB to auto-fill driver info
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={searchLicenseNumber}
                    onChange={(e) => {
                      setSearchLicenseNumber(e.target.value.toUpperCase());
                      setSearchError(null);
                    }}
                    placeholder="License Number (e.g., DL1420110012345)"
                    className="flex-1 border-blue-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      value={searchDob}
                      onChange={(e) => {
                        // Allow only digits and slashes, auto-format
                        let value = e.target.value.replace(/[^\d/]/g, '');

                        // Auto-add slashes
                        if (value.length === 2 && !value.includes('/')) {
                          value = value + '/';
                        } else if (
                          value.length === 5 &&
                          value.split('/').length === 2
                        ) {
                          value = value + '/';
                        }

                        // Limit to 10 characters (dd/mm/yyyy)
                        if (value.length <= 10) {
                          setSearchDob(value);
                          setSearchError(null);
                        }
                      }}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      className="border-blue-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleLicenseSearch}
                    disabled={
                      isSearching || !searchLicenseNumber.trim() || !searchDob
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {searchError && (
                <p className="mt-2 text-sm text-red-600">{searchError}</p>
              )}
              {licenseFound && (
                <p className="mt-2 flex items-center gap-1 text-sm text-blue-600">
                  <Check className="h-4 w-4" />
                  License details auto-filled! Please verify and complete the
                  form.
                </p>
              )}
            </div>
          )}

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
                {VEHICLE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'Others' ? 'Others (specify)' : category}
                  </SelectItem>
                ))}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Driver preview"
                    className="h-full w-full object-cover"
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
