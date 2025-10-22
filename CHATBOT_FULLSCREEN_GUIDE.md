# WheelBot Fullscreen Mode 🚀

## Overview

WheelBot now features a beautiful fullscreen chatbot experience, similar to ChatGPT and Claude, with typing animations and a premium feel.

## Features

### 🎨 **ChatGPT-Like UI**

- **Full-screen interface** with clean, modern design
- **Gradient backgrounds** for visual appeal
- **Centered messages** with maximum 75% width for readability
- **Large avatars** with gradient backgrounds
- **Spacious layout** optimized for conversation flow

### ⌨️ **Typing Animation**

- **Character-by-character typing** at 20ms per character
- **Blinking cursor** during typing
- **Smooth appearance** of each message
- **Natural conversation feel**

### 🎯 **Interactive Elements**

- **Quick action buttons** contextually displayed
- **Smooth hover effects** on all interactive elements
- **Auto-expanding textarea** for message input
- **Keyboard shortcuts** (Enter to send)

### 📱 **Two Modes**

#### 1. **Mini Chat (Default)**

- Floating button in bottom-right corner
- Compact 420x650px window
- Perfect for quick questions
- **Fullscreen button** in header (expand icon)

#### 2. **Fullscreen Chat**

- Full-page immersive experience
- ChatGPT/Claude-like interface
- Better for longer conversations
- Clear chat and close buttons in header

## How to Use

### Opening the Chatbot

1. Click the **orange chat button** in the bottom-right corner
2. Mini chat window appears

### Switching to Fullscreen

1. In mini chat, click the **expand icon** (⛶) in the header
2. Fullscreen mode opens instantly
3. Previous conversation continues seamlessly

### Closing Fullscreen

- Click the **compress icon** (⛶) in the top-right
- Returns to homepage (mini chat closes)

### Interactive Buttons

- Click any **quick action button** for instant responses
- Buttons appear contextually based on conversation
- No API calls needed for button responses

### Manual Messages

- Type in the textarea at the bottom
- Press **Enter** to send (or click send button)
- AI responds with typing animation
- Uses Gemini or Groq based on query complexity

## Technical Details

### Components

- **`Chatbot.tsx`**: Main component with floating button + mini chat
- **`ChatbotFullscreen.tsx`**: Fullscreen chat experience

### Typing Animation

```typescript
// 20ms per character
typeMessage(text, callback);
// Shows blinking cursor during typing
// Calls callback when complete
```

### State Management

- **`isOpen`**: Controls mini chat visibility
- **`isFullscreen`**: Controls fullscreen mode
- **`isTyping`**: Shows typing animation
- **`typingText`**: Currently typed text

### Styling

- **Tailwind CSS** with custom gradients
- **Framer Motion** for animations
- **Responsive** textarea with auto-expand
- **Smooth transitions** throughout

## User Experience

### Mini Chat Flow

1. User clicks floating button
2. Mini chat opens
3. User sees quick actions
4. User clicks button or types message
5. Bot responds instantly (button) or with AI (typed)
6. User can expand to fullscreen anytime

### Fullscreen Flow

1. User clicks expand icon
2. Fullscreen opens with smooth animation
3. Previous conversation continues
4. Typing animation plays for new messages
5. Large, readable interface
6. User can clear chat or close

## Rate Limiting

- **10 messages/hour** for guests (both modes)
- **1000 messages/hour** for authenticated users
- **Badge shows remaining messages** in fullscreen header
- **Warning appears** at <5 messages remaining

## Best Practices

### When to Use Mini Chat

- Quick questions
- While browsing the site
- Single-topic queries

### When to Use Fullscreen

- Long conversations
- Complex queries
- Multiple related questions
- Better focus without distractions

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Esc**: (Future) Close fullscreen

## Future Enhancements

- [ ] Esc key to close fullscreen
- [ ] Save conversation history
- [ ] Export chat transcript
- [ ] Voice input support
- [ ] Markdown rendering in messages
- [ ] Code syntax highlighting
- [ ] File upload support
- [ ] Multi-language support

## Performance

- **Dynamic import** for fullscreen component (code splitting)
- **Optimized animations** at 60fps
- **Efficient re-renders** with React.memo (future)
- **Lazy loading** of messages (future for long chats)

## Accessibility

- **ARIA labels** on all buttons
- **Keyboard navigation** support
- **Screen reader friendly**
- **High contrast** text for readability
- **Focus management** on open/close

---

**Built with ❤️ for Wheelboard**
