# 🎨 Wheelboard AI Chatbot - Visual Guide

## 🖼️ UI Components

### **1. Floating Chat Button**

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│                                    ┌───┐│
│                                    │ 💬 ││  ← Orange gradient button
│                                    └───┘│     Click to open chat
│                                         │
└─────────────────────────────────────────┘
         Main Page Content
```

### **2. Open Chat Window**

```
┌────────────── WHEELBOT ──────────────┐
│  🤖 WheelBot         Guest Mode  [X]  │  ← Header (Orange gradient)
├───────────────────────────────────────┤
│  ⚠️ Messages: 7/10 | Login for more  │  ← Rate limit (Guests only)
├───────────────────────────────────────┤
│                                       │
│  🤖  Hello! I'm WheelBot...          │  ← Bot message
│      10:30 AM · gemini               │
│                                       │
│            How do I track trips?  👤 │  ← User message
│                      10:31 AM        │
│                                       │
│  🤖  To track trips, go to...        │  ← Bot response
│      10:31 AM · groq                 │
│                                       │
│  ⚪⚪⚪  Typing...                    │  ← Loading state
│                                       │
├───────────────────────────────────────┤
│  [Type your message...        ] [📤] │  ← Input field
└───────────────────────────────────────┘
```

## 🎨 Color Scheme

### **Primary Colors**

```
🟠 Orange #FF7A00     - Buttons, highlights, branding
⚫ Black #000000      - Headers, important text
⚪ Gray #808080       - Secondary text, borders
⚪ White #FFFFFF      - Backgrounds
```

### **Status Colors**

```
🟢 Success #10B981   - Successful actions
🔴 Error #EF4444     - Errors, warnings
🟡 Warning #F59E0B   - Rate limit warnings
🔵 Info #3B82F6      - Information badges
```

## 📱 Responsive Breakpoints

### **Desktop (lg+)**

```
┌─────────────────────────────────┐
│         Main Content            │
│                                 │
│                                 │
│                            ┌───┐│
│    Chat Window →           │💬 ││
│    400px × 600px           └───┘│
│    Fixed bottom-right           │
└─────────────────────────────────┘
```

### **Mobile (< 768px)**

```
┌──────────────┐
│   Content    │
│              │
│              │
│         ┌───┐│
│  Full   │💬 ││
│  Width  └───┘│
│   Chat       │
└──────────────┘
```

## 🔄 User Flow

### **Guest User Journey**

```
1. Visitor arrives
   ↓
2. Sees chat button (orange, bottom-right)
   ↓
3. Clicks to open
   ↓
4. Sees welcome + rate limit (10/10)
   ↓
5. Asks questions
   ↓
6. Rate limit decreases (9/10, 8/10...)
   ↓
7. Hits limit (0/10)
   ↓
8. Sees "Login for unlimited" prompt
   ↓
9. Either waits or logs in
```

### **Authenticated User Journey**

```
1. User logs in
   ↓
2. Sees chat button
   ↓
3. Clicks to open
   ↓
4. Sees "Unlimited Mode" badge
   ↓
5. Asks unlimited questions
   ↓
6. No rate limit warnings
```

## 🤖 AI Provider Selection

### **Decision Tree**

```
User sends message
        ↓
   ┌────┴────┐
   │ Analyze │
   └────┬────┘
        │
   ┌────┴─────────────────┐
   │                      │
Simple/Quick?        Complex/Detailed?
   │                      │
   ↓                      ↓
┌──────┐              ┌────────┐
│ GROQ │              │ GEMINI │
│ Fast │              │ Smart  │
└──┬───┘              └───┬────┘
   │                      │
   └──────────┬───────────┘
              ↓
        Response to user
```

### **Query Examples**

**→ Groq (Fast)**

```
✓ "What is Wheelboard?"
✓ "How do I login?"
✓ "Show me trips"
✓ "Find jobs"
✓ "List features"
```

**→ Gemini (Detailed)**

```
✓ "Explain fleet vs trip management"
✓ "Step-by-step guide for adding vehicles"
✓ "Compare subscription plans"
✓ "Analyze best hiring practices"
✓ "Why should I use this platform?"
```

## 🎭 Animation States

### **Button States**

```
Default:    🟠 Orange circle, 💬 icon
Hover:      🟠 Slightly larger, shadow grows
Click:      🟠 Shrinks slightly
Active:     🟠 Shows X icon instead of 💬
```

### **Window States**

```
Closed:     Hidden (opacity: 0, scale: 0.95)
Opening:    Fade in + scale up (200ms)
Open:       Fully visible (opacity: 1, scale: 1)
Closing:    Fade out + scale down (200ms)
```

### **Message States**

```
Sending:    User message appears instantly
Waiting:    Three bouncing dots (⚪⚪⚪)
Receiving:  Bot message slides in from left
Error:      Red message with retry option
```

## 📊 Component Structure

```
<Chatbot>
  │
  ├─ Floating Button
  │  ├─ Icon (💬 or ✕)
  │  └─ Animations
  │
  └─ Chat Window (when open)
     │
     ├─ Header
     │  ├─ Avatar & Title
     │  ├─ User Status Badge
     │  └─ Clear & Close Buttons
     │
     ├─ Rate Limit Bar (guests only)
     │  ├─ Message Counter
     │  └─ Login Link
     │
     ├─ Messages Container
     │  ├─ Welcome Message
     │  ├─ User Messages
     │  │  ├─ Avatar
     │  │  ├─ Content
     │  │  └─ Timestamp
     │  │
     │  └─ Bot Messages
     │     ├─ Avatar
     │     ├─ Content
     │     ├─ Timestamp
     │     └─ Provider Badge
     │
     ├─ Error Display (when error)
     │  └─ Error Message
     │
     └─ Input Area
        ├─ Text Input
        └─ Send Button
```

## 🎬 Interaction Examples

### **Example 1: Guest Hits Rate Limit**

```
┌─────────────── CHAT ───────────────┐
│ 🤖 WheelBot        Guest Mode   [X]│
├────────────────────────────────────┤
│ ⚠️ Messages: 0/10 | Login now!    │  ← Warning
├────────────────────────────────────┤
│ 🤖  Rate limit exceeded. Login    │
│     for unlimited messages or     │
│     try again at 11:45 AM         │
│                                    │
│ [Message input is disabled]    [📤]│  ← Disabled
└────────────────────────────────────┘
```

### **Example 2: Successful Conversation**

```
┌─────────────── CHAT ───────────────┐
│ 🤖 WheelBot      Unlimited      [X]│  ← Auth user
├────────────────────────────────────┤
│                                    │
│            How do I add a trip? 👤│
│                      2:30 PM       │
│                                    │
│ 🤖  To add a trip:                │
│     1. Go to Trips page           │
│     2. Click "Create Trip"        │
│     3. Fill in details            │
│     4. Assign a driver            │
│     5. Save and track!            │
│     2:30 PM · gemini              │  ← Provider
│                                    │
│ [Type your message...        ] [📤]│
└────────────────────────────────────┘
```

## 🎯 Key Visual Elements

### **Icons Used**

```
💬 - Chat button
✕  - Close button
🤖 - Bot avatar
👤 - User avatar
📤 - Send button
🔄 - Refresh/Clear
⚠️ - Warning/Rate limit
⚡ - Provider badge (Groq)
🧠 - Provider badge (Gemini)
```

### **Typography**

```
Headers:     Montserrat Bold, 18px
Body Text:   Poppins Regular, 14px
Timestamps:  Poppins Regular, 12px, Gray
Badges:      Poppins Medium, 10px
```

### **Spacing**

```
Padding (Chat Window):    24px
Message Spacing:          16px
Input Padding:            12px 16px
Button Padding:           10px
Border Radius (Window):   16px
Border Radius (Messages): 12px
Border Radius (Button):   50% (circle)
```

## 🔧 State Management

### **Component State**

```typescript
isOpen: boolean          // Chat window open/closed
messages: Message[]      // Conversation history
input: string           // Current input value
isLoading: boolean      // Waiting for AI response
rateLimitInfo: Object   // Rate limit data
error: string | null    // Error message
```

### **Message Object**

```typescript
{
  id: string,           // Unique identifier
  role: 'user' | 'assistant',
  content: string,      // Message text
  timestamp: number,    // Unix timestamp
  provider?: 'gemini' | 'groq'  // AI used
}
```

## 📱 Mobile Optimizations

```
┌──────────────┐
│ WheelBot  [X]│
├──────────────┤
│ 8/10  Login →│
├──────────────┤
│ Messages     │
│ scroll here  │
│              │
│              │
│              │
│              │
├──────────────┤
│ [Input] [📤] │
└──────────────┘

- Full width window
- Larger touch targets
- Bottom navigation safe
- Keyboard-aware
```

## ✨ Special Effects

### **Gradient Backgrounds**

```css
Chat Header:  linear-gradient(to right, #FF7A00, #E66D00)
Send Button:  linear-gradient(to right, #FF7A00, #FF8C1A)
Bot Message:  #F3F4F6 (solid gray)
User Message: linear-gradient(to right, #FF7A00, #E66D00)
```

### **Shadow Effects**

```css
Chat Window:  0 10px 40px rgba(0,0,0,0.15)
Button:       0 4px 15px rgba(255,122,0,0.3)
Button Hover: 0 6px 20px rgba(255,122,0,0.4)
```

### **Transitions**

```css
Window Open:     200ms ease-out
Button Hover:    150ms ease
Message Appear:  200ms ease-out
Input Focus:     150ms ease
```

---

**This visual guide helps you understand the chatbot's design and user experience!** 🎨✨

For implementation details, see `IMPLEMENTATION_SUMMARY.md`
For setup instructions, see `CHATBOT_SETUP.md`
For full documentation, see `CHATBOT_DOCUMENTATION.md`
