// Dynamic Fleet Types - Based on WheelBoard API Response

export interface ApiVehicle {
  vehicleId: string;
  userId: string;
  vehicleModel: string;
  vehicleNumber: string;
  manufacturingYear: number;
  ownershipType: string;
  vehicleType: string;
  description: string;
  status: string;
  isDeclarationAccepted: boolean;
  imageUrls: string[];
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
}

export interface ApiDriver {
  driverId: string;
  userId: string;
  fullName: string;
  driverName?: string; // Alternative field name
  contactNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  description: string;
  status: string;
  licenseNumber?: string;
  email?: string;
  driverImageUrl?: string;
  isDeclarationAccepted: boolean;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
}

// Vehicle Trip Interface
export interface VehicleTrip {
  id: string;
  route: string;
  date: string;
  distance?: string;
  duration?: string;
}

// Vehicle Metrics Interface
export interface VehicleMetrics {
  avgRun: number; // avg km per day
  tripEfficiency: number; // percentage
  monthlyUsage: number; // km per month
  costPerKM: number; // in Rs
}

// UI Interfaces - Normalized for component use
export interface Vehicle {
  id: string;
  name: string;
  model?: string;
  year?: number;
  registrationNumber: string;
  status: 'Available' | 'Assigned' | 'In Transit' | 'Maintenance';
  fuelType?: string;
  capacity?: string;
  mileage?: string;
  lastService?: string;
  location: string;
  image: string;
  // Additional fields for desktop design compatibility
  statusBadge: 'Assigned' | 'Available' | 'In Transit';
  ownership: 'Owned' | 'Attached';
  onTrip?: boolean;
  assignedDriver?: {
    id: string;
    name: string;
    avatar: string;
  };
  metrics: VehicleMetrics;
  recentTrips: VehicleTrip[];
  totalTrips: number;
  manufacturer?: string;
  driver?: string;
  description?: string;
  type?: string;
  imageUrls: string[];
  // Lease fields
  isLeased?: boolean;
  lease?: {
    startDate: string;
    endDate: string;
    monthlyRun: number;
    odometerStart: number;
    odometerBookingOnLease: number;
    pricingModel: 'flat' | 'km-based';
    flatPricePerDay?: number;
    pricePerKm?: number;
    topEfficiency?: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  phoneNumber: string;
  email?: string;
  licenseNumber?: string;
  experience?: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  currentVehicle?: string;
  vehicle?: string; // Alternative field name
  location?: string;
  image?: string;
  rating?: number;
  totalTrips?: number;
  joinedDate?: string;
  address?: string;
  emergencyContact?: string;
  vehicleType?: string;
  description?: string;
}

// Form Data Types
export interface VehicleFormData {
  name: string;
  model: string;
  registrationNumber: string;
  year: number;
  type: string;
  ownership: string;
  fuelType: string;
  capacity: string;
  mileage: string;
  location: string;
  description: string;
  images?: File[];
}

export interface DriverFormData {
  name: string;
  phoneNumber: string;
  phone: string;
  email: string;
  licenseNumber: string;
  experience: string;
  currentVehicle: string;
  vehicleType: string;
  address: string;
  description: string;
  emergencyContact: string;
  image?: File;
}

// Vehicle and Driver Category Options
export const VEHICLE_CATEGORIES = [
  'Trucks',
  'Vans',
  'Buses',
  'Trailers',
  'Construction Equipment',
  'Mining Equipment',
  'Others',
] as const;

export const FUEL_TYPES = [
  'Diesel',
  'Petrol',
  'CNG',
  'Electric',
  'Hybrid',
] as const;

export const OWNERSHIP_TYPES = ['Owned', 'Attached', 'Rented'] as const;

export const DRIVER_STATUS_OPTIONS = [
  'Available',
  'On Trip',
  'Off Duty',
] as const;

export const VEHICLE_STATUS_OPTIONS = [
  'Available',
  'Assigned',
  'In Transit',
  'Maintenance',
] as const;

export const DRIVER_EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  'More than 10 years',
] as const;
