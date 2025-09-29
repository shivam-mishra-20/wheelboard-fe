# WheelBoard Registration & Login Demo

## Mock Data Features

This project now includes a complete mock API simulation with the following features:

### 🔧 **Mock API Functions:**

- **User Registration** - Creates new users with validation
- **User Login** - Authenticates users with mock credentials
- **Social Login** - Simulates Google & Facebook authentication
- **Data Persistence** - Uses localStorage to persist user data

### 👥 **Pre-loaded Test Users:**

1. **Company User:** john@transport.com (Transport category)
2. **Professional:** sarah@mining.com (Mining category)
3. **Business:** mike@parts.com (Parts supplier)

### 🎯 **Registration Types:**

- **Professional** - Full range of business categories
- **Company** - Only Transport & Service Provider options
  - _Note: Selecting "Service Provider" redirects to Business registration_
- **Allied Business** - Parts, services, and support categories

### ✨ **Features Added:**

- Form validation with real-time feedback
- Loading states during API calls
- Success/error message displays
- Automatic routing after successful registration
- Service Provider routing logic in Company registration
- Persistent data storage using localStorage

### 🚀 **How to Test:**

1. **Try Login with existing users:**
   - Email: john@transport.com, Password: any 6+ chars
   - Email: sarah@mining.com, Password: any 6+ chars

2. **Register new users:**
   - Fill out any registration form
   - See real-time validation
   - Observe loading states and success messages

3. **Test Company Registration routing:**
   - Go to Company registration
   - Select "Service Provider"
   - Automatically redirected to Business registration

4. **View registered users:**
   - Check browser localStorage: `wheelboard_users`
   - See all registered users persist between sessions

### 🔍 **Mock API Validation:**

- Email format validation
- Phone number format checking
- Password minimum length (6 characters)
- Duplicate user prevention
- Business category requirements

All forms now provide realistic user feedback and simulate actual API interactions!
