# WheelBoard API Integration Plan

## Overview

Replace all mockAPI integrations with real API calls from the WheelBoard backend.

## ✅ Completed

1. **wheelboardApi.ts** - Complete API service created with all endpoints:
   - User API (login, signup, profile, referrals, sliders)
   - Job API (add, update, list, apply, applications, status)
   - Service API (add, update, list, assign, delete)
   - Transport API (vehicles, drivers - add, update, list, delete)
   - Post API (add, get, approve, reject, delete)
   - Master Data API (services, business types)

## 🔄 Integration Tasks

### Phase 1: Core Authentication & User Management ✅ COMPLETED

- [x] Update `apiAdapter.ts` to use `wheelboardApi` instead of `userApi`
- [x] Update login flow in `src/app/login/page.tsx` (already done)
- [x] Update registration flows: (already done)
  - `src/app/register/professional/page.tsx`
  - `src/app/register/company/page.tsx`
  - `src/app/register/business/page.tsx`
- [x] Update `ProtectedRoute.jsx` to use real API session
- [x] Update `LoginSimulator.jsx` to use real API
- [x] Update `Chatbot.tsx` to use api.getCurrentUser
- [x] Update `ChatbotFullscreen.tsx` to use api.getCurrentUser

### Phase 2: Company Module

**Jobs Management:**

- [ ] `src/app/company/jobs/page.tsx` - Replace companyHomeData with wheelboardApi.job
  - GET /api/Job/job-list/{userId} - Get company's jobs
  - POST /api/Job/add-job - Create new job
  - PUT /api/Job/update-job - Update job
  - GET /api/Job/get-applications/{jobId} - Get applications
  - PUT /api/Job/update-job-status - Update application status

**Fleet Management:**

- [ ] `src/app/company/fleet/page.tsx` - Replace companyFleetData
  - GET /api/Transport/vehicle/{userId} - Get vehicles
  - GET /api/Transport/driver/{userId} - Get drivers
  - POST /api/Transport/add-vehicle - Add vehicle
  - POST /api/Transport/add-driver - Add driver
- [ ] `src/app/company/fleet/vehicles/[id]/page.tsx` - Vehicle details
  - GET /api/Transport/vehicle/{userId} - Get specific vehicle
  - PUT /api/Transport/update-vehicle - Update vehicle
  - DELETE /api/Transport/{vehicleId} - Delete vehicle
- [ ] `src/app/company/fleet/drivers/[id]/page.tsx` - Driver details
  - PUT /api/Transport/update-driver - Update driver
  - DELETE /api/Transport/driver/{driverId} - Delete driver

**Trips Management:**

- [ ] `src/app/company/trips/page.tsx` - Replace companyHomeData.allTrips
  - Create Trip API (if available in backend)
  - List Trips API (if available)
  - Update Trip Status API (if available)
- [ ] `src/app/company/trips/assignment/page.tsx` - Trip assignment
- [ ] `src/app/company/trips/bids/page.tsx` - Trip bids

**Services:**

- [ ] `src/app/company/services/page.tsx`
  - GET /api/Service/service-list/{userId} - Get services
  - POST /api/Service/add-service - Add service
- [ ] `src/app/company/services/[id]/page.tsx` - Service details
  - GET /api/Service/{serviceId}/user/{userId} - Get service details
  - PUT /api/Service/update-service - Update service
  - DELETE /api/Service/{assignmentId} - Delete service

**Feeds/Posts:**

- [ ] `src/app/company/feeds/page.tsx` - Replace communityFeeds
  - GET /api/Post/user/{userId} - Get user posts
  - POST /api/Post/add - Create post
  - DELETE /api/Post/{postId} - Delete post
- [ ] `CreatePostModal.tsx` - Use wheelboardApi.post.addPost

**Dashboard:**

- [ ] `src/app/company/dashboard/page.tsx` - Replace companyDashboardData
  - Aggregate data from multiple APIs
  - GET /api/Job/job-list/{userId} - Recent jobs
  - GET /api/Transport/vehicle/{userId} - Fleet stats
  - GET /api/Transport/driver/{userId} - Driver stats

**Home:**

- [ ] `src/app/company/home/page.tsx` - Replace companyHomeData
  - GET /api/Job/open-job-list - Recent jobs
  - GET /api/User/GetSliders - Carousel slides
  - POST /api/User/UploadSliderImage - Upload slider

### Phase 3: Professional Module

**Jobs:**

- [ ] `src/app/professional/jobs/page.tsx` - Replace companyHomeData
  - GET /api/Job/open-job-list - Browse jobs
  - POST /api/Job/apply-job - Apply to job
  - GET /api/Job/applied-jobs/{userId} - Get applied jobs

**Trips:**

- [ ] `src/app/professional/trips/page.tsx` - Professional trips
- [ ] `src/app/professional/trips/[id]/page.tsx` - Trip details
- [ ] `src/app/professional/trips/[id]/progress/page.tsx` - Trip progress

### Phase 4: Business Module

**Jobs:**

- [ ] `src/app/business/jobs/page.tsx` - Replace businessJobsData
  - GET /api/Job/job-list/{userId} - Get business jobs
  - POST /api/Job/add-job - Create job
  - GET /api/Job/get-applications/{jobId} - Get applications

**Services:**

- [ ] Business service listings
- [ ] Service bookings/enquiries

### Phase 5: Components Updates

**Modals:**

- [ ] `JobApplicationsModal.tsx` - Use wheelboardApi.job.getApplications
- [ ] `JobFormModal.tsx` - Use wheelboardApi.job.addJob / updateJob
- [ ] `VehicleFormModal.tsx` - Use wheelboardApi.transport.addVehicle / updateVehicle
- [ ] `DriverFormModal.tsx` - Use wheelboardApi.transport.addDriver / updateDriver
- [ ] `ServiceAssignmentModal.tsx` - Use wheelboardApi.service.assignService
- [ ] `ServiceEnquiryModal.tsx` - Use wheelboardApi.service APIs
- [ ] `CreatePostModal.tsx` - Use wheelboardApi.post.addPost

**Cards/Display Components:**

- [ ] `FeedCard.tsx` - Display with real post data
- [ ] `JobCard.tsx` - Display with real job data
- [ ] `VehicleMetricsCard.tsx` - Display with real vehicle data
- [ ] `DriverInfoCard.tsx` - Display with real driver data
- [ ] `TripDetailsModal.tsx` - Display with real trip data

**Other Components:**

- [ ] `Chatbot.tsx` - Update getCurrentUser to use wheelboardApi
- [ ] `ChatbotFullscreen.tsx` - Update getCurrentUser to use wheelboardApi
- [ ] `LoginSimulator.jsx` - Update or remove (dev only)

### Phase 6: Type Definitions

- [ ] Create unified type definitions that map backend API responses
- [ ] Update all component prop types
- [ ] Remove unused mockApi type imports

### Phase 7: Master Data

- [ ] Fetch services list from `/api/MasterData/getAllServices`
- [ ] Fetch business types from `/api/MasterData/getAllBusinessType`
- [ ] Use in dropdowns/select fields across registration and forms

## API Endpoint Mapping

### User Management

| Mock Function                   | Real API Endpoint                           | Status  |
| ------------------------------- | ------------------------------------------- | ------- |
| mockAPI.login                   | POST /api/User/login                        | ✅ Done |
| mockAPI.register (professional) | POST /api/User/professional_signup          | ✅ Done |
| mockAPI.register (company)      | POST /api/User/company_signup               | ✅ Done |
| mockAPI.getCurrentUser          | GET /api/User/user-profile/{userId}         | ✅ Done |
| -                               | POST /api/User/complete-transport           | ✅ Done |
| -                               | POST /api/User/complete-service-provider    | ✅ Done |
| -                               | POST /api/User/save-referral                | ✅ Done |
| -                               | GET /api/User/GetReferralsByUserId/{userId} | ✅ Done |
| -                               | GET /api/User/GetSliders                    | ✅ Done |
| -                               | POST /api/User/UploadSliderImage            | ✅ Done |
| -                               | DELETE /api/User/DeleteSlider/{id}          | ✅ Done |

### Jobs

| Mock Data                  | Real API Endpoint                     | Status  |
| -------------------------- | ------------------------------------- | ------- |
| companyHomeData.recentJobs | GET /api/Job/open-job-list            | ⏳ TODO |
| companyHomeData.allJobs    | GET /api/Job/job-list/{userId}        | ⏳ TODO |
| businessJobsData           | GET /api/Job/job-list/{userId}        | ⏳ TODO |
| -                          | POST /api/Job/add-job                 | ✅ Done |
| -                          | PUT /api/Job/update-job               | ✅ Done |
| -                          | GET /api/Job/{jobId}/user/{userId}    | ✅ Done |
| -                          | POST /api/Job/apply-job               | ✅ Done |
| -                          | GET /api/Job/get-applications/{jobId} | ✅ Done |
| -                          | GET /api/Job/applied-jobs/{userId}    | ✅ Done |
| -                          | PUT /api/Job/update-job-status        | ✅ Done |

### Transport

| Mock Data                 | Real API Endpoint                       | Status  |
| ------------------------- | --------------------------------------- | ------- |
| companyFleetData.vehicles | GET /api/Transport/vehicle/{userId}     | ⏳ TODO |
| companyFleetData.drivers  | GET /api/Transport/driver/{userId}      | ⏳ TODO |
| -                         | POST /api/Transport/add-vehicle         | ✅ Done |
| -                         | PUT /api/Transport/update-vehicle       | ✅ Done |
| -                         | DELETE /api/Transport/{vehicleId}       | ✅ Done |
| -                         | POST /api/Transport/add-driver          | ✅ Done |
| -                         | PUT /api/Transport/update-driver        | ✅ Done |
| -                         | DELETE /api/Transport/driver/{driverId} | ✅ Done |

### Services

| Mock Data | Real API Endpoint                          | Status  |
| --------- | ------------------------------------------ | ------- |
| -         | GET /api/Service/service-list/{userId}     | ✅ Done |
| -         | GET /api/Service/{serviceId}/user/{userId} | ✅ Done |
| -         | POST /api/Service/add-service              | ✅ Done |
| -         | PUT /api/Service/update-service            | ✅ Done |
| -         | GET /api/Service/assign-service/{userId}   | ✅ Done |
| -         | POST /api/Service/assign-service           | ✅ Done |
| -         | DELETE /api/Service/{assignmentId}         | ✅ Done |

### Posts/Feeds

| Mock Data                    | Real API Endpoint              | Status  |
| ---------------------------- | ------------------------------ | ------- |
| communityFeeds               | GET /api/Post/user/{userId}    | ⏳ TODO |
| companyHomeData.popularFeeds | GET /api/Post/user/{userId}    | ⏳ TODO |
| -                            | POST /api/Post/add             | ✅ Done |
| -                            | PUT /api/Post/approve/{postId} | ✅ Done |
| -                            | PUT /api/Post/reject/{postId}  | ✅ Done |
| -                            | DELETE /api/Post/{postId}      | ✅ Done |

### Master Data

| Mock Data          | Real API Endpoint                      | Status  |
| ------------------ | -------------------------------------- | ------- |
| businessCategories | GET /api/MasterData/getAllBusinessType | ⏳ TODO |
| -                  | GET /api/MasterData/getAllServices     | ✅ Done |

## Notes

1. **Authentication**: Store JWT token from login in localStorage as `authToken`
2. **User ID**: Get userId from login response, store in session
3. **Error Handling**: All APIs return standardized `ApiResponse<T>` format
4. **File Uploads**: Use multipart/form-data for image/document uploads
5. **Date Formats**: Backend expects ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

## Environment Variables

```env
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_BASE_URL=https://wheelboardapi.addonshareware.com
```

## Testing Strategy

1. Start with authentication flow (login/register)
2. Test each module independently
3. Verify data persistence across page reloads
4. Test error scenarios (network errors, validation errors)
5. Test file uploads
6. Test with real backend credentials

## Progress Tracking

- **API Service Created**: ✅ 100%
- **Authentication (Phase 1)**: ✅ 100% COMPLETE
  - apiAdapter.ts migrated to wheelboardApi ✅
  - Login & Registration using real API ✅
  - ProtectedRoute using real API ✅
  - LoginSimulator updated ✅
  - Chatbot components updated ✅
- **Phase 1.5: Enhanced Authentication**: ✅ 100% COMPLETE
  - Fixed API response mapping (userType capitalization) ✅
  - Fixed token storage key (authToken) ✅
  - Added isProfileComplete field to UnifiedUser ✅
  - Created UserProfile dropdown component ✅
  - Updated Navbar with user profile display ✅
  - Proper response structure handling ✅
- **Company Module (Phase 2)**: ⏳ 0%
- **Professional Module (Phase 3)**: ⏳ 0%
- **Business Module (Phase 4)**: ⏳ 0%
- **Components (Phase 5)**: ⏳ 0%
- **Overall**: ✅ 25%
