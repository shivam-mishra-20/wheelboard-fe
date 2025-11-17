// Complete WheelBoard API Integration
// Base URL: https://wheelboardapi.addonshareware.com

import axios, { type AxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://wheelboardapi.addonshareware.com';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Generic API request handler
async function apiRequest<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    console.log(
      `[API Request] ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`
    );

    const response = await axiosInstance.request<{
      message?: string;
      error?: string;
      data?: T;
      [key: string]: unknown;
    }>({
      url: endpoint,
      ...options,
    });

    console.log(`[API Response] ${response.status}:`, response.data);

    return {
      success: true,
      message: response.data?.message || 'Success',
      data: response.data?.data || (response.data as T),
    };
  } catch (error: unknown) {
    console.error('[API Error]', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error;
      const responseData = axiosError.response?.data as
        | {
            message?: string;
            error?: string;
          }
        | undefined;

      return {
        success: false,
        message:
          responseData?.message ||
          responseData?.error ||
          axiosError.message ||
          'Request failed',
        error: responseData?.error || axiosError.message,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: errorMessage,
    };
  }
}

// Helper to build FormData
const buildFormData = (
  data: Record<
    string,
    string | number | boolean | File | Blob | File[] | undefined | null
  >
): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      // Handle array of files
      value.forEach((item: File | Blob | string | number) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(key, item);
        }
      });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// ============================================
// USER API
// ============================================

export const userApi = {
  // POST /api/User/login
  login: async (credentials: { mobileNo: string; password: string }) => {
    return apiRequest('/api/User/login', {
      method: 'POST',
      data: credentials,
    });
  },

  // POST /api/User/professional_signup
  professionalSignup: async (data: {
    Email: string;
    Password: string;
    Name: string;
    FatherName: string;
    DateOfBirth: string;
    MobileNo: string;
    State: string;
    City: string;
    ProfessionalType: string;
    ProfileImage?: File;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/User/professional_signup', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/User/update-professional-profile
  updateProfessionalProfile: async (data: {
    UserId: string;
    FullName: string;
    FathersName: string;
    YearsOfExperience: number;
    BirthDate: string;
    State: string;
    City: string;
    DriverImage?: File;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/User/update-professional-profile', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/User/company_signup
  companySignup: async (data: {
    companyName: string;
    mobileNo: string;
    email: string;
    password: string;
    businessCategory: string;
  }) => {
    return apiRequest('/api/User/company_signup', {
      method: 'POST',
      data,
    });
  },

  // POST /api/User/complete-transport
  completeTransport: async (data: {
    UserId: string;
    FirstName: string;
    LastName: string;
    Address: string;
    FleetSize: number;
    GSTNumber: string;
    CompanyLogo?: File;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/User/complete-transport', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/User/complete-service-provider
  completeServiceProvider: async (data: {
    UserId: string;
    BusinessName: string;
    GSTNumber: string;
    BusinessType: string;
    ServicesOffered: string;
    BusinessAddress: string;
    City: string;
    PhoneNumber: string;
    Email: string;
    WhatsAppNumber: string;
    BusinessLogo?: File;
    Description: string;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/User/complete-service-provider', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/User/save-referral
  saveReferral: async (data: {
    referralId: string;
    createdBy: string;
    referredTo: string;
    status: string;
  }) => {
    return apiRequest('/api/User/save-referral', {
      method: 'POST',
      data,
    });
  },

  // POST /api/User/UploadSliderImage
  uploadSliderImage: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest(`/api/User/UploadSliderImage?userId=${userId}`, {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/User/user-profile/{userId}
  getUserProfile: async (userId: string) => {
    return apiRequest(`/api/User/user-profile/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/User/GetReferralsByUserId/{userId}
  getReferralsByUserId: async (userId: string) => {
    return apiRequest(`/api/User/GetReferralsByUserId/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/User/GetSliders
  getSliders: async () => {
    return apiRequest('/api/User/GetSliders', {
      method: 'GET',
    });
  },

  // DELETE /api/User/DeleteSlider/{id}
  deleteSlider: async (id: number) => {
    return apiRequest(`/api/User/DeleteSlider/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// JOB API
// ============================================

export const jobApi = {
  // POST /api/Job/add-job
  addJob: async (data: {
    UserId: string;
    Role: string; // Job title/position
    City: string; // Location
    Description: string; // Job description
    JobType: string; // Full-time, Part-time, Contract
    JobDuration: string; // e.g., "6 months", "Permanent"
    Images: File[]; // Job images
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Job/add-job', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // PUT /api/Job/update-job
  updateJob: async (data: {
    JobId: string;
    UserId: string;
    Role: string;
    JobDuration: string;
    Openings: number;
    Salary: string;
    JobDescription: string;
    Experience: string;
    Qualifications: string;
    Location: string;
    CompanyName: string;
    CompanyLogo?: File;
    JobCategory: string;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Job/update-job', {
      method: 'PUT',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Job/job-list/{userId}
  getJobListByUser: async (userId: string) => {
    return apiRequest(`/api/Job/job-list/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Job/open-job-list
  getOpenJobList: async () => {
    return apiRequest('/api/Job/open-job-list', {
      method: 'GET',
    });
  },

  // GET /api/Job/{jobId}/user/{userId}
  getJobDetails: async (jobId: string, userId: string) => {
    return apiRequest(`/api/Job/${jobId}/user/${userId}`, {
      method: 'GET',
    });
  },

  // POST /api/Job/apply-job
  applyJob: async (data: { jobId: string; userId: string }) => {
    return apiRequest('/api/Job/apply-job', {
      method: 'POST',
      data,
    });
  },

  // GET /api/Job/get-applications/{jobId}
  getApplications: async (jobId: string) => {
    return apiRequest(`/api/Job/get-applications/${jobId}`, {
      method: 'GET',
    });
  },

  // GET /api/Job/applied-jobs/{userId}
  getAppliedJobs: async (userId: string) => {
    return apiRequest(`/api/Job/applied-jobs/${userId}`, {
      method: 'GET',
    });
  },

  // PUT /api/Job/update-job-status
  updateJobStatus: async (data: { ApplicationId: string; Status: string }) => {
    return apiRequest('/api/Job/update-job-status', {
      method: 'PUT',
      data,
    });
  },
};

// ============================================
// SERVICE API
// ============================================

export const serviceApi = {
  // POST /api/Service/add-service
  addService: async (data: {
    UserId: string;
    ServiceName: string;
    ServiceCategory: string;
    Description: string;
    PriceRange: string;
    Location: string;
    Availability: string;
    ContactNumber: string;
    Email: string;
    ServiceImage?: File;
    Documents?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Service/add-service', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // PUT /api/Service/update-service
  updateService: async (data: {
    ServiceId: string;
    UserId: string;
    ServiceName: string;
    ServiceCategory: string;
    Description: string;
    PriceRange: string;
    Location: string;
    Availability: string;
    ContactNumber: string;
    Email: string;
    ServiceImage?: File;
    Documents?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Service/update-service', {
      method: 'PUT',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Service/service-list/{userId}
  getServiceList: async (userId: string) => {
    return apiRequest(`/api/Service/service-list/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Service/{serviceId}/user/{userId}
  getServiceDetails: async (serviceId: string, userId: string) => {
    return apiRequest(`/api/Service/${serviceId}/user/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Service/assign-service/{userId}
  getAssignedServices: async (userId: string) => {
    return apiRequest(`/api/Service/assign-service/${userId}`, {
      method: 'GET',
    });
  },

  // POST /api/Service/assign-service
  assignService: async (data: {
    ServiceId: string;
    UserId: string;
    AssignedDate: string;
    Notes: string;
  }) => {
    return apiRequest('/api/Service/assign-service', {
      method: 'POST',
      data,
    });
  },

  // DELETE /api/Service/{assignmentId}
  deleteServiceAssignment: async (assignmentId: string) => {
    return apiRequest(`/api/Service/${assignmentId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// TRANSPORT API
// ============================================

export const transportApi = {
  // POST /api/Transport/add-vehicle
  addVehicle: async (data: {
    UserId: string;
    VehicleModel: string;
    VehicleNumber: string;
    ManufacturingYear: number;
    OwnershipType: string;
    VehicleType: string;
    Description: string;
    IsDeclarationAccepted: boolean;
    Images?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Transport/add-vehicle', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/Transport/update-vehicle (API uses POST, not PUT)
  updateVehicle: async (data: {
    VehicleId: string;
    UserId: string;
    VehicleModel: string;
    VehicleNumber: string;
    ManufacturingYear: number;
    OwnershipType: string;
    VehicleType: string;
    Description: string;
    IsDeclarationAccepted: boolean;
    Images?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Transport/update-vehicle', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Transport/vehicle/{userId}
  getVehiclesByUser: async (userId: string) => {
    return apiRequest(`/api/Transport/vehicle/${userId}`, {
      method: 'GET',
    });
  },

  // DELETE /api/Transport/{vehicleId}
  deleteVehicle: async (vehicleId: string, modifiedBy: string) => {
    return apiRequest(`/api/Transport/${vehicleId}?modifiedBy=${modifiedBy}`, {
      method: 'DELETE',
    });
  },

  // POST /api/Transport/add-driver
  addDriver: async (data: {
    UserId: string;
    FullName: string;
    ContactNumber: string;
    VehicleType: string;
    VehicleNumber: string;
    Description: string;
    IsDeclarationAccepted: boolean;
    Image?: File;
    PartnerId?: number;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Transport/add-driver', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/Transport/update-driver (API uses POST, not PUT)
  updateDriver: async (data: {
    DriverId: string;
    FullName: string;
    ContactNumber: string;
    VehicleType: string;
    VehicleNumber: string;
    Description: string;
    IsDeclarationAccepted: boolean;
    Image?: File;
    ModifiedUserId: string;
    PartnerId?: number;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Transport/update-driver', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Transport/drivers/{userId}
  getDriversByUser: async (userId: string) => {
    return apiRequest(`/api/Transport/drivers/${userId}`, {
      method: 'GET',
    });
  },

  // DELETE /api/Transport/driver/{driverId}
  deleteDriver: async (driverId: string, modifiedBy: string) => {
    return apiRequest(
      `/api/Transport/driver/${driverId}?modifiedBy=${modifiedBy}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ============================================
// POST API
// ============================================

export const postApi = {
  // POST /api/Post/add
  addPost: async (data: {
    UserId: string;
    Content: string;
    Category: string;
    Images?: File[];
    CreatedBy?: string;
    PartnerId?: number;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Post/add', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Post/user/{userId} - Get posts by user
  getPostsByUser: async (userId: string) => {
    return apiRequest(`/api/Post/user/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Post/get-all-post - Get all posts
  getAllPosts: async () => {
    return apiRequest('/api/Post/get-all-post', {
      method: 'GET',
    });
  },

  // PUT /api/Post/approve/{postId}
  approvePost: async (postId: string) => {
    return apiRequest(`/api/Post/approve/${postId}`, {
      method: 'PUT',
    });
  },

  // PUT /api/Post/reject/{postId}
  rejectPost: async (postId: string) => {
    return apiRequest(`/api/Post/reject/${postId}`, {
      method: 'PUT',
    });
  },

  // DELETE /api/Post/{postId}
  deletePost: async (postId: string) => {
    return apiRequest(`/api/Post/${postId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// MASTER DATA API
// ============================================

export const masterDataApi = {
  // GET /api/MasterData/getAllServices
  getAllServices: async () => {
    return apiRequest('/api/MasterData/getAllServices', {
      method: 'GET',
    });
  },

  // GET /api/MasterData/getAllBusinessType
  getAllBusinessTypes: async () => {
    return apiRequest('/api/MasterData/getAllBusinessType', {
      method: 'GET',
    });
  },
};

// ============================================
// TRIP API
// ============================================

export const tripApi = {
  // POST /api/Trip/trip_expense_save
  saveExpense: async (data: {
    ExpenseId?: string;
    CreatedBy: string;
    ExpensePurposeId: number;
    Amount: number;
    ExpenseDate: string;
    Description: string;
    TripId: string;
    ReceiptPath?: string;
    ReceiptFile?: File;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Trip/trip_expense_save', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Trip/trip_expense_purposes
  getExpensePurposes: async () => {
    return apiRequest('/api/Trip/trip_expense_purposes', {
      method: 'GET',
    });
  },

  // POST /api/Trip/add-trip
  addTrip: async (data: {
    TripId?: string;
    UserId: string;
    VehicleId: string;
    DriverId: string;
    PickupLocation: string;
    DeliveryLocation: string;
    PickupDate: string;
    PickupTime: string;
    SpecialInstructions?: string;
    PayRange: string;
    TripCode?: string;
    TripStatus?: string;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Trip/add-trip', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Trip/trip-list/{userId}
  getTripsByUser: async (userId: string) => {
    return apiRequest(`/api/Trip/trip-list/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Trip/get-trip-bids/{tripId}
  getTripBids: async (tripId: string) => {
    return apiRequest(`/api/Trip/get-trip-bids/${tripId}`, {
      method: 'GET',
    });
  },

  // GET /api/Trip/unassign-trip-list - Get all unassigned trips (for professionals to bid on)
  getUnassignedTrips: async () => {
    return apiRequest('/api/Trip/unassign-trip-list', {
      method: 'GET',
    });
  },

  // GET /api/Trip/unassigned-trip-details/{tripId} - Get details of an unassigned trip
  getUnassignedTripDetails: async (tripId: string) => {
    return apiRequest(`/api/Trip/unassigned-trip-details/${tripId}`, {
      method: 'GET',
    });
  },

  // GET /api/Trip/assign-trip-list/{userId} - Get assigned trips for a professional
  getAssignedTrips: async (userId: string) => {
    return apiRequest(`/api/Trip/assign-trip-list/${userId}`, {
      method: 'GET',
    });
  },

  // POST /api/Trip/submit-bid - Submit a bid for a trip
  submitBid: async (data: {
    createdBy: string;
    partnerId?: number;
    tripId: string;
    userId: string;
    bidAmount: number;
    bidDescription: string;
  }) => {
    return apiRequest('/api/Trip/submit-bid', {
      method: 'POST',
      data,
    });
  },

  // POST /api/Trip/save-calendar-events - Save calendar event
  saveCalendarEvent: async (data: {
    eventId?: string;
    createdBy: string;
    partnerId?: number;
    userId: string;
    eventName: string;
    note: string;
    startTime: string;
    endTime: string;
    category: string;
    isActive: boolean;
  }) => {
    return apiRequest('/api/Trip/save-calendar-events', {
      method: 'POST',
      data,
    });
  },

  // GET /api/Trip/get-events-by-userId/{userId} - Get calendar events for user
  getCalendarEvents: async (userId: string) => {
    return apiRequest(`/api/Trip/get-events-by-userId/${userId}`, {
      method: 'GET',
    });
  },
};

// ============================================
// VEHICLE API
// ============================================

export const vehicleApi = {
  // POST /api/VehicleApi/GetVehicleDetails
  getVehicleDetails: async (vehicleNumber: string) => {
    return apiRequest('/api/VehicleApi/GetVehicleDetails', {
      method: 'POST',
      data: { vehicleNumber },
    });
  },

  // POST /api/VehicleApi/GetLicenceDetails
  getLicenseDetails: async (licenseNumber: string, dob: string) => {
    return apiRequest('/api/VehicleApi/GetLicenceDetails', {
      method: 'POST',
      data: { number: licenseNumber, dob },
    });
  },
};

// ============================================
// COMBINED API EXPORT
// ============================================

export const wheelboardApi = {
  user: userApi,
  job: jobApi,
  service: serviceApi,
  transport: transportApi,
  post: postApi,
  masterData: masterDataApi,
  trip: tripApi,
  vehicle: vehicleApi,
};

export default wheelboardApi;
