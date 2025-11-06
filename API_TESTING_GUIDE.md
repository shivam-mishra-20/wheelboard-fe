# API Integration - Testing & Migration Guide

## 🎯 Quick Start

### 1. Environment Setup

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local and configure:
NEXT_PUBLIC_API_MODE=mock  # Start with mock for testing
NEXT_PUBLIC_API_BASE_URL=https://wheelboardapi.addonshareware.com
```

### 2. Test with Mock API (Default)

The application is configured to use **Mock API** by default for safe development:

```typescript
// .env.local
NEXT_PUBLIC_API_MODE = mock;
```

**Features:**

- ✅ No backend required
- ✅ localStorage-based persistence
- ✅ Instant responses
- ✅ Perfect for frontend development

### 3. Switch to Real API

When ready to test with the live backend:

```typescript
// .env.local
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_BASE_URL=https://wheelboardapi.addonshareware.com
```

## 📋 Testing Checklist

### Test Scenario 1: Login Flow

**Mock API Test:**

```typescript
import { api } from '@/lib/apiAdapter';

// Test with mock data
const response = await api.login({
  email: 'john@transport.com',
  password: 'password123',
});

console.log(response);
// Expected: { success: true, user: {...}, message: 'Login successful!' }
```

**Real API Test:**

```typescript
// Switch to NEXT_PUBLIC_API_MODE=real
const response = await api.login({
  mobileNo: '9876543210',
  password: 'yourpassword',
});
```

### Test Scenario 2: Professional Registration

**Mock API:**

```typescript
const response = await api.register({
  userType: 'professional',
  companyName: 'Test Driver',
  phoneNumber: '9999999999',
  password: 'password123',
  businessCategory: 'driver',
});
```

**Real API:**

```typescript
const response = await api.register({
  userType: 'professional',
  email: 'driver@example.com',
  mobileNo: '9876543210',
  password: 'securepassword',
  name: 'John Doe',
  fatherName: 'Robert Doe',
  dateOfBirth: '1990-01-15T00:00:00.000Z',
  state: 'Karnataka',
  city: 'Bangalore',
  professionalType: 'Driver',
});
```

### Test Scenario 3: Company Registration

**Mock API:**

```typescript
const response = await api.register({
  userType: 'company',
  companyName: 'ABC Transport',
  phoneNumber: '8888888888',
  password: 'password123',
  businessCategory: 'transport',
});
```

**Real API:**

```typescript
const response = await api.register({
  userType: 'company',
  companyName: 'XYZ Logistics',
  mobileNo: '9876543211',
  email: 'info@xyzlogistics.com',
  password: 'securepassword',
  businessCategory: 'Transport',
});
```

## 🔄 Migration Steps

### Step 1: Update Login Page

**Before (using mockAPI):**

```typescript
import { mockAPI } from '@/lib/mockApi';

const result = await mockAPI.login({ email, password });
```

**After (using unified API):**

```typescript
import { api, saveAuthUser } from '@/lib/apiAdapter';

const result = await api.login({ email, password });
if (result.success && result.user) {
  saveAuthUser(result.user, result.token);
}
```

### Step 2: Update Registration Pages

**Before:**

```typescript
const result = await mockAPI.register({
  companyName,
  phoneNumber,
  password,
  businessCategory,
  userType,
});
```

**After:**

```typescript
const result = await api.register({
  userType: 'professional',
  email,
  mobileNo,
  password,
  name,
  // ... other fields
});
```

### Step 3: Update User Session Handling

**Before:**

```typescript
const session = mockAPI.getCurrentSession();
const user = session?.user;
```

**After:**

```typescript
const user = api.getCurrentUser();
```

### Step 4: Update Logout

**Before:**

```typescript
await mockAPI.logout();
```

**After:**

```typescript
await api.logout();
```

## 🧪 Testing Real API Endpoints

### Test Login

```bash
curl -X POST https://wheelboardapi.addonshareware.com/api/User/login \
  -H "Content-Type: application/json" \
  -d '{"mobileNo": "9876543210", "password": "testpass"}'
```

### Test Professional Signup

```bash
curl -X POST https://wheelboardapi.addonshareware.com/api/User/professional_signup \
  -F "Email=test@example.com" \
  -F "Password=testpass123" \
  -F "Name=John Doe" \
  -F "FatherName=Robert Doe" \
  -F "DateOfBirth=1990-01-15T00:00:00.000Z" \
  -F "MobileNo=9876543210" \
  -F "State=Karnataka" \
  -F "City=Bangalore" \
  -F "ProfessionalType=Driver"
```

### Test Company Signup

```bash
curl -X POST https://wheelboardapi.addonshareware.com/api/User/company_signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Transport",
    "mobileNo": "9876543210",
    "email": "test@transport.com",
    "password": "testpass123",
    "businessCategory": "Transport"
  }'
```

### Test Get User Profile

```bash
curl -X GET "https://wheelboardapi.addonshareware.com/api/User/user-profile/{userId}"
```

## 🔍 Debugging

### Enable API Request Logging

The API automatically logs all requests and responses:

```typescript
// Check browser console for:
[API Request] POST https://wheelboardapi.addonshareware.com/api/User/login
[API Response] 200: {...}
```

### Check Current API Mode

```typescript
import { getApiMode } from '@/lib/apiAdapter';

console.log('Current API mode:', getApiMode());
// Output: "mock" or "real"
```

### Verify Environment Variables

```typescript
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('API Mode:', process.env.NEXT_PUBLIC_API_MODE);
```

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Errors

**Problem:** Browser blocks API requests due to CORS policy

**Solution:**

- Backend must allow requests from your domain
- Check backend CORS configuration
- Use proxy in development if needed

### Issue 2: 404 Not Found

**Problem:** API endpoint not found

**Solution:**

- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check endpoint spelling in `userApi.ts`
- Confirm backend server is running

### Issue 3: Invalid UUID

**Problem:** API rejects userId parameter

**Solution:**

```typescript
import { isValidUUID, generateUUID } from '@/lib/userApi';

// Validate before API call
if (!isValidUUID(userId)) {
  console.error('Invalid UUID format');
}

// Generate new UUID
const newId = generateUUID();
```

### Issue 4: Date Format Errors

**Problem:** API rejects date values

**Solution:**

```typescript
import { formatDateForApi } from '@/lib/userApi';

const formattedDate = formatDateForApi(new Date('1990-01-15'));
// Output: "1990-01-15T00:00:00.000Z"
```

### Issue 5: File Upload Fails

**Problem:** Profile image/logo upload doesn't work

**Solution:**

```typescript
// ✅ Correct
const file = fileInput.files[0];
await userApi.professionalSignup({
  // ... other fields
  profileImage: file, // Pass File object directly
});

// ❌ Wrong
profileImage: file.name; // Don't pass filename
profileImage: await file.text(); // Don't convert to text
```

## 📊 API Response Handling

### Success Response

```typescript
{
  success: true,
  message: "Login successful!",
  data: {
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    email: "user@example.com",
    userType: "professional",
    // ... other fields
  }
}
```

### Error Response

```typescript
{
  success: false,
  message: "Login failed",
  error: "Invalid credentials"
}
```

### Network Error

```typescript
{
  success: false,
  message: "Network error. Please check your connection.",
  error: "Failed to fetch"
}
```

## 🚀 Performance Tips

### 1. Cache User Data

```typescript
// After successful login
saveAuthUser(user, token);

// Retrieve without API call
const user = api.getCurrentUser();
```

### 2. Use Proper Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);
  try {
    const response = await api.login({...});
  } finally {
    setIsLoading(false);  // Always reset loading
  }
};
```

### 3. Implement Retry Logic

```typescript
const loginWithRetry = async (credentials, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    const response = await api.login(credentials);
    if (response.success) return response;

    if (i < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

## 📝 Development Workflow

### Phase 1: Mock API Development

1. Set `NEXT_PUBLIC_API_MODE=mock`
2. Build all UI components
3. Test user flows with mock data
4. Ensure all features work correctly

### Phase 2: Real API Integration

1. Set `NEXT_PUBLIC_API_MODE=real`
2. Test each API endpoint individually
3. Handle API-specific error cases
4. Verify data mapping is correct

### Phase 3: Hybrid Testing

1. Switch between modes as needed
2. Compare responses
3. Ensure consistent behavior
4. Fix any discrepancies

## ✅ Final Checklist

- [ ] Environment variables configured
- [ ] Tested login with both APIs
- [ ] Tested registration with both APIs
- [ ] User profile loading works
- [ ] Logout functionality works
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success/error messages displayed
- [ ] File uploads tested (real API)
- [ ] UUID validation working
- [ ] Date formatting correct
- [ ] Token management implemented
- [ ] CORS issues resolved (if any)

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify `.env.local` configuration
3. Test with mock API first
4. Check API documentation
5. Review this guide

## 🎓 Next Steps

After successful integration:

1. Add authentication middleware
2. Implement token refresh logic
3. Add API response caching
4. Set up error boundaries
5. Add analytics/logging
6. Prepare for production deployment
