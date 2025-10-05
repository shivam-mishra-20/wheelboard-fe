# Create Trip Feature Documentation

## Overview

The Create Trip feature allows company users to post new trip requests that professionals can bid on. The feature includes a two-step modal flow with form input and confirmation screens.

## Files Created/Modified

### New Files

1. **`src/components/company/CreateTripModal.tsx`**
   - Main modal component with two-step flow
   - Form step for trip details input
   - Confirmation step for review before posting

### Modified Files

1. **`src/app/company/trips/page.tsx`**
   - Added "New Trip" button functionality
   - Integrated CreateTripModal component
   - Added success toast notification
   - Auto-switches to "Upcoming" tab after trip creation

## Features

### Form Step

The form collects the following information:

- **Select Vehicle**: Dropdown with available vehicles from fleet
- **Pickup Location**: Text input for origin address
- **Delivery Location**: Text input for destination address
- **Pick up a Date**: Date picker for pickup date
- **Pick Time**: Time picker for pickup time
- **Special Instructions**: Textarea for additional notes (optional)
- **Pay Range**: Text input for payment range (e.g., "Rs 200- Rs 900")

### Confirmation Step

- Displays all entered information in an organized review format
- Shows vehicle details with icon
- Shows route (pickup → delivery)
- Shows pickup schedule with formatted date and time
- Shows pay range
- Shows special instructions (if provided)
- Two action buttons:
  - **Edit Trip**: Returns to form step
  - **Post Trip**: Creates the trip and closes modal

### User Flow

1. User clicks "New Trip" floating button (bottom-right corner)
2. Modal opens with form step
3. User fills in required fields (vehicle, locations, date, time)
4. User clicks "Continue" button
5. Modal transitions to confirmation step
6. User reviews information
7. User can either:
   - Click "Edit Trip" to go back and modify
   - Click "Post Trip" to create the trip
8. On posting:
   - Trip is created (currently simulated)
   - Modal closes
   - Page switches to "Upcoming" tab
   - Success toast appears at bottom-center

## Design Elements

### Animations

- **Modal Entry**: Smooth fade and slide animations using Framer Motion
- **Step Transitions**: Horizontal slide transitions between form and confirmation
- **Success Toast**: Scale and fade animation
- **Button Interactions**: Scale on hover/tap using Framer Motion

### Color Scheme

- **Primary Actions**: Gradient from `#f36969` (primary-500) to `#f85959` (primary-600)
- **Secondary Actions**: White background with gray border
- **Success Toast**: Green-600 background
- **Icons**: Primary-500 color (#f36969)

### Responsive Design

- Modal is responsive with `max-w-md` width
- Form fields stack vertically for mobile compatibility
- Max height `90vh` with overflow scroll for small screens

## Technical Implementation

### State Management

```typescript
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [showSuccessToast, setShowSuccessToast] = useState(false);
const [step, setStep] = useState<'form' | 'confirmation'>('form');
```

### Data Flow

1. Form data stored in local state (`formData`)
2. On "Continue", validates required fields
3. On "Post Trip", calls `onTripCreated()` callback
4. Callback switches tab and shows success notification
5. Modal resets state and closes

### Validation

- Checks all required fields before allowing "Continue"
- Alert shown if validation fails
- Required fields: vehicle, pickup location, delivery location, date, time

## Integration Points

### Props Interface

```typescript
interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onTripCreated: () => void;
  vehicles: Array<{
    id: string;
    name: string;
    registrationNumber: string;
  }>;
}
```

### Vehicle Data Source

- Vehicles fetched from `companyFleetData.vehicles` in `mockApi.ts`
- Each vehicle has `id`, `name`, and `registrationNumber`

## Future Enhancements

### Backend Integration

- [ ] POST request to create trip API endpoint
- [ ] Handle loading states during API call
- [ ] Handle error states with error toast
- [ ] Real-time validation of locations
- [ ] Auto-calculate distance and estimated duration

### Additional Features

- [ ] Map integration for location selection
- [ ] Automatic distance calculation
- [ ] Price suggestion based on distance
- [ ] File upload for delivery documents
- [ ] Recurring trip scheduling
- [ ] Driver assignment (for owned vehicles)
- [ ] Trip templates for frequent routes

### Improvements

- [ ] Add form field validation with visual feedback
- [ ] Add loading spinner during submission
- [ ] Add ability to save as draft
- [ ] Add trip duplication feature
- [ ] Add bulk trip creation

## Usage Example

```tsx
import CreateTripModal from '@/components/company/CreateTripModal';
import { companyFleetData } from '@/lib/mockApi';

function TripsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleTripCreated = () => {
    // Handle success
    console.log('Trip created!');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>New Trip</button>

      <CreateTripModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onTripCreated={handleTripCreated}
        vehicles={companyFleetData.vehicles}
      />
    </>
  );
}
```

## Dependencies

- `@/components/ui/dialog` - shadcn Dialog component
- `@/components/ui/input` - shadcn Input component
- `@/components/ui/label` - shadcn Label component
- `@/components/ui/select` - shadcn Select component
- `@/components/ui/textarea` - shadcn Textarea component
- `framer-motion` - Animation library
- `lucide-react` - Icon library

## Testing Checklist

- [ ] Form validation works correctly
- [ ] All fields are properly bound to state
- [ ] Modal can be closed at any point
- [ ] Edit button returns to form with data intact
- [ ] Post button creates trip and shows success
- [ ] Success toast appears and auto-dismisses
- [ ] Page switches to Upcoming tab after posting
- [ ] Modal resets state after closing
- [ ] Responsive on mobile devices
- [ ] Animations are smooth and performant
