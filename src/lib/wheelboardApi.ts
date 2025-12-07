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
  // Only access localStorage in browser environment
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('[Axios Interceptor] Request:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    hasToken: !!token,
    headers: config.headers,
  });
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

    // Check if response.data is an array (direct data) or has a data property
    const isDirectArray = Array.isArray(response.data);
    const hasDataProperty = response.data && 'data' in response.data;

    console.log('[API Response Analysis]', {
      isDirectArray,
      hasDataProperty,
      responseType: typeof response.data,
      responseKeys: response.data ? Object.keys(response.data) : [],
    });

    return {
      success: true,
      message: response.data?.message || 'Success',
      data: isDirectArray
        ? (response.data as T)
        : response.data?.data || (response.data as T),
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
          formData.append(
            key,
            item,
            item instanceof File ? item.name : undefined
          );
        }
      });
    } else if (value instanceof File) {
      // Explicitly pass the filename for File objects
      console.log(
        `[buildFormData] Appending File '${key}': ${value.name} (${value.type}, ${value.size} bytes)`
      );
      formData.append(key, value, value.name);
    } else if (value instanceof Blob) {
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
  }): Promise<ApiResponse<{ message: string; imageUrl: string }>> => {
    const formData = buildFormData(data);
    return apiRequest<{ message: string; imageUrl: string }>(
      '/api/User/update-professional-profile',
      {
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
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
    Email: string;
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
    referralId?: string;
    createdBy: string;
    partnerId?: number;
    userId: string;
    fullName: string;
    mobileNumber: string;
    email?: string;
    role: string;
    location?: string;
    notifyOnAcceptance: boolean;
    referralStatus?: string;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiRequest<{ success: boolean; message: string }>(
      '/api/User/save-referral',
      {
        method: 'POST',
        data,
      }
    );
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
    console.log('[getUserProfile] Called with userId:', userId);
    console.log(
      '[getUserProfile] Full URL will be:',
      `/api/User/user-profile/${userId}`
    );
    return apiRequest(`/api/User/user-profile/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/User/GetReferralsByUserId/{userId}
  getReferralsByUserId: async (
    userId: string
  ): Promise<
    ApiResponse<
      Array<{
        referralId: string;
        createdBy: string;
        partnerId: number | null;
        userId: string;
        fullName: string;
        mobileNumber: string;
        email: string;
        role: string;
        location: string;
        notifyOnAcceptance: boolean;
        referralStatus: string;
      }>
    >
  > => {
    return apiRequest<
      Array<{
        referralId: string;
        createdBy: string;
        partnerId: number | null;
        userId: string;
        fullName: string;
        mobileNumber: string;
        email: string;
        role: string;
        location: string;
        notifyOnAcceptance: boolean;
        referralStatus: string;
      }>
    >(`/api/User/GetReferralsByUserId/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/User/GetSliders
  getSliders: async () => {
    return apiRequest('/api/User/GetSliders', {
      method: 'GET',
    });
  },

  // GET /api/User/DeleteSlider/{id}
  deleteSlider: async (id: number) => {
    return apiRequest(`/api/User/DeleteSlider/${id}`, {
      method: 'DELETE',
    });
  },

  // POST /api/User/update-transport-profile
  updateTransportProfile: async (data: {
    UserId: string;
    CompanyName: string;
    FullName: string;
    Email: string;
    Location: string;
    FleetSize: number;
    GSTNumber: string;
    CompanyLogo?: File;
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/User/update-transport-profile', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
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
    ServiceTitle: string;
    ContactNumber: string;
    WhatsappNumber: string;
    Description: string;
    IsFlatPrice: boolean;
    Price: number;
    City: string;
    FullAddress: string;
    IsVisible: boolean;
    BusinessFrom: string; // date-span format
    BusinessTo: string; // date-span format
    DaysOpen: string;
    CreatedBy: string;
    Images?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Service/add-service', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/Service/update-service
  updateService: async (data: {
    ServiceId: string;
    UserId: string;
    ServiceTitle: string;
    ContactNumber: string;
    WhatsappNumber: string;
    Description: string;
    IsFlatPrice: boolean;
    Price: number;
    City: string;
    FullAddress: string;
    IsVisible: boolean;
    BusinessFrom: string;
    BusinessTo: string;
    DaysOpen: string;
    ModifiedBy: string;
    NewImages?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Service/update-service', {
      method: 'POST',
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

  // GET /api/Service/service-list - Get all services (no userId)
  getAllServiceList: async () => {
    return apiRequest('/api/Service/service-list', {
      method: 'GET',
    });
  },

  // GET /api/Service/details/{serviceId}
  getServiceDetails: async (serviceId: string) => {
    return apiRequest(`/api/Service/details/${serviceId}`, {
      method: 'GET',
    });
  },

  // POST /api/Service/assign-service
  assignService: async (data: {
    serviceId: string;
    assignedToUserId: string;
    vehicleNumber?: string;
    scheduledDate: string;
    scheduledTime: string;
    description?: string;
    status?: string;
  }) => {
    return apiRequest('/api/Service/assign-service', {
      method: 'POST',
      data,
    });
  },

  // GET /api/Service/assign-service/{userId}
  getAssignedServices: async (userId: string) => {
    return apiRequest(`/api/Service/assign-service/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Service/service-assign-list?serviceId={serviceId} - Get bookings/assignments for a specific service
  getServiceAssignments: async (serviceId: string) => {
    return apiRequest(
      `/api/Service/service-assign-list?serviceId=${serviceId}`,
      {
        method: 'GET',
      }
    );
  },

  // POST /api/Service/complete-service?assignmentId={assignmentId} - Mark service as completed
  completeService: async (assignmentId: string) => {
    return apiRequest(
      `/api/Service/complete-service?assignmentId=${assignmentId}`,
      {
        method: 'POST',
      }
    );
  },

  // POST /api/Service/update-service-status?assignmentId={assignmentId}&status={status} - Update booking status
  updateServiceStatus: async (assignmentId: string, status: string) => {
    return apiRequest(
      `/api/Service/update-service-status?assignmentId=${assignmentId}&status=${encodeURIComponent(status)}`,
      {
        method: 'POST',
      }
    );
  },

  // POST /api/Service/cancel-service?assignmentId={assignmentId} - Cancel a service booking
  cancelService: async (assignmentId: string) => {
    return apiRequest(
      `/api/Service/cancel-service?assignmentId=${assignmentId}`,
      {
        method: 'POST',
      }
    );
  },

  // POST /api/Service/{assignmentId}/delete
  deleteServiceAssignment: async (assignmentId: string) => {
    return apiRequest(`/api/Service/${assignmentId}/delete`, {
      method: 'POST',
    });
  },

  // POST /api/Service/{serviceId}/user/{userId}/delete
  deleteService: async (serviceId: string, userId: string) => {
    return apiRequest(`/api/Service/${serviceId}/user/${userId}/delete`, {
      method: 'POST',
    });
  },

  // POST /api/Service/update-viewcount
  updateViewCount: async (data: { serviceId: string; userId: string }) => {
    return apiRequest('/api/Service/update-viewcount', {
      method: 'POST',
      data,
    });
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  // GET /api/Dashboard/GetDashboard?userId={userId}
  getDashboard: async (userId: string) => {
    return apiRequest(`/api/Dashboard/GetDashboard?userId=${userId}`, {
      method: 'GET',
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
    Role: string;
    JobDuration: string;
    Openings: number;
    Salary: number;
    City: string;
    JobType: string;
    Description: string;
    Images?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Job/add-job', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /api/Job/update-job (API uses POST, not PUT)
  updateJob: async (data: {
    JobId: string;
    Role: string;
    JobDuration: string;
    Openings: number;
    Salary: number;
    City: string;
    JobType: string;
    Description: string;
    UserId: string;
    NewImages?: File[];
  }) => {
    const formData = buildFormData(data);
    return apiRequest('/api/Job/update-job', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /api/Job/job-list/{userId}
  getJobList: async (userId: string) => {
    return apiRequest(`/api/Job/job-list/${userId}`, {
      method: 'GET',
    });
  },

  // Alias for backward compatibility
  getJobListByUser: async (userId: string) => {
    return apiRequest(`/api/Job/job-list/${userId}`, {
      method: 'GET',
    });
  },

  // POST /api/Job/{jobId}/user/{userId}/delete
  deleteJob: async (jobId: string, userId: string) => {
    return apiRequest(`/api/Job/${jobId}/user/${userId}/delete`, {
      method: 'POST',
    });
  },

  // GET /api/Job/get-applications/{jobId}
  getJobApplications: async (jobId: string) => {
    return apiRequest(`/api/Job/get-applications/${jobId}`, {
      method: 'GET',
    });
  },

  // POST /api/Job/update-job-status
  updateJobStatus: async (data: {
    applicationId: string;
    status: string;
    modifiedUserId: string;
  }) => {
    return apiRequest('/api/Job/update-job-status', {
      method: 'POST',
      data,
    });
  },

  // GET /api/Job/open-job-list?userId={userId} - Get open jobs for professionals
  getOpenJobList: async (userId?: string) => {
    const url = userId
      ? `/api/Job/open-job-list?userId=${userId}`
      : '/api/Job/open-job-list';
    return apiRequest(url, {
      method: 'GET',
    });
  },

  // POST /api/Job/job-like-toggle - Toggle like on a job
  toggleJobLike: async (jobId: string, userId: string) => {
    return apiRequest(
      `/api/Job/job-like-toggle?jobId=${jobId}&userId=${userId}`,
      {
        method: 'POST',
      }
    );
  },

  // POST /api/Job/apply-job - Apply for a job
  applyJob: async (data: { jobId: string; userId: string }) => {
    return apiRequest('/api/Job/apply-job', {
      method: 'POST',
      data,
    });
  },

  // GET /api/Job/applied-jobs/{userId} - Get jobs applied by user
  getAppliedJobs: async (userId: string) => {
    return apiRequest(`/api/Job/applied-jobs/${userId}`, {
      method: 'GET',
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

  // GET /api/Transport/vehicle-details/{vehicleId}
  getVehicleDetails: async (vehicleId: string) => {
    return apiRequest(`/api/Transport/vehicle-details/${vehicleId}`, {
      method: 'GET',
    });
  },

  // POST /api/Transport/{vehicleId}/delete
  deleteVehicle: async (vehicleId: string, modifiedBy: string) => {
    return apiRequest(`/api/Transport/${vehicleId}/delete`, {
      method: 'POST',
      data: { modifiedBy },
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

  // GET /api/Transport/drivers-details/{driverId}
  getDriverDetails: async (driverId: string) => {
    return apiRequest(`/api/Transport/drivers-details/${driverId}`, {
      method: 'GET',
    });
  },

  // POST /api/Transport/driver/{driverId}/delete (API uses POST, not DELETE)
  deleteDriver: async (driverId: string, modifiedBy: string) => {
    return apiRequest(
      `/api/Transport/driver/${driverId}/delete?modifiedBy=${modifiedBy}`,
      {
        method: 'POST',
      }
    );
  },

  // GET /api/Transport/professional-list/{userId}
  getProfessionalList: async (userId: string) => {
    return apiRequest(`/api/Transport/professional-list/${userId}`, {
      method: 'GET',
    });
  },

  // GET /api/Transport/professional-details/{driverId}
  getProfessionalDetails: async (driverId: string) => {
    return apiRequest(`/api/Transport/professional-details/${driverId}`, {
      method: 'GET',
    });
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

  // POST /api/Post/approve/{postId}
  approvePost: async (postId: string) => {
    return apiRequest(`/api/Post/approve/${postId}`, {
      method: 'POST',
    });
  },

  // POST /api/Post/reject/{postId}
  rejectPost: async (postId: string) => {
    return apiRequest(`/api/Post/reject/${postId}`, {
      method: 'POST',
    });
  },

  // POST /api/Post/{postId}/delete
  deletePost: async (postId: string) => {
    return apiRequest(`/api/Post/${postId}/delete`, {
      method: 'POST',
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
    ReceiptPath: string;
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

  // GET /api/Trip/assign-trip/{tripId}
  assignTrip: async (tripId: string) => {
    return apiRequest(`/api/Trip/assign-trip/${tripId}`, {
      method: 'GET',
    });
  },

  // POST /api/Trip/create-order - Create Razorpay payment order
  createPaymentOrder: async (data: { totalAmount: number }) => {
    return apiRequest('/api/Trip/create-order', {
      method: 'POST',
      data,
    });
  },

  // POST /api/Trip/verify-payment - Verify Razorpay payment
  verifyPayment: async (data: {
    tripId: string;
    bidId: string;
    userId: string;
    amount: number;
    platformFee: number;
    totalAmount: number;
    orderId: string;
    paymentId: string;
    signature: string;
  }) => {
    return apiRequest('/api/Trip/verify-payment', {
      method: 'POST',
      data,
    });
  },

  // POST /api/Trip/razorpay-webhook - Razorpay webhook handler
  razorpayWebhook: async (data: any) => {
    return apiRequest('/api/Trip/razorpay-webhook', {
      method: 'POST',
      data,
    });
  },

  // GET /api/Trip/confirmation/{tripId}
  getTripConfirmation: async (tripId: string) => {
    return apiRequest(`/api/Trip/confirmation/${tripId}`, {
      method: 'GET',
    });
  },

  // POST /api/Trip/cancel
  cancelTrip: async (data: { tripId: string; userId: string }) => {
    return apiRequest('/api/Trip/cancel', {
      method: 'POST',
      data,
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

  // POST /api/Trip/start-trip - Mark trip as started
  startTrip: async (tripId: string) => {
    return apiRequest('/api/Trip/start-trip', {
      method: 'POST',
      data: { tripId },
    });
  },

  // POST /api/Trip/end-trip - Mark trip as ended
  endTrip: async (tripId: string) => {
    return apiRequest('/api/Trip/end-trip', {
      method: 'POST',
      data: { tripId },
    });
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationApi = {
  // GET /api/NotificationsApi/notifications
  getNotifications: async (userId: string) => {
    return apiRequest(`/api/NotificationsApi/notifications?userId=${userId}`, {
      method: 'GET',
    });
  },

  // POST /api/NotificationsApi/notification/read
  markNotificationAsRead: async (notificationId: string) => {
    return apiRequest(
      `/api/NotificationsApi/notification/read?notificationId=${notificationId}`,
      {
        method: 'POST',
      }
    );
  },
};

// ============================================
// VEHICLE API
// ============================================

export const vehicleApi = {
  // POST /api/VehicleApi/GetVehicleDetails
  // Response format: { code: 200, result: { data: { ...vehicleDetails } } }
  getVehicleDetails: async (vehicleNumber: string) => {
    const response = await apiRequest<any>(
      '/api/VehicleApi/GetVehicleDetails',
      {
        method: 'POST',
        data: { vehicleNumber },
      }
    );

    // Handle nested result.data structure from this specific API
    if (response.success && response.data) {
      const rawData = response.data;
      // If the response has result.data structure, extract the actual vehicle data
      if (rawData.result?.data) {
        return {
          ...response,
          data: rawData.result.data,
        };
      }
      // If the response directly has data property
      if (rawData.data) {
        return {
          ...response,
          data: rawData.data,
        };
      }
    }
    return response;
  },

  // POST /api/VehicleApi/GetLicenceDetails
  // Response format: { code: 200, result: { dlNumber, detailsOfDrivingLicence: {...}, ... } }
  getLicenseDetails: async (licenseNumber: string, dob: string) => {
    const response = await apiRequest<any>(
      '/api/VehicleApi/GetLicenceDetails',
      {
        method: 'POST',
        data: { number: licenseNumber, dob },
      }
    );

    // Handle nested result structure from this specific API
    // The actual license data is in response.data.result (not result.data)
    if (response.success && response.data) {
      const rawData = response.data;
      // If the response has result structure (license data is in result directly)
      if (rawData.result) {
        return {
          ...response,
          data: rawData.result,
        };
      }
    }
    return response;
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
  notification: notificationApi,
  dashboard: dashboardApi,
};

export default wheelboardApi;
