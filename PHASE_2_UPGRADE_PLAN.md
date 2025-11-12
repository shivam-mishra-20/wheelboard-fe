# Phase 2 Upgrade Plan - Enhanced Authentication & User Management

## Overview

Based on the actual API response structure, we need to update our implementation to properly handle:

1. Real API response format
2. Token management (stored as `authToken` per API spec)
3. User state management
4. Profile completion workflow
5. User profile UI (avatar, dropdown, logout)

## Actual API Response Structure

### Login Response (Tested)

```json
{
  "success": true,
  "data": {
    "userId": "48e36413-ba01-4850-8aae-8c8d05206dc7",
    "userType": "Company",
    "businessCategory": "transport",
    "isProfileComplete": false,
    "token": "eyJhbGciOiJI..."
  }
}
```

**Key Observations:**

- Response has `data` object containing user info
- Token is inside `data.token`
- UserType is capitalized: "Company", "Professional", "Business"
- Includes `isProfileComplete` flag
- `businessCategory` is included (e.g., "transport")
- No email/name/phone in initial login response

### User Profile Response

```json
{
  "error": "Profile not found."
}
```

**Note:** Profile endpoint returns error if profile incomplete. We should handle this gracefully.

## Tasks to Complete

### 1. ✅ Update Response Mapping in `wheelboardApi.ts`

- [x] Verify response structure handling
- [x] Ensure token extraction works correctly

### 2. ✅ Update `apiAdapter.ts` Login Handler

- [x] Map `data.userId` to `user.id`
- [x] Map `data.userType` (capitalized) to lowercase
- [x] Handle `isProfileComplete` flag
- [x] Store token correctly as `authToken` (not `wheelboard_auth_token`)
- [x] Handle missing email/name in response

### 3. ✅ Create User Profile Component

- [x] User avatar/initials
- [x] User name/email display
- [x] Dropdown menu with Profile, Settings, Logout
- [x] Show "Complete Profile" badge if `isProfileComplete: false`
- [x] Mobile responsive design

### 4. ✅ Update Navbar Component

- [x] Add `UserProfile` component to right side
- [x] Replace "Sign In" button when user is logged in
- [x] Show user profile dropdown
- [x] Handle mobile responsive view

### 5. 🔄 Create Profile Completion Flow

Create `src/app/company/complete-profile/page.tsx`:

- Form to complete company profile
- Uses `POST /api/User/complete-transport` or `/complete-service-provider`
- Fields: companyName, address, contact details, documents
- Redirect to dashboard after completion

### 6. 🔄 Update Protected Route

- Check `isProfileComplete` flag
- Redirect to profile completion if incomplete
- Allow access to completion page even if profile incomplete

### 7. 🔄 Add User Context Provider

Create `src/contexts/UserContext.tsx`:

- Global user state management
- Token refresh logic
- Profile refetch function
- Logout function

### 8. 🔄 Update Login Page

- Show profile completion notice after login
- Better error handling
- Add loading states

## API Endpoints to Test & Integrate

### User Management

| Endpoint                                  | Method | Purpose                    | Test Status |
| ----------------------------------------- | ------ | -------------------------- | ----------- |
| `/api/User/login`                         | POST   | User login                 | ✅ Tested   |
| `/api/User/user-profile/{userId}`         | GET    | Get user profile           | ✅ Tested   |
| `/api/User/complete-transport`            | POST   | Complete transport profile | ⏳ TODO     |
| `/api/User/complete-service-provider`     | POST   | Complete service profile   | ⏳ TODO     |
| `/api/User/GetReferralsByUserId/{userId}` | GET    | Get user referrals         | ⏳ TODO     |
| `/api/User/GetSliders`                    | GET    | Get carousel slides        | ⏳ TODO     |

### Testing Commands

```bash
# Test Login (with real credentials)
curl -X POST "https://wheelboardapi.addonshareware.com/api/User/login" \
  -H "Content-Type: application/json" \
  -d '{"mobileNo": "YOUR_MOBILE", "password": "YOUR_PASSWORD"}' \
  --insecure

# Test Get Profile
curl -X GET "https://wheelboardapi.addonshareware.com/api/User/user-profile/{userId}" \
  -H "Authorization: Bearer {token}" \
  --insecure

# Test Complete Transport Profile
curl -X POST "https://wheelboardapi.addonshareware.com/api/User/complete-transport" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "ABC Transport",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }' \
  --insecure
```

## Code Changes Required

### 1. Update `wheelboardApi.ts` Response Handling

**Current:**

```typescript
data: response.data?.data || (response.data as T);
```

**Issue:** The response already wraps data in `data` field, so we're double-nesting.

**Fix:** Keep as is, since axios response.data gives us the JSON, and our API returns `{success, data}`.

### 2. Update `apiAdapter.ts` Login Response Mapping

**Current:**

```typescript
const userData = response.data as {
  userId: string;
  token?: string;
  userType: 'professional' | 'company' | 'business';
  // ...
};
```

**Issue:**

- `userType` comes as "Company" (capitalized), not "company"
- Missing `isProfileComplete` field
- Token might not be extracted correctly

**Fix:** Add proper mapping:

```typescript
const userData = response.data as {
  userId: string;
  token: string;
  userType: string; // "Company", "Professional", "Business"
  businessCategory?: string;
  isProfileComplete: boolean;
  email?: string;
  mobileNo?: string;
  name?: string;
};

// Map to UnifiedUser with proper normalization
return {
  success: true,
  message: response.message,
  user: {
    id: userData.userId,
    userType: userData.userType.toLowerCase() as
      | 'professional'
      | 'company'
      | 'business',
    businessCategory: userData.businessCategory,
    isProfileComplete: userData.isProfileComplete,
    email: userData.email || '',
    mobileNo: userData.mobileNo || '',
    name: userData.name || '',
    createdAt: new Date().toISOString(),
  },
  token: userData.token,
};
```

### 3. Update Token Storage

**Current:**

```typescript
localStorage.setItem('wheelboard_auth_token', token);
```

**Fix:** Use `authToken` as per API spec:

```typescript
localStorage.setItem('authToken', token);
```

### 4. Add `isProfileComplete` to UnifiedUser Type

**Update in `apiAdapter.ts`:**

```typescript
export interface UnifiedUser {
  id: string;
  email: string;
  mobileNo?: string;
  name?: string;
  companyName?: string;
  businessName?: string;
  phoneNumber?: string;
  userType: 'professional' | 'company' | 'business';
  businessCategory?: string;
  isProfileComplete?: boolean; // ADD THIS
  avatar?: string | null;
  profileImage?: string;
  createdAt: string;
}
```

## Component Structure

```
src/
├── components/
│   ├── UserProfile.tsx           # NEW: User profile dropdown
│   ├── Navbar.tsx                # UPDATE: Add UserProfile
│   └── ProtectedRoute.jsx        # UPDATE: Check isProfileComplete
├── app/
│   ├── login/
│   │   └── page.tsx              # UPDATE: Better response handling
│   └── company/
│       ├── complete-profile/
│       │   └── page.tsx          # NEW: Profile completion form
│       └── home/
│           └── page.tsx          # UPDATE: Check profile status
├── contexts/
│   └── UserContext.tsx           # NEW: Global user state
└── lib/
    ├── apiAdapter.ts             # UPDATE: Fix response mapping
    └── wheelboardApi.ts          # ✅ Already correct
```

## User Flow

1. **User logs in** → Receives token + user data (with `isProfileComplete: false`)
2. **Token stored** → `localStorage.setItem('authToken', token)`
3. **User stored** → `localStorage.setItem('wheelboard_current_user', JSON.stringify(user))`
4. **Check profile** → If `isProfileComplete: false`, redirect to `/complete-profile`
5. **Complete profile** → POST to `/api/User/complete-transport` or `/complete-service-provider`
6. **Update flag** → Set `isProfileComplete: true` in localStorage
7. **Redirect to dashboard** → Now user can access all features

## Priority Order

1. **High Priority** (Complete immediately):
   - ✅ Fix token storage key (`authToken`)
   - ✅ Fix userType mapping (capitalize → lowercase)
   - ✅ Add `isProfileComplete` field
   - 🔄 Create UserProfile component
   - 🔄 Update Navbar with UserProfile

2. **Medium Priority** (Complete in Phase 2):
   - 🔄 Profile completion flow
   - 🔄 User context provider
   - 🔄 Protected route profile check

3. **Low Priority** (Complete later):
   - Testing all endpoints with curl
   - Profile image upload
   - Social login integration

## Testing Checklist

- [ ] Login with real credentials
- [ ] Verify token stored as `authToken`
- [ ] Verify user data stored correctly
- [ ] Check if `isProfileComplete` flag present
- [ ] Test profile dropdown shows/hides correctly
- [ ] Test logout clears all data
- [ ] Test profile completion flow
- [ ] Test protected routes with incomplete profile

## Notes

1. **SSL Certificate Issue**: API uses self-signed cert, add `--insecure` to curl commands
2. **Token Format**: JWT token, valid for 1 year (based on exp claim)
3. **UserType Casing**: API returns capitalized, frontend expects lowercase
4. **Profile Endpoint**: Returns error if profile incomplete - handle gracefully
5. **businessCategory**: Only present for company/business users

---

**Next Steps:** Start with fixing the response mapping in `apiAdapter.ts`, then create the UserProfile component.
