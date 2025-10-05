# Schedule Trip Feature Documentation

## Overview

The Schedule Trip feature allows company users to directly schedule trips with driver assignment. Unlike the "New Trip" feature which posts trips for bidding, this feature immediately assigns a driver and schedules the trip, making it ideal for internal operations with owned vehicles and hired drivers.

## Files Created/Modified

### New Files

1. **`src/components/company/ScheduleTripModal.tsx`**
   - Main modal component with two-step flow
   - Form step for trip details and driver selection
   - Success step showing trip overview

### Modified Files

1. **`src/app/company/trips/page.tsx`**
   - Added "Schedule Trip" button in top bar
   - Integrated ScheduleTripModal component
   - Added blue success toast notification for scheduled trips
   - Auto-switches to "Upcoming" tab after scheduling

## Feature Comparison

### New Trip vs Schedule Trip

| Feature               | New Trip                              | Schedule Trip                          |
| --------------------- | ------------------------------------- | -------------------------------------- |
| **Purpose**           | Post trip for professionals to bid on | Directly schedule with internal driver |
| **Driver Assignment** | Not assigned initially                | Assigned during creation               |
| **Availability**      | Public (for bidding)                  | Internal only                          |
| **Button Location**   | Floating button (bottom-right)        | Top bar button                         |
| **Success Color**     | Green                                 | Blue                                   |
| **Use Case**          | External contractors, open market     | Internal fleet operations              |

## Features

### Form Step

The form collects the following information:

- **Select Vehicle**: Dropdown with available vehicles from fleet
- **Select Driver**: Dropdown with available drivers (filtered by status)
- **Pickup Location**: Text input for origin address
- **Delivery Location**: Text input for destination address
- **Pick up a Date**: Date picker for pickup date
- **Pick Time**: Time picker for pickup time
- **Schedule Now**: Primary action button

### Success Step (Trip Overview)

- Beautiful success animation with checkmark
- "Trip Scheduled!" confirmation message
- Comprehensive trip overview showing:
  - **Vehicle**: Name and registration number
  - **Assigned Driver**: Name and phone number
  - **Route**: Pickup → Delivery locations
  - **Scheduled Time**: Formatted date and time
- "Done" button to close and return to trips list

### User Flow

1. User clicks "Schedule Trip" button in top bar
2. Modal opens with form step
3. User selects vehicle from dropdown
4. User selects available driver from dropdown
5. User fills in locations, date, and time
6. User clicks "Schedule Now" button
7. Modal transitions to success step with animated checkmark
8. Success step shows complete trip overview
9. User clicks "Done" button
10. Modal closes, page switches to "Upcoming" tab
11. Blue success toast appears at bottom-center

## Design Elements

### Animations

- **Modal Entry**: Smooth fade and slide animations using Framer Motion
- **Success Checkmark**: Spring animation with scale effect
- **Step Transitions**: Horizontal slide between form and success
- **Success Toast**: Scale and fade animation
- **Button Interactions**: Scale on hover/tap using Framer Motion
- **Staggered Elements**: Success page elements appear in sequence

### Color Scheme

- **Primary Actions**: Gradient from `#f36969` (primary-500) to `#f85959` (primary-600)
- **Success Toast**: Blue-600 background (distinguishes from "New Trip" green)
- **Success Icon**: Green-600 checkmark on green-100 background
- **Icons**: Primary-500 color (#f36969)

### Responsive Design

- Modal is responsive with `max-w-md` width
- Form fields stack vertically for mobile compatibility
- Max height `90vh` with overflow scroll for small screens
- Button text hidden on small screens (icons only)

## Technical Implementation

### State Management

```typescript
const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
const [showScheduleToast, setShowScheduleToast] = useState(false);
const [step, setStep] = useState<'form' | 'success'>('form');
```

### Driver Filtering

```typescript
const availableDrivers = drivers.filter(
  (driver) => driver.status === 'Available' || !driver.status
);
```

- Only shows drivers with status "Available"
- Prevents scheduling with drivers currently on trips

### Data Flow

1. Form data stored in local state (`formData`)
2. On "Schedule Now", validates all required fields
3. Transitions to success step showing overview
4. On "Done", calls `onTripScheduled()` callback
5. Callback switches tab and shows success notification
6. Modal resets state and closes

### Validation

- Checks all required fields before allowing "Schedule Now"
- Alert shown if validation fails
- Required fields: vehicle, driver, pickup location, delivery location, date, time

## Integration Points

### Props Interface

```typescript
interface ScheduleTripModalProps {
  open: boolean;
  onClose: () => void;
  onTripScheduled: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber?: string;
  phoneNumber?: string;
  status?: string;
}
```

### Data Sources

- **Vehicles**: From `companyFleetData.vehicles` in `mockApi.ts`
- **Drivers**: From `companyFleetData.drivers` in `mockApi.ts`
- Drivers filtered to show only available ones

## UI/UX Highlights

### Button Placement Strategy

- **New Trip**: Floating button (bottom-right) - Always accessible, primary action
- **Schedule Trip**: Top bar button - Secondary action, part of toolbar

### Visual Differentiation

- **New Trip Toast**: Green (external/public action)
- **Schedule Trip Toast**: Blue (internal/private action)
- Different icon colors help users distinguish between workflows

### Success Page Enhancements

- Animated checkmark creates satisfying completion feedback
- Staggered element appearance (icon → title → description → overview → button)
- All key information visible without scrolling
- Clean, organized layout with icons for each data point

## Future Enhancements

### Backend Integration

- [ ] POST request to schedule trip API endpoint
- [ ] Real-time driver availability checking
- [ ] Conflict detection (vehicle/driver already scheduled)
- [ ] Handle loading states during API call
- [ ] Handle error states with error toast
- [ ] Send notifications to assigned driver

### Additional Features

- [ ] Driver rating display in dropdown
- [ ] Estimated distance calculation
- [ ] Estimated duration calculation
- [ ] Cost estimation based on distance
- [ ] Multiple driver selection (co-drivers)
- [ ] Recurring schedule option
- [ ] Add cargo/load details
- [ ] Attach documents (delivery notes, manifests)
- [ ] Send SMS/email notification to driver
- [ ] Add to driver's calendar

### Improvements

- [ ] Show driver availability calendar
- [ ] Map integration for location selection
- [ ] Auto-suggest locations based on history
- [ ] Driver preferences (language, specialization)
- [ ] Vehicle-driver compatibility check
- [ ] Load capacity validation
- [ ] Real-time ETA calculation
- [ ] Weather alerts for scheduled date
- [ ] Traffic predictions

## Usage Example

```tsx
import ScheduleTripModal from '@/components/company/ScheduleTripModal';
import { companyFleetData } from '@/lib/mockApi';

function TripsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleTripScheduled = () => {
    // Handle success
    console.log('Trip scheduled!');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Schedule Trip</button>

      <ScheduleTripModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onTripScheduled={handleTripScheduled}
        vehicles={companyFleetData.vehicles}
        drivers={companyFleetData.drivers}
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
- `framer-motion` - Animation library
- `lucide-react` - Icon library

## Testing Checklist

- [ ] Form validation works correctly
- [ ] Only available drivers appear in dropdown
- [ ] All fields are properly bound to state
- [ ] Modal can be closed at any point
- [ ] Success animation plays smoothly
- [ ] Trip overview displays all information correctly
- [ ] Done button closes modal and shows toast
- [ ] Page switches to Upcoming tab after scheduling
- [ ] Blue toast appears and auto-dismisses
- [ ] Modal resets state after closing
- [ ] Responsive on mobile devices
- [ ] Animations are smooth and performant
- [ ] No driver selected shows "No available drivers"
- [ ] Driver phone number displays when available

## Key Differences from Create Trip Modal

1. **Driver Selection**: Schedule Trip includes driver dropdown; Create Trip does not
2. **Success Flow**: Schedule Trip shows overview page; Create Trip goes to confirmation
3. **Toast Color**: Blue vs Green to distinguish workflows
4. **Button Location**: Top bar vs Floating button
5. **Purpose**: Internal scheduling vs Public posting
6. **Complexity**: More straightforward (single form) vs Two-step (form + confirmation)

## Design Rationale

### Why Two Separate Modals?

- **Different use cases**: Internal vs external operations
- **Different workflows**: Direct assignment vs bidding process
- **User clarity**: Separate buttons make intent clear
- **Feature evolution**: Each can evolve independently

### Why Blue Toast for Schedule?

- **Visual distinction**: Helps users understand which action they performed
- **Semantic meaning**: Blue = internal/scheduled, Green = posted/public
- **Consistent patterns**: Color coding aids in workflow recognition

### Why No Confirmation Step?

- **Simpler workflow**: Internal scheduling is straightforward
- **Trust model**: Company owns both vehicle and driver
- **Success page sufficient**: Overview provides all necessary confirmation
- **Faster UX**: One less step for frequent operation

## Performance Considerations

- Modal lazy loads to avoid bundle size impact
- Animations use GPU-accelerated transforms
- Form state kept minimal (6 fields only)
- Driver filtering happens in render (no separate effect)
- Success animations optimized with spring physics
