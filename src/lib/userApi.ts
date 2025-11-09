// User API Service - Integration with Wheelboard Backend
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

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface LoginRequest {
  mobileNo: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    token?: string;
    userType: 'professional' | 'company' | 'business';
    email?: string;
    mobileNo: string;
    name?: string;
    companyName?: string;
    businessName?: string;
  };
}

export interface ProfessionalSignupRequest {
  email: string;
  password: string;
  name: string;
  fatherName: string;
  dateOfBirth: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
  mobileNo: string;
  state: string;
  city: string;
  professionalType: string;
  profileImage?: File | Blob;
}

export interface CompanySignupRequest {
  companyName: string;
  mobileNo: string;
  email: string;
  password: string;
  businessCategory: string;
}

export interface CompleteTransportRequest {
  userId: string; // UUID format
  firstName: string;
  lastName: string;
  address: string;
  fleetSize: number;
  gstNumber: string;
  companyLogo?: File | Blob;
}

export interface CompleteServiceProviderRequest {
  userId: string; // UUID format
  businessName: string;
  gstNumber: string;
  businessType: string;
  servicesOffered: string;
  businessAddress: string;
  city: string;
  phoneNumber: string;
  email: string;
  whatsAppNumber: string;
  businessLogo?: File | Blob;
  description: string;
}

export interface SaveReferralRequest {
  referralId: string; // UUID
  createdBy: string; // UUID
  partnerId: number;
  userId: string; // UUID
  fullName: string;
  mobileNumber: string;
  email: string;
  role: string;
  location: string;
  notifyOnAcceptance: boolean;
  referralStatus: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  mobileNo: string;
  name?: string;
  companyName?: string;
  businessName?: string;
  userType: 'professional' | 'company' | 'business';
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  // Add other fields as returned by API
  [key: string]: string | number | boolean | undefined;
}

export interface Referral {
  referralId: string;
  createdBy: string;
  partnerId: number;
  userId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: string;
  location: string;
  notifyOnAcceptance: boolean;
  referralStatus: string;
  createdAt?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface SliderImage {
  id: number;
  userId: number;
  imageUrl: string;
  uploadedAt?: string;
  [key: string]: string | number | undefined;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build FormData for multipart/form-data requests
 */
const buildFormData = (
  data: Record<string, string | number | File | Blob | undefined | null>
): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === undefined || value === null) {
      return; // Skip undefined/null values
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Generic API request handler with error handling using axios
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${endpoint}`;

    console.log(
      `[API Request] ${options.method || 'GET'} ${API_BASE_URL}${url}`
    );

    const response = await axiosInstance.request<{
      message?: string;
      error?: string;
      data?: T;
      [key: string]: unknown;
    }>({
      url,
      ...options,
    });

    console.log(`[API Response] ${response.status}:`, response.data);

    // Success response
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

// ============================================
// USER API FUNCTIONS
// ============================================

export const userApi = {
  /**
   * POST /api/User/login
   * Login with mobile number and password
   */
  login: async (
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse['data']>> => {
    return apiRequest('/api/User/login', {
      method: 'POST',
      data: credentials,
    });
  },

  /**
   * POST /api/User/professional_signup
   * Register a new professional user
   */
  professionalSignup: async (
    data: ProfessionalSignupRequest
  ): Promise<ApiResponse> => {
    const formData = buildFormData({
      Email: data.email,
      Password: data.password,
      Name: data.name,
      FatherName: data.fatherName,
      DateOfBirth: data.dateOfBirth,
      MobileNo: data.mobileNo,
      State: data.state,
      City: data.city,
      ProfessionalType: data.professionalType,
      ProfileImage: data.profileImage,
    });

    return apiRequest('/api/User/professional_signup', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * POST /api/User/company_signup
   * Register a new company user
   */
  companySignup: async (data: CompanySignupRequest): Promise<ApiResponse> => {
    return apiRequest('/api/User/company_signup', {
      method: 'POST',
      data: data,
    });
  },

  /**
   * POST /api/User/complete-transport
   * Complete transport company profile
   */
  completeTransport: async (
    data: CompleteTransportRequest
  ): Promise<ApiResponse> => {
    const formData = buildFormData({
      UserId: data.userId,
      FirstName: data.firstName,
      LastName: data.lastName,
      Address: data.address,
      FleetSize: data.fleetSize,
      GSTNumber: data.gstNumber,
      CompanyLogo: data.companyLogo,
    });

    return apiRequest('/api/User/complete-transport', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * POST /api/User/complete-service-provider
   * Complete service provider profile
   */
  completeServiceProvider: async (
    data: CompleteServiceProviderRequest
  ): Promise<ApiResponse> => {
    const formData = buildFormData({
      UserId: data.userId,
      BusinessName: data.businessName,
      GSTNumber: data.gstNumber,
      BusinessType: data.businessType,
      ServicesOffered: data.servicesOffered,
      BusinessAddress: data.businessAddress,
      City: data.city,
      PhoneNumber: data.phoneNumber,
      Email: data.email,
      WhatsAppNumber: data.whatsAppNumber,
      BusinessLogo: data.businessLogo,
      Description: data.description,
    });

    return apiRequest('/api/User/complete-service-provider', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * POST /api/User/save-referral
   * Save a new referral
   */
  saveReferral: async (data: SaveReferralRequest): Promise<ApiResponse> => {
    return apiRequest('/api/User/save-referral', {
      method: 'POST',
      data: data,
    });
  },

  /**
   * POST /api/User/UploadSliderImage
   * Upload slider image for a user
   */
  uploadSliderImage: async (
    userId: number,
    file: File | Blob
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest(`/api/User/UploadSliderImage?userId=${userId}`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * GET /api/User/user-profile/{userId}
   * Get user profile by userId (UUID)
   */
  getUserProfile: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    return apiRequest(`/api/User/user-profile/${userId}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/User/GetReferralsByUserId/{userId}
   * Get all referrals for a user
   */
  getReferralsByUserId: async (
    userId: string
  ): Promise<ApiResponse<Referral[]>> => {
    return apiRequest(`/api/User/GetReferralsByUserId/${userId}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/User/GetSliders
   * Get slider images for a user
   */
  getSliders: async (userId?: number): Promise<ApiResponse<SliderImage[]>> => {
    const queryParam = userId ? `?userId=${userId}` : '';
    return apiRequest(`/api/User/GetSliders${queryParam}`, {
      method: 'GET',
    });
  },

  /**
   * DELETE /api/User/DeleteSlider/{id}
   * Delete a slider image by ID
   */
  deleteSlider: async (id: number, userId?: number): Promise<ApiResponse> => {
    const queryParam = userId ? `?userId=${userId}` : '';
    return apiRequest(`/api/User/DeleteSlider/${id}${queryParam}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date for API (ISO 8601)
 */
export const formatDateForApi = (date: Date | string): string => {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
};

/**
 * Validate UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Generate a new UUID (v4)
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default userApi;
