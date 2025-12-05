# Company Profile API Integration

## Overview

Successfully integrated real API calls for fetching and updating company profile data in the company profile page, replacing mock data with live backend data.

## Changes Made

### File Modified

- `src/app/company/profile/page.tsx`

### API Integrations

#### 1. **getUserProfile API** (GET)

- **Endpoint**: `/api/User/user-profile/{userId}`
- **Purpose**: Fetch company profile data from backend
- **Integration**:
  - Added `fetchProfile()` function that calls `wheelboardApi.user.getUserProfile()`
  - Fetches user profile on component mount using `useEffect`
  - Maps API response to `CompanyProfile` interface
  - Handles authentication by getting userId from `api.getCurrentUser()`

#### 2. **updateTransportProfile API** (POST)

- **Endpoint**: `/api/User/update-transport-profile`
- **Content-Type**: `multipart/form-data`
- **Purpose**: Update company profile information including logo upload
- **Integration**:
  - Updated `handleSave()` function to use real API
  - Creates FormData with required fields:
    - `UserId`: User ID from authentication
    - `CompanyName`: Company name
    - `FullName`: Company name (API requirement)
    - `Email`: Contact email
    - `Location`: Combined address, city, state
    - `FleetSize`: Number of vehicles
    - `GSTNumber`: GST registration number
    - `CompanyLogo`: Logo file (optional)
  - Handles file upload for company logo
  - Refreshes profile data after successful update

### New Features

#### State Management

- **`isLoading`**: Shows loading spinner while fetching profile
- **`error`**: Displays error messages for failed API calls
- **`logoFile`**: Stores selected logo file for upload

#### Error Handling

- Authentication check with redirect to login if not authenticated
- Try-catch blocks for API calls
- Error state display with retry button
- User-friendly error messages
- Console logging for debugging

#### Loading States

- Loading spinner with "Loading profile..." message
- Error state with retry functionality
- Empty state handling

#### Profile Data Mapping

Maps API response fields to UI interface:

- `userId` → `id`
- `companyName` → `companyName`
- `email` → `email`
- `mobileNo` → `phoneNumber`, `whatsappNumber`
- `businessCategory` → `businessCategory`
- `address` → `businessAddress`
- `city` → `city`
- `state` → `state`
- `zipCode` → `zipCode`
- `gstNumber` → `gstNumber`
- `fleetSize` → `fleetSize`
- `operatingRegions` → `operatingRegions`
- `description` → `description`
- `companyLogo` → `logo`
- `website` → `website`
- `rating` → `rating`
- `createdAt` → `createdAt`

### User Experience Improvements

#### Before

- ❌ Profile showed hardcoded mock data
- ❌ No real data fetching from backend
- ❌ Profile updates were not saved
- ❌ No loading or error states

#### After

- ✅ Profile fetches real data from backend
- ✅ Authentication-aware with userId validation
- ✅ Profile updates save to backend
- ✅ Logo upload functionality works
- ✅ Loading state while fetching data
- ✅ Error handling with retry option
- ✅ Success confirmation after save
- ✅ Auto-refresh after successful update

## API Response Structure

### getUserProfile Response

```json
{
  "status": 200,
  "data": {
    "userId": "string",
    "email": "string",
    "companyName": "string",
    "mobileNo": "string",
    "businessCategory": "string",
    "userType": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "gstNumber": "string",
    "fleetSize": 0,
    "operatingRegions": [],
    "description": "string",
    "companyLogo": "string",
    "website": "string",
    "rating": 0,
    "createdAt": "string"
  }
}
```

### updateTransportProfile Request (FormData)

```
UserId: string
CompanyName: string
FullName: string
Email: string
Location: string
FleetSize: string
GSTNumber: string
CompanyLogo: File (optional)
```

## Testing Checklist

- [x] Profile loads on page mount
- [x] Loading state displays while fetching
- [x] Profile data displays correctly
- [x] Edit mode toggles properly
- [x] Form fields update in edit mode
- [x] Logo file selection works
- [x] Logo preview updates on selection
- [x] Save button disabled while saving
- [x] Profile updates successfully
- [x] Success message shown after save
- [x] Error handling for failed requests
- [x] Retry button works on error
- [x] Authentication check redirects to login
- [x] Profile refreshes after update

## Dependencies

### Imports Added

```typescript
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';
```

### APIs Used

- `wheelboardApi.user.getUserProfile(userId)`
- `wheelboardApi.user.updateTransportProfile(formData)`
- `api.getCurrentUser()`

## Benefits

1. **Real Data**: Profile now shows actual user data from backend
2. **Persistence**: Profile updates are saved and persist across sessions
3. **File Upload**: Company logo can be uploaded and stored
4. **User Feedback**: Loading states and error messages improve UX
5. **Security**: Authentication validation ensures data security
6. **Reliability**: Error handling and retry mechanism improve reliability

## Next Steps

1. Add toast notifications instead of alerts
2. Add image validation (size, type)
3. Add profile completion percentage
4. Add recent activity section
5. Add social media links fields
6. Implement profile analytics
