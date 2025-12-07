# Trip Assignment Payment Flow - API Integration

This document describes the complete payment and trip assignment flow using Razorpay payment gateway.

## API Endpoints Integrated

### 1. **POST /api/Trip/create-order**

Creates a Razorpay payment order before initiating payment.

**Request Body:**

```json
{
  "totalAmount": 15750.5
}
```

**Usage in Code:**

```typescript
const orderResponse = await wheelboardApi.trip.createPaymentOrder({
  totalAmount: totalAmount,
});
```

---

### 2. **POST /api/Trip/verify-payment**

Verifies the Razorpay payment after user completes the payment.

**Request Body:**

```json
{
  "tripId": "uuid",
  "bidId": "uuid",
  "userId": "uuid",
  "amount": 15000.0,
  "platformFee": 750.0,
  "totalAmount": 15750.0,
  "orderId": "order_xyz",
  "paymentId": "pay_abc",
  "signature": "razorpay_signature"
}
```

**Usage in Code:**

```typescript
await wheelboardApi.trip.verifyPayment({
  tripId: tripId,
  bidId: bidId,
  userId: user.id,
  amount: bidAmount,
  platformFee: platformFee,
  totalAmount: totalAmount,
  orderId: orderId,
  paymentId: response.razorpay_payment_id,
  signature: response.razorpay_signature,
});
```

---

### 3. **GET /api/Trip/assign-trip/{tripId}**

Assigns the trip to the driver after successful payment verification.

**Usage in Code:**

```typescript
await wheelboardApi.trip.assignTrip(tripId);
```

---

### 4. **GET /api/Trip/confirmation/{tripId}**

Fetches trip assignment confirmation details after assignment.

**Usage in Code:**

```typescript
const confirmationResponse =
  await wheelboardApi.trip.getTripConfirmation(tripId);
```

---

### 5. **POST /api/Trip/cancel**

Cancels a trip (for error handling or user cancellation).

**Request Body:**

```json
{
  "tripId": "uuid",
  "userId": "uuid"
}
```

**Usage in Code:**

```typescript
await wheelboardApi.trip.cancelTrip({
  tripId: tripId,
  userId: user.id,
});
```

---

## Payment Flow Sequence

### Assignment Page (`/company/trips/assignment`)

```
1. User clicks "Confirm & Pay" button
   ↓
2. Call POST /api/Trip/create-order
   - Creates Razorpay order
   - Returns orderId
   ↓
3. Initialize Razorpay Checkout
   - Opens Razorpay payment modal
   - User completes payment
   ↓
4. Razorpay returns payment response
   - razorpay_payment_id
   - razorpay_signature
   ↓
5. Call POST /api/Trip/verify-payment
   - Verifies payment authenticity
   - Links payment to trip and bid
   ↓
6. Redirect to success page with payment details
```

### Success Page (`/company/trips/assignment/success`)

```
1. Page loads with payment parameters
   ↓
2. Fetch trip, driver, and bid data
   ↓
3. Call GET /api/Trip/assign-trip/{tripId}
   - Marks trip as assigned
   - Associates driver with trip
   ↓
4. Call GET /api/Trip/confirmation/{tripId}
   - Gets confirmation details
   ↓
5. Display success message and details
```

---

## Environment Variables Required

Create a `.env.local` file with:

```env
# Razorpay Keys (Get from https://dashboard.razorpay.com/app/keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

---

## Code Implementation

### Assignment Page - Payment Handler

```typescript
const handlePayment = async () => {
  const user = api.getCurrentUser();

  // Step 1: Create order
  const orderResponse = await wheelboardApi.trip.createPaymentOrder({
    totalAmount: totalAmount,
  });

  // Step 2: Initialize Razorpay
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: totalAmount * 100, // Paise
    order_id: orderId,
    handler: async (response) => {
      // Step 3: Verify payment
      await wheelboardApi.trip.verifyPayment({
        tripId,
        bidId,
        userId,
        amount,
        platformFee,
        totalAmount,
        orderId,
        paymentId,
        signature,
      });

      // Redirect to success
      router.push('/company/trips/assignment/success?...');
    },
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
};
```

### Success Page - Assignment Handler

```typescript
useEffect(() => {
  const assignTrip = async () => {
    // Fetch data
    const trip = await fetchTripData();
    const driver = await fetchDriverData();
    const bid = await fetchBidData();

    // Assign trip
    await wheelboardApi.trip.assignTrip(tripId);

    // Get confirmation
    const confirmation = await wheelboardApi.trip.getTripConfirmation(tripId);

    setAssignmentComplete(true);
  };

  assignTrip();
}, [tripId]);
```

---

## Payment States

| State          | Description                 | Action                   |
| -------------- | --------------------------- | ------------------------ |
| **Pending**    | Payment order created       | User sees Razorpay modal |
| **Processing** | User completing payment     | Show loading spinner     |
| **Verifying**  | Backend verifying payment   | API validation           |
| **Success**    | Payment verified            | Assign trip              |
| **Assigned**   | Trip assigned to driver     | Show confirmation        |
| **Failed**     | Payment/verification failed | Show error, allow retry  |

---

## Error Handling

```typescript
try {
  await wheelboardApi.trip.verifyPayment(data);
} catch (error) {
  console.error('Payment verification failed:', error);
  // Option 1: Show error to user
  alert('Payment verification failed. Please contact support.');

  // Option 2: Retry payment
  // setIsProcessing(false);

  // Option 3: Cancel and refund (backend handles this)
}
```

---

## Testing

### Test Mode (Without Razorpay)

When Razorpay script is not loaded, the system falls back to simulation mode for development:

```typescript
if (typeof window !== 'undefined' && (window as any).Razorpay) {
  // Real Razorpay payment
} else {
  // Simulation for testing
  await new Promise((resolve) => setTimeout(resolve, 2000));
  router.push('/success?...');
}
```

### Test Cards (Razorpay Test Mode)

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

---

## Security Considerations

1. **Payment Signature Verification**: Always verify `razorpay_signature` on backend
2. **Amount Validation**: Backend should verify amount matches bid
3. **User Authentication**: Ensure user is logged in before payment
4. **Idempotency**: Handle duplicate payment attempts
5. **HTTPS Only**: All payment APIs must use HTTPS
6. **Key Protection**: Never expose `RAZORPAY_KEY_SECRET` to frontend

---

## Webhook Integration (Optional)

POST `/api/Trip/razorpay-webhook` - Receives real-time payment updates from Razorpay

```typescript
await wheelboardApi.trip.razorpayWebhook(webhookData);
```

This ensures payment status is updated even if user closes browser during payment.

---

## Success Page Features

✅ Real-time trip assignment
✅ Payment confirmation display
✅ Driver details with real data
✅ Trip details from API
✅ Transaction ID tracking
✅ Assignment status indicator
✅ Confirmation email trigger
✅ Download receipt option

---

## Files Modified

1. **`src/app/company/trips/assignment/page.tsx`**
   - Added Razorpay payment integration
   - Implemented `createPaymentOrder` API
   - Implemented `verifyPayment` API
   - Added payment modal handling

2. **`src/app/company/trips/assignment/success/page.tsx`**
   - Added `assignTrip` API call
   - Added `getTripConfirmation` API call
   - Display payment and order IDs
   - Show assignment status

3. **`src/app/layout.tsx`**
   - Added Razorpay checkout script

4. **`src/lib/wheelboardApi.ts`**
   - All payment APIs already defined

---

## Next Steps

1. Configure Razorpay account and get API keys
2. Set up environment variables
3. Test with Razorpay test cards
4. Configure webhook URL in Razorpay dashboard
5. Go live with production keys

---

## Support

For Razorpay integration issues:

- [Razorpay Docs](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [Razorpay Dashboard](https://dashboard.razorpay.com)

For WheelBoard API issues:

- Check API swagger documentation
- Verify authentication tokens
- Check network logs for errors
