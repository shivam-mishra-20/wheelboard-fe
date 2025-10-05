# Company Feeds Page - Feature Documentation

## Overview

A modern, professional community feeds page for Company and Business users to share fleet management updates, tips, questions, and announcements.

## Features

### 1. **Feed Display**

- Clean, card-based layout with responsive design
- Professional desktop and mobile views
- User profile information (avatar, name, company, user type badge)
- Category badges (Announcement, Tip, Update, Question, General)
- Timestamp display (e.g., "2 hours ago")
- Optional images with hover zoom effects

### 2. **Create Post**

- **Desktop**: "Create Post" button in page header
- **Mobile**: Floating action button (bottom-right)
- Modal with:
  - Rich text area for content
  - Image upload placeholder (demo mode)
  - User profile display
  - Post/Cancel actions
  - Professional animations

### 3. **Engagement Features**

- **Like Button**: Toggle like/unlike with heart animation
- **Comment Button**: Expand/collapse comment section
- **Share Button**: Increment share count with toast notification
- Real-time engagement counters (likes, comments, shares)

### 4. **Comment System**

- View existing comments with author avatars
- Add new comments with inline input
- Send button or Enter key to post
- Expandable comment section with smooth animations

### 5. **Filtering**

- Filter bar with category buttons:
  - All Posts
  - Announcements
  - Tips
  - Updates
  - Questions
- Active filter highlighting
- Empty state when no posts match filter

### 6. **Community Stats**

- Three stat cards showing:
  - Community Members: 12,547
  - Active Discussions: 342
  - Posts This Week: 1,234
- Icon-based visual indicators

### 7. **User Types**

- **Company** (Blue badge): Fleet operators, logistics companies
- **Business** (Purple badge): Service providers, vendors
- **Professional** (Green badge): Independent drivers, freelancers

## File Structure

```
src/
├── app/company/feeds/
│   └── page.tsx                      # Main feeds page
├── components/company/
│   ├── FeedCard.tsx                  # Individual feed post card
│   └── CreatePostModal.tsx           # Post creation modal
└── lib/
    └── mockApi.ts                    # Feed data (communityFeeds)
```

## Data Structure

### FeedPost Interface

```typescript
interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
    userType: 'professional' | 'company' | 'business';
    company?: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  timeAgo: string;
  likes: number;
  shares: number;
  comments: Comment[];
  isLiked?: boolean;
  category?: 'Promotions' | 'tip' | 'services' | 'question' | 'general';
}
```

## Usage

### Accessing the Page

Navigate to: `/company/feeds`

### Creating a Post

1. Click "Create Post" button (desktop) or floating "+" button (mobile)
2. Type your content in the text area
3. (Optional) Click "Add Image" to add a demo image
4. Click "Post" to publish
5. Success toast appears, new post shows at top of feed

### Engaging with Posts

- **Like**: Click heart icon (fills red when liked)
- **Comment**: Click comment button to expand section, type and send
- **Share**: Click share icon (increments share count)

### Filtering Posts

Click any category button in the filter bar to show only posts of that type.

## Responsive Design

### Desktop (≥640px)

- Two-column stats layout
- Full text on action buttons
- Create Post button in header
- Category badges visible

### Mobile (<640px)

- Single column layout
- Icon-only action buttons
- Floating action button for creating posts
- Horizontal scrollable filter bar

## Animations

- **Page load**: Staggered fade-in for posts
- **Like**: Scale animation + color change
- **Comments**: Smooth height expand/collapse
- **Buttons**: Hover scale, tap scale
- **Toasts**: Slide down from top center
- **Images**: Hover zoom effect

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support (Enter to post comment)
- High contrast text and backgrounds
- Clear focus states

## Future Enhancements

1. **Real Image Upload**: Replace demo image selector with actual file upload
2. **Emoji Picker**: Add emoji selector for posts and comments
3. **Edit/Delete**: Allow users to edit or delete their own posts
4. **Reactions**: Add more reaction types (Love, Laugh, Insight)
5. **Notifications**: Real-time notifications for likes/comments
6. **Mentions**: @mention other users in posts and comments
7. **Hashtags**: Support for hashtag filtering
8. **Saved Posts**: Bookmark posts for later viewing
9. **Report/Flag**: Content moderation features
10. **Rich Media**: Support for videos, documents, polls

## Performance

- Lazy loading for images (Next.js Image component)
- Optimized animations (Framer Motion with GPU acceleration)
- Efficient state management (React hooks)
- Minimal re-renders with proper key usage

## Testing Checklist

- [ ] Create new post appears at top of feed
- [ ] Like button toggles correctly and updates count
- [ ] Comments can be added and displayed
- [ ] Share increments count and shows toast
- [ ] Filters work correctly for all categories
- [ ] Modal opens and closes smoothly
- [ ] Responsive layout works on all screen sizes
- [ ] Toasts appear and auto-dismiss
- [ ] Images load and display correctly
- [ ] Keyboard navigation works for comment input

## Notes

- Currently uses mock data from `communityFeeds` in `mockApi.ts`
- Posts are stored in component state (will reset on page reload)
- For production: integrate with backend API for persistence
- User info is hardcoded; replace with actual user session data
