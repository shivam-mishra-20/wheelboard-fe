# Profile Pages - Quick Reference

## 🎨 Design Philosophy

The profile pages follow Wheelboard's clean and minimal design aesthetic while maintaining brand consistency with the signature orange (`#FF7A00`) color scheme.

## 📱 Responsive Design

### Desktop View (1024px+)

```
┌─────────────────────────────────────────────────┐
│  My Profile              [Edit Profile Button]  │
├──────────────┬──────────────────────────────────┤
│              │                                   │
│   PROFILE    │    BUSINESS ADDRESS               │
│    CARD      │    ──────────────────             │
│              │    [Address Details]              │
│   [Avatar]   │                                   │
│   Company    │    CONTACT INFORMATION            │
│   Name       │    ──────────────────             │
│              │    📞 Phone                       │
│   [Badges]   │    📧 Email                       │
│              │    🌐 Website                     │
│   [Actions]  │                                   │
│              │    DESCRIPTION                    │
│              │    ──────────────────             │
│              │    [Company Description]          │
└──────────────┴──────────────────────────────────┘
```

### Mobile View (<640px)

```
┌─────────────────────┐
│   My Profile        │
│  [Edit Button]      │
├─────────────────────┤
│    PROFILE CARD     │
│     [Avatar]        │
│   Company Name      │
│     [Badges]        │
│     [Actions]       │
├─────────────────────┤
│  BUSINESS ADDRESS   │
│   [Details]         │
├─────────────────────┤
│ CONTACT INFO        │
│   [Details]         │
├─────────────────────┤
│  DESCRIPTION        │
│   [Details]         │
└─────────────────────┘
```

## 🎯 Key Components

### Profile Card (Left Sidebar)

- **Avatar/Logo**: 128x128px circular image with upload overlay
- **Primary Info**: Name, GST/License, Category
- **Stats**: Fleet size, Experience, Service tags
- **Quick Actions**: Subscription, Switch Profile, Logout

### Information Sections (Right Content)

1. **Address Section**: Street, City, State with map pin icon
2. **Contact Section**: Phone, Email, Website with color-coded icons
3. **Description**: Multi-line text area for detailed info
4. **Additional Info**: GST, Member Since, Category (2-column grid)

## 🎨 Color Coding

### Icon Background Colors

| Type     | Color     | Usage               |
| -------- | --------- | ------------------- |
| Phone    | Blue-50   | Primary contact     |
| WhatsApp | Green-50  | Messaging contact   |
| Email    | Purple-50 | Email communication |
| Website  | Orange-50 | Web presence        |
| Map      | Gray-50   | Location info       |

### Badge Colors

| Type          | Color      | Usage               |
| ------------- | ---------- | ------------------- |
| Services      | Red-50     | Business services   |
| Business Type | Primary-50 | Company categories  |
| Regions       | Blue-50    | Operating areas     |
| Skills        | Green-50   | Professional skills |

## ✨ Interactive Features

### Edit Mode Toggle

```typescript
[View Mode]          →  Click "Edit Profile"  →  [Edit Mode]
  └─ Display only       └─ Form inputs enabled    └─ Save/Cancel
```

### Image Upload Flow

```
Click Camera Icon → Select File → Preview → Save Changes
```

### Animations

- **Page Load**: Fade in from top with slide up (y: -20 → 0)
- **Sidebar**: Slide from left (x: -20 → 0)
- **Content**: Slide from right (x: 20 → 0)
- **Buttons**: Scale on hover (1.0 → 1.02) and tap (1.0 → 0.98)

## 🔧 State Management

### Profile States

```typescript
interface ProfileState {
  profile: Profile | null; // Current saved profile
  editedProfile: Profile | null; // Working copy during edit
  isEditing: boolean; // Edit mode toggle
  logoPreview: string | null; // Image preview URL
  isSaving: boolean; // Save operation status
}
```

## 📋 Form Fields by User Type

### Business Profile

- ✅ Company Name
- ✅ Business Address (Street, City, State, Zip)
- ✅ Phone, WhatsApp, Email, Website
- ✅ GST Number
- ✅ Services Offered (Multi-select)
- ✅ Business Type (Multi-select)
- ✅ Description (Textarea)

### Company Profile

- ✅ Company Name
- ✅ Business Address (Street, City, State, Zip)
- ✅ Phone, Email, Website
- ✅ GST Number
- ✅ Fleet Size (Number)
- ✅ Operating Regions (Multi-select)
- ✅ Description (Textarea)

### Professional Profile

- ✅ Full Name, Father's Name
- ✅ Date of Birth
- ✅ License Number
- ✅ Address (Street, City, State, Zip)
- ✅ Phone, Email
- ✅ Experience (Years)
- ✅ Skills (Multi-select)
- ✅ Professional Summary (Textarea)

## 🚀 Performance Optimizations

- ✅ Next.js Image component for optimized images
- ✅ Lazy loading for sections
- ✅ Debounced input handlers (if needed)
- ✅ Memoized computed values
- ✅ Conditional rendering for edit/view modes

## 📱 Accessibility (a11y)

- ✅ Semantic HTML5 elements
- ✅ ARIA labels on form inputs
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Color contrast ratios (WCAG AA)
- ✅ Screen reader announcements

## 🔐 Security Considerations

- ✅ Client-side validation (ready for backend)
- ✅ File type restrictions for uploads
- ✅ XSS protection via React
- ⏳ Backend API authentication (to be implemented)
- ⏳ Rate limiting (to be implemented)

## 📊 Data Flow

```
User Action → State Update → UI Re-render
     ↓
  [Save]
     ↓
Mock API Call (1s delay)
     ↓
Profile Updated
     ↓
Exit Edit Mode
```

## 🎯 Testing Checklist

- [ ] Load profile data correctly
- [ ] Enter edit mode
- [ ] Modify all fields
- [ ] Upload image
- [ ] Cancel changes (reverts)
- [ ] Save changes (persists)
- [ ] Logout functionality
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop layout
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

## 💡 Usage Tips

1. **Quick Edit**: Click any section heading in edit mode to focus
2. **Image Upload**: Accepts all image formats, auto-converts to base64
3. **Cancel Safety**: Cancel button restores original data
4. **Navigation**: Profile link appears in main nav when logged in
