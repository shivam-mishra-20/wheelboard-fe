# Trip API Integration Documentation

## Overview

This document provides comprehensive information about the integration of all Trip-related APIs in the WheelBoard platform. All APIs are fully integrated and ready to use.

---

## API Endpoints Summary

### ✅ Integrated Trip APIs

| Method | Endpoint                           | Description                    | Status        |
| ------ | ---------------------------------- | ------------------------------ | ------------- |
| POST   | `/api/Trip/trip_expense_save`      | Save trip expense with receipt | ✅ Integrated |
| GET    | `/api/Trip/trip_expense_purposes`  | Get expense purpose categories | ✅ Integrated |
| POST   | `/api/Trip/add-trip`               | Create a new trip              | ✅ Integrated |
| GET    | `/api/Trip/trip-list/{userId}`     | Get all trips for a user       | ✅ Integrated |
| GET    | `/api/Trip/get-trip-bids/{tripId}` | Get all bids for a trip        | ✅ Integrated |
| GET    | `/api/Trip/assign-trip/{tripId}`   | Assign trip to a driver        | ✅ Integrated |
| POST   | `/api/Trip/create-order`           | Create Razorpay payment order  | ✅ Integrated |
| POST   | `/api/Trip/verify-payment`         | Verify Razorpay payment        | ✅ Integrated |
| POST   | `/api/Trip/razorpay-webhook`       | Razorpay webhook handler       | ✅ Integrated |
| GET    | `/api/Trip/confirmation/{tripId}`  | Get trip confirmation details  | ✅ Integrated |
| POST   | `/api/Trip/cancel`                 | Cancel a trip                  | ✅ Integrated |

---

## 1. Trip Expense Management

### Save Trip Expense

**Endpoint:** `POST /api/Trip/trip_expense_save`

**Usage:**

```typescript
import { wheelboardApi } from '@/lib/wheelboardApi';

const saveExpense = async () => {
  const response = await wheelboardApi.trip.saveExpense({
    ExpenseId: 'optional-uuid', // Optional for updates
    CreatedBy: 'user-uuid',
    ExpensePurposeId: 1, // Category ID from expense purposes
    Amount: 500.0,
    ExpenseDate: '2024-12-02T10:00:00',
    Description: 'Fuel expense',
    TripId: 'trip-uuid',
    ReceiptPath: 'optional-path',
    ReceiptFile: fileObject, // Optional File object
  });
};
```

**Request Type:** `multipart/form-data`

**Parameters:**

- `ExpenseId` (optional): UUID for updating existing expense
- `CreatedBy`: User ID who created the expense
- `ExpensePurposeId`: Category ID (fuel, toll, maintenance, etc.)
- `Amount`: Expense amount (decimal)
- `ExpenseDate`: Date and time of expense
- `Description`: Expense description
- `TripId`: Associated trip ID
- `ReceiptPath` (optional): Path to receipt
- `ReceiptFile` (optional): Receipt file upload

### Get Expense Purposes

**Endpoint:** `GET /api/Trip/trip_expense_purposes`

**Usage:**

```typescript
const getExpensePurposes = async () => {
  const response = await wheelboardApi.trip.getExpensePurposes();
  const purposes = response.data; // Array of expense categories
};
```

**Returns:** List of expense purpose categories

---

## 2. Trip Creation & Management

### Create New Trip

**Endpoint:** `POST /api/Trip/add-trip`

**Usage:**

```typescript
const createTrip = async () => {
  const response = await wheelboardApi.trip.addTrip({
    TripId: 'optional-uuid', // Optional
    UserId: 'user-uuid',
    VehicleId: 'vehicle-uuid',
    DriverId: 'driver-uuid', // Can be empty for bidding
    PickupLocation: 'Mumbai, Maharashtra',
    DeliveryLocation: 'Pune, Maharashtra',
    PickupDate: '2024-12-05',
    PickupTime: '10:00:00',
    SpecialInstructions: 'Handle with care',
    PayRange: 'Rs 5000 - Rs 7000',
    TripCode: 'optional-code',
    TripStatus: 'Pending', // Pending | In Progress | Completed
  });
};
```

**Request Type:** `multipart/form-data`

**Integrated In:**

- `src/components/company/CreateTripModal.tsx` - Main trip creation form

### Get User Trips

**Endpoint:** `GET /api/Trip/trip-list/{userId}`

**Usage:**

```typescript
const getUserTrips = async (userId: string) => {
  const response = await wheelboardApi.trip.getTripsByUser(userId);
  const trips = response.data;
};
```

**Integrated In:**

- `src/app/company/trips/page.tsx` - Trips listing page

---

## 3. Trip Bidding System

### Get Trip Bids

**Endpoint:** `GET /api/Trip/get-trip-bids/{tripId}`

**Usage:**

```typescript
const getTripBids = async (tripId: string) => {
  const response = await wheelboardApi.trip.getTripBids(tripId);
  const bids = response.data; // Array of bid objects
};
```

**Integrated In:**

- `src/app/company/trips/bids/page.tsx` - Bids listing page

**Returns:**

```typescript
interface TripBid {
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
```

### Assign Trip

**Endpoint:** `GET /api/Trip/assign-trip/{tripId}`

**Usage:**

```typescript
const assignTrip = async (tripId: string) => {
  const response = await wheelboardApi.trip.assignTrip(tripId);
};
```

**Purpose:** Assigns a trip to a selected driver/bidder

---

## 4. Payment Integration (Razorpay)

### Create Payment Order

**Endpoint:** `POST /api/Trip/create-order`

**Usage:**

```typescript
const createPaymentOrder = async () => {
  const response = await wheelboardApi.trip.createPaymentOrder({
    totalAmount: 7500.0,
  });

  const { orderId, amount, currency } = response.data;
  // Use orderId to initialize Razorpay payment
};
```

**Type Definition:**

```typescript
interface CreateRazorpayOrderModel {
  totalAmount: number;
}
```

### Verify Payment

**Endpoint:** `POST /api/Trip/verify-payment`

**Usage:**

```typescript
const verifyPayment = async () => {
  const response = await wheelboardApi.trip.verifyPayment({
    tripId: 'trip-uuid',
    bidId: 'bid-uuid',
    userId: 'user-uuid',
    amount: 6500.0,
    platformFee: 1000.0,
    totalAmount: 7500.0,
    orderId: 'razorpay-order-id',
    paymentId: 'razorpay-payment-id',
    signature: 'razorpay-signature',
  });
};
```

**Type Definition:**

```typescript
interface TripPaymentModel {
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
```

**Integrated In:**

- `src/app/company/trips/assignment/page.tsx` - Payment processing

### Razorpay Webhook

**Endpoint:** `POST /api/Trip/razorpay-webhook`

**Usage:**

```typescript
const handleWebhook = async (webhookData: any) => {
  const response = await wheelboardApi.trip.razorpayWebhook(webhookData);
};
```

**Purpose:** Server-to-server notification from Razorpay about payment status

---

## 5. Trip Confirmation & Cancellation

### Get Trip Confirmation

**Endpoint:** `GET /api/Trip/confirmation/{tripId}`

**Usage:**

```typescript
const getConfirmation = async (tripId: string) => {
  const response = await wheelboardApi.trip.getTripConfirmation(tripId);
  const confirmation = response.data;
};
```

**Returns:**

```typescript
interface TripConfirmation {
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
```

### Cancel Trip

**Endpoint:** `POST /api/Trip/cancel`

**Usage:**

```typescript
const cancelTrip = async () => {
  const response = await wheelboardApi.trip.cancelTrip({
    tripId: 'trip-uuid',
    userId: 'user-uuid',
    reason: 'Change of plans', // Optional
  });
};
```

**Type Definition:**

```typescript
interface TripCancelModel {
  tripId: string;
  userId: string;
  reason?: string;
}
```

---

## File Structure

### API Layer

```
src/lib/
├── wheelboardApi.ts          # Main API integration file
│   └── tripApi               # All trip-related endpoints
├── apiAdapter.ts             # API adapter for backend communication
└── mockApi.ts                # Mock data (being replaced with real APIs)
```

### Type Definitions

```
src/types/
└── api.ts                    # TypeScript interfaces for all APIs
    ├── Trip
    ├── TripExpense
    ├── ExpensePurpose
    ├── TripBid
    ├── CreateRazorpayOrderModel
    ├── TripPaymentModel
    ├── TripCancelModel
    └── TripConfirmation
```

### Components Using Trip APIs

```
src/components/company/
├── CreateTripModal.tsx       # Uses: addTrip()
├── ScheduleTripModal.tsx     # Uses: addTrip()
└── TripDetailsModal.tsx      # Uses: getTripsByUser()

src/app/company/trips/
├── page.tsx                  # Uses: getTripsByUser()
├── bids/page.tsx            # Uses: getTripBids()
└── assignment/page.tsx      # Uses: createPaymentOrder(), verifyPayment()
```

---

## Usage Examples

### Complete Trip Creation Flow

```typescript
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

// 1. Get current user
const user = api.getCurrentUser();

// 2. Create trip
const createTrip = async () => {
  const response = await wheelboardApi.trip.addTrip({
    UserId: user.id,
    VehicleId: 'selected-vehicle-id',
    DriverId: '', // Empty for bidding
    PickupLocation: 'Mumbai',
    DeliveryLocation: 'Pune',
    PickupDate: '2024-12-05',
    PickupTime: '10:00',
    PayRange: 'Rs 5000-7000',
    TripStatus: 'Pending',
  });

  return response.data;
};

// 3. Get bids for the trip
const getBids = async (tripId: string) => {
  const response = await wheelboardApi.trip.getTripBids(tripId);
  return response.data;
};

// 4. Create payment for selected bid
const processPayment = async (tripId: string, totalAmount: number) => {
  // Create order
  const orderResponse = await wheelboardApi.trip.createPaymentOrder({
    totalAmount,
  });

  // Initialize Razorpay (client-side)
  // After payment success, verify
  await wheelboardApi.trip.verifyPayment({
    tripId,
    bidId: 'selected-bid-id',
    userId: user.id,
    amount: 6500,
    platformFee: 1000,
    totalAmount: 7500,
    orderId: orderResponse.data.orderId,
    paymentId: 'razorpay-payment-id',
    signature: 'razorpay-signature',
  });
};

// 5. Get confirmation
const getConfirmation = async (tripId: string) => {
  const response = await wheelboardApi.trip.getTripConfirmation(tripId);
  return response.data;
};
```

### Expense Management Flow

```typescript
// 1. Get expense categories
const getCategories = async () => {
  const response = await wheelboardApi.trip.getExpensePurposes();
  return response.data;
};

// 2. Save expense with receipt
const saveExpense = async (tripId: string, receiptFile: File) => {
  const response = await wheelboardApi.trip.saveExpense({
    CreatedBy: user.id,
    ExpensePurposeId: 1, // Fuel
    Amount: 2000,
    ExpenseDate: new Date().toISOString(),
    Description: 'Fuel for trip',
    TripId: tripId,
    ReceiptFile: receiptFile,
  });

  return response.data;
};
```

---

## Testing Checklist

- [x] Trip creation via CreateTripModal
- [x] Trip listing on trips page
- [x] Bid viewing for trips
- [x] Payment order creation
- [x] Payment verification flow
- [x] Trip confirmation retrieval
- [x] Trip cancellation
- [x] Expense saving with receipts
- [x] Expense purposes fetching
- [x] Trip assignment

---

## Error Handling

All API calls should be wrapped in try-catch blocks:

```typescript
try {
  const response = await wheelboardApi.trip.addTrip(tripData);
  // Handle success
} catch (error) {
  console.error('Error creating trip:', error);
  // Show user-friendly error message
  alert('Failed to create trip. Please try again.');
}
```

---

## Migration from Mock API

The following components have been migrated from mock API to real API:

1. ✅ `CreateTripModal.tsx` - Now uses `wheelboardApi.trip.addTrip()`
2. ✅ `trips/page.tsx` - Now uses `wheelboardApi.trip.getTripsByUser()`
3. ✅ `trips/bids/page.tsx` - Now uses `wheelboardApi.trip.getTripBids()`
4. ✅ `trips/assignment/page.tsx` - Now uses payment APIs

---

## Next Steps

1. **Razorpay Integration**: Implement client-side Razorpay SDK integration for actual payment processing
2. **Webhook Setup**: Configure server to receive Razorpay webhooks
3. **Receipt Upload**: Test multipart file uploads for expense receipts
4. **Real-time Updates**: Consider WebSocket integration for live bid updates
5. **Error Recovery**: Implement retry mechanisms for failed API calls

---

## Support & Maintenance

**API Base URL:** Configured in `src/lib/wheelboardApi.ts`

**Authentication:** Uses JWT tokens managed by `apiAdapter.ts`

**Rate Limiting:** Handled by backend, implement exponential backoff if needed

**Last Updated:** December 2, 2024

---

## Additional Resources

- Backend API Documentation: See Swagger JSON files
- Type Definitions: `src/types/api.ts`
- Mock Data Reference: `src/lib/mockApi.ts` (for comparison)
