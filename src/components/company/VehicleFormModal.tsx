'use client';

import { useState, useEffect } from 'react';
import {
  Vehicle,
  VEHICLE_CATEGORIES,
  FUEL_TYPES,
  OWNERSHIP_TYPES,
} from '@/types/fleet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Check, Search, Loader2 } from 'lucide-react';
import { Upload, Select, message } from 'antd';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { wheelboardApi } from '@/lib/wheelboardApi';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  vehicle?: Vehicle | null;
  mode: 'add' | 'edit';
}

type FormData = {
  name?: string;
  model?: string;
  registrationNumber?: string;
  year?: number;
  type?: string;
  ownership?: string;
  fuelType?: string;
  capacity?: string;
  mileage?: string;
  location?: string;
  image?: string;
  description?: string;
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
    ownership: 'Owned',
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Vehicle lookup state
  const [searchVehicleNumber, setSearchVehicleNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [vehicleFound, setVehicleFound] = useState(false);

  // Function to search vehicle details by registration number
  const handleVehicleSearch = async () => {
    if (!searchVehicleNumber.trim()) {
      setSearchError('Please enter a vehicle number');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setVehicleFound(false);

    try {
      const response = await wheelboardApi.vehicle.getVehicleDetails(
        searchVehicleNumber.trim().toUpperCase()
      );

      console.log('Vehicle details response:', response);

      if (response.success && response.data) {
        // API now returns extracted vehicle data directly
        const vehicleData = response.data as any;

        console.log('Vehicle data:', vehicleData);

        // Extract manufacturing year from vehicleManufacturingMonthYear (format: "01/2011")
        let manufacturingYear = new Date().getFullYear();
        if (vehicleData.vehicleManufacturingMonthYear) {
          const parts = vehicleData.vehicleManufacturingMonthYear.split('/');
          if (parts.length === 2) {
            manufacturingYear = parseInt(parts[1]) || manufacturingYear;
          }
        }

        // Map fuel type from API type field (DIESEL, PETROL, etc.)
        const fuelTypeMap: Record<string, string> = {
          DIESEL: 'Diesel',
          PETROL: 'Petrol',
          CNG: 'CNG',
          ELECTRIC: 'Electric',
          HYBRID: 'Hybrid',
          LPG: 'LPG',
        };
        const mappedFuelType =
          fuelTypeMap[vehicleData.type?.toUpperCase()] ||
          vehicleData.type ||
          'Diesel';

        // Auto-fill the form with fetched data matching the API response
        setFormData((prev) => ({
          ...prev,
          // Vehicle Number / Registration Number (e.g., "UP16AF0785")
          registrationNumber:
            vehicleData.vehicleNumber ||
            vehicleData.regNo ||
            searchVehicleNumber.toUpperCase(),
          // Vehicle Model (e.g., "ENDEAVOUR")
          model: vehicleData.model || '',
          // Manufacturing Year from vehicleManufacturingMonthYear (e.g., 2011)
          year: manufacturingYear,
          // Vehicle Category (e.g., "LMV")
          vehicleCategory: vehicleData.vehicleCategory || '',
          // Fuel Type (e.g., "DIESEL" -> "Diesel")
          fuelType: mappedFuelType,
          // Owner Name (e.g., "MANMOHAN SINGH")
          name: vehicleData.owner || '',
          // Description - use permanent address
          location:
            vehicleData.permanentAddress || vehicleData.presentAddress || '',
        }));

        setVehicleFound(true);
        message.success('Vehicle details fetched successfully!');
      } else {
        setSearchError(
          response.message ||
            'Vehicle not found. Please enter details manually.'
        );
      }
    } catch (error: any) {
      console.error('Vehicle search error:', error);
      setSearchError(
        'Failed to fetch vehicle details. Please try again or enter manually.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize form with vehicle data or reset
  useEffect(() => {
    if (vehicle && mode === 'edit') {
      setFormData({
        name: vehicle.name || vehicle.model || '',
        model: vehicle.model || vehicle.name || '',
        registrationNumber: vehicle.registrationNumber || '',
        year: vehicle.year || new Date().getFullYear(),
        ownership: vehicle.ownership || 'Owned',
        location: vehicle.location || '',
        image: vehicle.image || '/truck-01.jpg',
        fuelType: vehicle.fuelType || 'Diesel',
        capacity: vehicle.capacity || '',
        mileage: vehicle.mileage || '',
        vehicleCategory: vehicle.type || '',
        vehicleCategoryDetail: '',
        description: vehicle.description || '',
      });
      setFileList([]);
      setConfirmChecked(false);
      // Reset search state
      setSearchVehicleNumber('');
      setSearchError(null);
      setVehicleFound(false);
    } else if (mode === 'add' || !isOpen) {
      setFormData({
        name: '',
        year: new Date().getFullYear(),
        ownership: 'Owned',
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
      setFileList([]);
      setConfirmChecked(false);
      // Reset search state
      setSearchVehicleNumber('');
      setSearchError(null);
      setVehicleFound(false);
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
    if (fileList.length === 0 && mode === 'add') {
      newErrors.images = 'At least one vehicle image is required';
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

    // Extract File objects from fileList for API submission
    const imageFiles = fileList
      .map((file) => file.originFileObj as File)
      .filter((file) => file !== undefined);

    const vehicleData: any = {
      id: vehicle?.id || `v${Date.now()}`,
      name: formData.model!,
      model: formData.model!,
      registrationNumber: formData.registrationNumber!,
      year: formData.year!,
      status: 'Available',
      ownership: formData.ownership || 'Owned',
      type:
        formData.vehicleCategory === 'Others'
          ? formData.vehicleCategoryDetail
          : formData.vehicleCategory,
      description: formData.description || formData.location!,
      images: imageFiles, // Array of File objects for API
      location: formData.location!,
      image: formData.image || '/truck-01.jpg',
      fuelType: formData.fuelType,
      capacity: formData.capacity,
      mileage: formData.mileage,
      imageUrls: [],
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

  // Ant Design Upload handler
  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    if (newFileList.length === 0) {
      clearError('images');
    }
  };

  // Before upload - validate and prevent auto upload
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
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
          {/* Quick Vehicle Search - Only show in Add mode */}
          {mode === 'add' && (
            <div className="rounded-xl border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">
                  Quick Vehicle Search
                </h3>
              </div>
              <p className="mb-3 text-sm text-green-700">
                Enter vehicle number to auto-fill vehicle info
              </p>
              <div className="flex gap-2">
                <Input
                  value={searchVehicleNumber}
                  onChange={(e) => {
                    setSearchVehicleNumber(e.target.value.toUpperCase());
                    setSearchError(null);
                  }}
                  placeholder="Vehicle Number (e.g., UP16AF0785)"
                  className="flex-1 border-green-200 bg-white focus:border-green-500 focus:ring-green-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleVehicleSearch();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleVehicleSearch}
                  disabled={isSearching || !searchVehicleNumber.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Vehicle Details
                    </>
                  )}
                </Button>
              </div>
              {searchError && (
                <p className="mt-2 text-sm text-red-600">{searchError}</p>
              )}
              {vehicleFound && (
                <p className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  Vehicle details auto-filled! Please verify and complete the
                  form.
                </p>
              )}
            </div>
          )}

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
              value={formData.ownership || 'Owned'}
              onValueChange={(value) => handleSelectChange('ownership', value)}
              className="flex gap-4"
            >
              {OWNERSHIP_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type.toLowerCase()} />
                  <Label
                    htmlFor={type.toLowerCase()}
                    className="cursor-pointer font-normal"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Vehicle Category */}
          <div className="space-y-2">
            <Label htmlFor="vehicleCategory" className="text-sm font-medium">
              Vehicle Category *
            </Label>
            <Select
              value={formData.vehicleCategory || undefined}
              onChange={(value) => {
                handleSelectChange('vehicleCategory', value);
                if (value !== 'Others') {
                  setFormData((prev) => ({
                    ...prev,
                    vehicleCategoryDetail: '',
                  }));
                }
              }}
              placeholder="Select category"
              className="w-full"
              status={errors.vehicleCategory ? 'error' : ''}
              options={VEHICLE_CATEGORIES.map((category) => ({
                label: category === 'Others' ? 'Others (specify)' : category,
                value: category,
              }))}
            />
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
              onChange={(value) => handleSelectChange('fuelType', value)}
              placeholder="Select fuel type"
              className="w-full"
              options={FUEL_TYPES.map((fuel) => ({
                label: fuel,
                value: fuel,
              }))}
            />
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
              Vehicle Images * (Max 5MB each)
            </Label>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple
              maxCount={5}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}
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
