# 🤖 Wheelboard AI Chatbot - Quick Setup Guide

## ✅ What's Been Created

Your Wheelboard platform now has a fully functional AI chatbot with:

### 📂 **Files Created**

1. **`src/lib/aiService.ts`** - Gemini & Groq API integration
2. **`src/lib/rateLimiter.ts`** - Rate limiting logic
3. **`src/app/api/chat/route.ts`** - API endpoint
4. **`src/components/Chatbot.tsx`** - Chat UI component
5. **`.env.example`** - Environment variables template
6. **`CHATBOT_DOCUMENTATION.md`** - Full documentation

### 🎯 **Features Implemented**

- ✨ Dual AI providers (Gemini for complex queries, Groq for speed)
- 🔒 Rate limiting (10 msg/hr guests, 1000 msg/hr authenticated)
- 💬 Real-time chat interface with Wheelboard branding
- 📊 Rate limit tracking and display
- 🎨 Framer Motion animations
- 📱 Mobile-responsive design
- 🔄 Smart provider selection based on query complexity

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get API Keys

#### **Gemini API Key** (Free)

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

#### **Groq API Key** (Free)

1. Visit: https://console.groq.com/
2. Sign up / Login
3. Go to "API Keys" section
4. Create new key
5. Copy the key (starts with `gsk_...`)

### Step 2: Create `.env.local` File

Create a file named `.env.local` in your project root:

```bash
# AI API Keys
GEMINI_API_KEY=AIza_paste_your_actual_gemini_key_here
GROQ_API_KEY=gsk_paste_your_actual_groq_key_here

# Rate Limiting (optional - these are defaults)
NEXT_PUBLIC_GUEST_MESSAGE_LIMIT=10
NEXT_PUBLIC_RATE_limit_WINDOW=3600000

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run the App

```bash
npm run dev
```

Open http://localhost:3000 and click the orange chat button in the bottom-right corner! 🎉

---

## 📖 How It Works

### **For Guest Users** (Not Logged In)

- ⏱️ **10 messages per hour**
- 🔔 Rate limit counter shown in chat
- 💡 Prompt to login for unlimited access

### **For Authenticated Users** (Logged In)

- ✅ **1000 messages per hour** (virtually unlimited)
- 🚀 No rate limit warnings
- 🎯 Full chatbot features

### **AI Provider Selection**

The chatbot automatically chooses the best AI:

- **Groq (Mixtral)**: Quick queries, simple questions → ⚡ Fast responses
- **Gemini**: Complex analysis, detailed explanations → 🧠 Smart responses

---

## 🎨 UI Features

### **Floating Chat Button**

- Bottom-right corner
- Wheelboard orange gradient
- Smooth animations
- Open/close with icon transition

### **Chat Window**

- 400px wide, 600px tall
- Wheelboard branding (Orange #FF7A00)
- Message timestamps
- AI provider badges
- Typing indicators
- Error handling

### **Rate Limit Display** (Guests Only)

```
Messages: 7/10  |  Login for unlimited
```

---

## 🧪 Testing

### **Test as Guest**

1. Open http://localhost:3000
2. Click chat button
3. Send messages
4. Watch rate limit counter decrease

### **Test as Authenticated User**

1. Login with demo account:
   - Email: `sarah@mining.com`
   - Password: `password123`
2. Click chat button
3. Unlimited messaging!

### **Test Different Queries**

**Fast Queries (uses Groq):**

```
- "What is Wheelboard?"
- "How do I track trips?"
- "Show me my earnings"
```

**Complex Queries (uses Gemini):**

```
- "Explain the difference between fleet management and trip management"
- "Give me step-by-step instructions for hiring a driver"
- "Analyze the best practices for logistics operations"
```

---

## 🎯 Example Conversations

### **General Help**

**User:** "What can you help me with?"

**WheelBot:** "I can assist with platform features, trip management, fleet operations, earnings tracking, and more! What would you like to know?"

### **Feature Guidance**

**User:** "How do I add a new vehicle?"

**WheelBot:** "To add a new vehicle: 1) Go to Fleet page, 2) Click 'Add Vehicle', 3) Fill in details (make, model, VIN), 4) Upload documents, 5) Save!"

### **Role-Specific Help**

**User:** "I'm a company, how do I hire drivers?"

**WheelBot:** "As a company, you can: 1) Navigate to Professionals page, 2) Browse available drivers, 3) Post job listings, 4) Review applications, 5) Hire through the platform!"

---

## ⚙️ Configuration

### **Adjust Rate Limits**

Edit `src/app/api/chat/route.ts`:

```typescript
const GUEST_LIMIT = 20; // Change from 10 to 20
const AUTH_LIMIT = 2000; // Change from 1000 to 2000
const WINDOW_MS = 30 * 60 * 1000; // Change to 30 minutes
```

### **Change Welcome Message**

Edit `src/components/Chatbot.tsx`:

```typescript
content: `Your custom welcome message here!`,
```

### **Customize System Prompt**

Edit `WHEELBOARD_CONTEXT` in `src/lib/aiService.ts` to customize the AI's knowledge and personality.

---

## 🔧 Troubleshooting

### **Chat button not appearing?**

- Check that `<Chatbot />` is added to `src/app/page.tsx`
- Verify no console errors

### **"API key not configured" error?**

- Ensure `.env.local` exists
- Check key format (Gemini: `AIza...`, Groq: `gsk_...`)
- Restart dev server: `npm run dev`

### **Rate limit not working?**

- Clear browser localStorage
- Check browser console for errors
- Verify rate limit constants in code

### **AI not responding?**

- Check API keys are valid
- Verify network connection
- Check browser console for API errors
- Ensure you have API quota remaining

---

## 📦 Dependencies

All required dependencies are already installed:

- ✅ `@google/generative-ai` - Gemini SDK
- ✅ `framer-motion` - Animations
- ✅ `react-icons` - Icons

---

## 🎨 Customization Ideas

1. **Change Colors**: Update Tailwind classes in `Chatbot.tsx`
2. **Add Voice**: Integrate Web Speech API
3. **Save History**: Store conversations in Firebase
4. **Add Avatars**: Custom user/bot avatars
5. **Multilingual**: Add language detection/translation

---

## 📚 Full Documentation

See `CHATBOT_DOCUMENTATION.md` for:

- Complete API reference
- Production deployment guide
- Advanced customization
- Security best practices

---

## 🎉 You're All Set!

Your AI chatbot is ready to use! Users can now get instant help with:

- Platform navigation
- Feature explanations
- Trip & fleet management
- Job searching & hiring
- Earnings & expenses
- And much more!

**Happy chatting!** 🚀💬

---

## 💡 Need Help?

- Check `CHATBOT_DOCUMENTATION.md` for detailed docs
- Review code comments in the source files
- Test with different user types (guest vs authenticated)
- Experiment with different query types
