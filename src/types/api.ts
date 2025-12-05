// API Response Types for WheelBoard Platform
// Based on OpenAPI specification

// ============================================
// JOB API TYPES
// ============================================

export interface Job {
  // API fields
  jobId: string;
  userId: string;
  role: string;
  jobDuration: string;
  openings: number;
  salary: number;
  city: string;
  jobType: string;
  description: string;
  imageUrls?: string[];
  createdAt: string;
  modifiedAt?: string;
  status: 'Active' | 'Inactive' | 'Filled';

  // UI compatibility fields (mapped from API)
  id: string; // mapped from jobId
  title: string; // mapped from role
  location: string; // mapped from city
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance'; // mapped from jobType
  department: string; // default value
  requirements: string[]; // parsed from description
  benefits: string[]; // default empty
  image: string; // from imageUrls[0] or default
  updatedAt?: string; // mapped from modifiedAt
  urgent?: boolean; // derived from status
  applications: JobApplication[]; // populated separately
  views: number; // default 0
}

export interface JobApplication {
  applicationId: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedAt: string;
}

export interface JobFormData {
  role: string;
  jobDuration: string;
  openings: number;
  salary: number;
  city: string;
  jobType: string;
  description: string;
  images?: File[];
}

// ============================================
// SERVICE API TYPES
// ============================================

export interface Service {
  serviceId: string;
  serviceName: string;
  description: string;
  category: string;
  price?: number;
  duration?: string;
  availability: string;
  providerId: string;
  providerName: string;
  rating?: number;
  imageUrls?: string[];
}

export interface ServiceAssignment {
  assignmentId: string;
  serviceId: string;
  serviceName: string;
  assignedToUserId: string;
  assignedToName: string;
  vehicleNumber: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

// ============================================
// TRIP API TYPES
// ============================================

export interface Trip {
  tripId: string;
  userId: string;
  vehicleId: string;
  driverId: string;
  vehicleName?: string;
  driverName?: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions?: string;
  payRange: string;
  tripCode?: string;
  tripStatus: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface TripExpense {
  expenseId: string;
  tripId: string;
  createdBy: string;
  expensePurposeId: number;
  purposeName?: string;
  amount: number;
  expenseDate: string;
  description: string;
  receiptPath?: string;
  createdAt: string;
}

export interface ExpensePurpose {
  purposeId: number;
  purposeName: string;
  category: string;
}

export interface TripBid {
  bidId: string;
  tripId: string;
  bidderId: string;
  bidderName: string;
  bidderPhone: string;
  bidAmount: number;
  estimatedDuration: string;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface CreateRazorpayOrderModel {
  totalAmount: number;
}

export interface TripPaymentModel {
  tripId: string;
  bidId: string;
  userId: string;
  amount: number;
  platformFee: number;
  totalAmount: number;
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface TripCancelModel {
  tripId: string;
  userId: string;
  reason?: string;
}

export interface TripConfirmation {
  tripId: string;
  tripCode: string;
  status: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
  driverName: string;
  vehicleName: string;
  payRange: string;
  confirmedAt: string;
}

// ============================================
// POST API TYPES
// ============================================

export interface Post {
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  category: string;
  imageUrls?: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  modifiedAt?: string;
  likes?: number;
  comments?: number;
}

export interface PostFormData {
  content: string;
  category: string;
  images?: File[];
}

// ============================================
// MASTER DATA TYPES
// ============================================

export interface MasterService {
  serviceId: string;
  serviceName: string;
  category: string;
  description?: string;
  isActive: boolean;
}

export interface BusinessType {
  businessTypeId: string;
  typeName: string;
  description?: string;
  category: string;
  isActive: boolean;
}

// ============================================
// USER PROFILE TYPES
// ============================================

export interface CompletedProfile {
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  fleetSize?: number;
  gstNumber?: string;
  companyLogoUrl?: string;
  isProfileComplete: boolean;
}

export interface UserProfile {
  userId: string;
  companyName: string;
  mobileNo: string;
  email?: string;
  businessCategory: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  fleetSize?: number;
  gstNumber?: string;
  companyLogoUrl?: string;
  isProfileComplete: boolean;
  createdAt: string;
  modifiedAt?: string;
}

export interface Referral {
  referralId: string;
  createdBy: string;
  partnerId?: number;
  userId: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  role: string;
  location: string;
  notifyOnAcceptance: boolean;
  referralStatus: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

// ============================================
// VEHICLE VERIFICATION TYPES
// ============================================

export interface VehicleDetails {
  vehicleNumber: string;
  ownerName: string;
  vehicleClass: string;
  fuelType: string;
  model: string;
  manufacturingDate: string;
  registrationDate: string;
  fitnessUpto: string;
  insuranceUpto: string;
  puccUpto: string;
  isValid: boolean;
}

export interface LicenseDetails {
  licenseNumber: string;
  name: string;
  fatherName: string;
  address: string;
  dateOfBirth: string;
  issueDate: string;
  validTill: string;
  vehicleClasses: string[];
  isValid: boolean;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface TripFormData {
  vehicleId: string;
  driverId: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions?: string;
  payRange: string;
}

export interface ExpenseFormData {
  expensePurposeId: number;
  amount: number;
  expenseDate: string;
  description: string;
  receiptFile?: File;
}

// ============================================
// DASHBOARD AGGREGATE TYPES
// ============================================

export interface DashboardStats {
  totalVehicles: number;
  totalDrivers: number;
  activeTrips: number;
  completedTrips: number;
  totalJobs: number;
  activeJobs: number;
  totalServices: number;
  assignedServices: number;
  totalPosts: number;
  approvedPosts: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  fleetUtilization: number;
  driverPerformance: number;
}

export interface RecentActivity {
  id: string;
  type: 'trip' | 'job' | 'service' | 'post' | 'expense';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

// ============================================
// API RESPONSE WRAPPERS
// ============================================

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface ApiSingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: Record<string, string[]>;
}
