# API Integration Documentation

## Overview

This application now supports **both Mock API and Real API** integration with seamless switching between the two modes.

## Configuration

### Environment Variables

Add to your `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://wheelboardapi.addonshareware.com
NEXT_PUBLIC_API_MODE=mock  # Use 'mock' for development, 'real' for production

# AI Chatbot (existing)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

## API Modes

### 1. Mock API (Development)

- Set `NEXT_PUBLIC_API_MODE=mock`
- Uses localStorage for data persistence
- Perfect for frontend development and testing
- No backend required

### 2. Real API (Production)

- Set `NEXT_PUBLIC_API_MODE=real`
- Connects to `https://wheelboardapi.addonshareware.com`
- All requests are sent to the live backend
- Requires backend server to be running

## API Services

### 1. User API (`userApi.ts`)

Direct integration with the real backend API.

#### Authentication

**Login**

```typescript
import { userApi } from '@/lib/userApi';

const response = await userApi.login({
  mobileNo: '9876543210',
  password: 'password123',
});

if (response.success) {
  console.log('Logged in:', response.data);
}
```

#### Registration

**Professional Signup**

```typescript
const response = await userApi.professionalSignup({
  email: 'john@example.com',
  password: 'password123',
  name: 'John Doe',
  fatherName: 'Robert Doe',
  dateOfBirth: '1990-01-15T00:00:00.000Z',
  mobileNo: '9876543210',
  state: 'Karnataka',
  city: 'Bangalore',
  professionalType: 'Driver',
  profileImage: fileObject, // Optional File or Blob
});
```

**Company Signup**

```typescript
const response = await userApi.companySignup({
  companyName: 'ABC Transport',
  mobileNo: '9876543210',
  email: 'info@abctransport.com',
  password: 'password123',
  businessCategory: 'Transport',
});
```

#### Profile Completion

**Complete Transport Company Profile**

```typescript
const response = await userApi.completeTransport({
  userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // UUID
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main Street, Bangalore',
  fleetSize: 50,
  gstNumber: '29ABCDE1234F1Z5',
  companyLogo: fileObject, // Optional
});
```

**Complete Service Provider Profile**

```typescript
const response = await userApi.completeServiceProvider({
  userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  businessName: 'XYZ Services',
  gstNumber: '29ABCDE1234F1Z5',
  businessType: 'Maintenance',
  servicesOffered: 'Vehicle Repair, Parts Supply',
  businessAddress: '456 Service Road',
  city: 'Bangalore',
  phoneNumber: '9876543210',
  email: 'contact@xyzservices.com',
  whatsAppNumber: '9876543210',
  businessLogo: fileObject,
  description: 'Leading vehicle service provider',
});
```

#### Referrals

**Save Referral**

```typescript
const response = await userApi.saveReferral({
  referralId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  partnerId: 123,
  userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  fullName: 'Jane Doe',
  mobileNumber: '9876543211',
  email: 'jane@example.com',
  role: 'Driver',
  location: 'Mumbai',
  notifyOnAcceptance: true,
  referralStatus: 'Pending',
});
```

**Get Referrals**

```typescript
const response = await userApi.getReferralsByUserId(
  '3fa85f64-5717-4562-b3fc-2c963f66afa6'
);

if (response.success) {
  console.log('Referrals:', response.data);
}
```

#### User Profile

**Get User Profile**

```typescript
const response = await userApi.getUserProfile(
  '3fa85f64-5717-4562-b3fc-2c963f66afa6'
);

if (response.success) {
  console.log('User profile:', response.data);
}
```

#### Slider Images

**Upload Slider Image**

```typescript
const response = await userApi.uploadSliderImage(123, fileObject);
```

**Get Sliders**

```typescript
const response = await userApi.getSliders(123); // userId is optional
```

**Delete Slider**

```typescript
const response = await userApi.deleteSlider(456, 123); // (sliderId, userId)
```

### 2. Unified API (`apiAdapter.ts`)

**Recommended for application code** - automatically switches between mock and real API.

#### Login

```typescript
import { api } from '@/lib/apiAdapter';

const response = await api.login({
  email: 'john@example.com', // or mobileNo
  password: 'password123',
});

if (response.success && response.user) {
  console.log('User:', response.user);
  console.log('Token:', response.token);
}
```

#### Register

```typescript
// Professional registration
const response = await api.register({
  userType: 'professional',
  email: 'john@example.com',
  mobileNo: '9876543210',
  password: 'password123',
  name: 'John Doe',
  fatherName: 'Robert Doe',
  dateOfBirth: '1990-01-15T00:00:00.000Z',
  state: 'Karnataka',
  city: 'Bangalore',
  professionalType: 'Driver',
});

// Company registration
const response = await api.register({
  userType: 'company',
  companyName: 'ABC Transport',
  email: 'info@abctransport.com',
  mobileNo: '9876543210',
  password: 'password123',
  businessCategory: 'Transport',
});
```

#### Get Current User

```typescript
const user = api.getCurrentUser();
if (user) {
  console.log('Current user:', user);
}
```

#### Logout

```typescript
await api.logout();
```

## Response Format

All API functions return a consistent format:

```typescript
{
  success: boolean;
  message: string;
  data?: T; // Response data (if successful)
  error?: string; // Error details (if failed)
}
```

## Error Handling

```typescript
const response = await userApi.login({
  mobileNo: '9876543210',
  password: 'wrong',
});

if (!response.success) {
  console.error('Login failed:', response.message);
  console.error('Error details:', response.error);
}
```

## Utility Functions

### Date Formatting

```typescript
import { formatDateForApi } from '@/lib/userApi';

const formattedDate = formatDateForApi(new Date());
// Output: "2024-01-15T10:30:00.000Z"
```

### UUID Validation

```typescript
import { isValidUUID } from '@/lib/userApi';

const valid = isValidUUID('3fa85f64-5717-4562-b3fc-2c963f66afa6');
// Output: true
```

### UUID Generation

```typescript
import { generateUUID } from '@/lib/userApi';

const newId = generateUUID();
// Output: "a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789"
```

## Migrating from Mock API

### Before (Mock API)

```typescript
import { mockAPI } from '@/lib/mockApi';

const response = await mockAPI.login({
  email: 'john@example.com',
  password: 'password123',
});
```

### After (Unified API)

```typescript
import { api } from '@/lib/apiAdapter';

const response = await api.login({
  email: 'john@example.com',
  password: 'password123',
});
```

Just change the import and you're done! The unified API handles the rest.

## Testing

### Test with Mock API

```bash
# In .env.local
NEXT_PUBLIC_API_MODE=mock
```

### Test with Real API

```bash
# In .env.local
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_BASE_URL=https://wheelboardapi.addonshareware.com
```

## File Upload Guide

When uploading files (images, documents), pass the File or Blob object directly:

```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const response = await userApi.professionalSignup({
  // ... other fields
  profileImage: file, // Pass File object directly
});
```

## API Endpoints Reference

| Method | Endpoint                                  | Description                       |
| ------ | ----------------------------------------- | --------------------------------- |
| POST   | `/api/User/login`                         | User login                        |
| POST   | `/api/User/professional_signup`           | Professional registration         |
| POST   | `/api/User/company_signup`                | Company registration              |
| POST   | `/api/User/complete-transport`            | Complete transport profile        |
| POST   | `/api/User/complete-service-provider`     | Complete service provider profile |
| POST   | `/api/User/save-referral`                 | Save a referral                   |
| POST   | `/api/User/UploadSliderImage`             | Upload slider image               |
| GET    | `/api/User/user-profile/{userId}`         | Get user profile                  |
| GET    | `/api/User/GetReferralsByUserId/{userId}` | Get user referrals                |
| GET    | `/api/User/GetSliders`                    | Get slider images                 |
| DELETE | `/api/User/DeleteSlider/{id}`             | Delete slider image               |

## TypeScript Types

All types are fully typed with TypeScript. Import them as needed:

```typescript
import type {
  LoginRequest,
  LoginResponse,
  ProfessionalSignupRequest,
  CompanySignupRequest,
  UserProfile,
  Referral,
  ApiResponse,
} from '@/lib/userApi';
```

## Best Practices

1. **Always use the Unified API** (`apiAdapter.ts`) in your components
2. **Check `response.success`** before accessing data
3. **Handle errors gracefully** with user-friendly messages
4. **Validate UUIDs** before making API calls
5. **Format dates properly** using `formatDateForApi()`
6. **Use TypeScript types** for better code completion

## Troubleshooting

### API not connecting

- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Verify backend server is running
- Check browser console for CORS errors

### Invalid UUID errors

- Use `generateUUID()` to create new UUIDs
- Validate UUIDs with `isValidUUID()` before API calls

### File upload fails

- Ensure file size is within limits
- Check file type is supported
- Verify FormData is being sent correctly

## Next Steps

1. ✅ API integration complete
2. 🔄 Update login/register pages to use unified API
3. 🔄 Add authentication token management
4. 🔄 Implement API error boundaries
5. 🔄 Add loading states and retry logic
