# Wheelboard AI Chatbot Documentation

## Overview

Wheelboard now includes an intelligent AI chatbot powered by **Google Gemini** and **Groq** APIs. The chatbot provides context-aware assistance for transportation and logistics operations.

## Features

### 🤖 Dual AI Providers

- **Gemini**: For complex queries, detailed explanations, and strategic advice
- **Groq (Mixtral)**: For fast responses, quick queries, and real-time assistance
- **Smart Routing**: Automatically selects the best provider based on query complexity

### 🔒 Rate Limiting

- **Guest Users**: 10 messages per hour
- **Authenticated Users**: 1000 messages per hour (virtually unlimited)
- **Headers**: Rate limit info included in response headers

### 💬 Chat Features

- Persistent conversation history (per session)
- Real-time typing indicators
- Message timestamps
- Provider indicators (Gemini/Groq badges)
- Error handling and recovery
- Clear chat history option

### 🎨 UI/UX

- Floating chat button (bottom-right corner)
- Smooth animations with Framer Motion
- Wheelboard brand colors (Orange #FF7A00)
- Mobile-responsive design
- Rate limit warnings for guests
- Login prompts for unlimited access

## Setup Instructions

### 1. Get API Keys

#### Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

#### Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for an account
3. Navigate to API Keys
4. Create a new key
5. Copy the key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# AI API Keys
GEMINI_API_KEY=AIza...your_actual_gemini_key
GROQ_API_KEY=gsk_...your_actual_groq_key

# Rate Limiting (optional, defaults shown)
NEXT_PUBLIC_GUEST_MESSAGE_LIMIT=10
NEXT_PUBLIC_RATE_LIMIT_WINDOW=3600000

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install @google/generative-ai
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Test the Chatbot

1. Open [http://localhost:3000](http://localhost:3000)
2. Click the floating chat button (bottom-right corner)
3. Start chatting!

**Demo accounts for testing authenticated mode:**

- Professional: `sarah@mining.com` / `password123`
- Company: `john@transport.com` / `password123`
- Business: `mike@parts.com` / `password123`

## API Routes

### POST `/api/chat`

Send messages to the chatbot.

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "How do I track my trips?",
      "timestamp": 1698765432000
    }
  ],
  "userId": "optional-user-id",
  "provider": "gemini" // optional: 'gemini' or 'groq'
}
```

**Response:**

```json
{
  "success": true,
  "message": "To track your trips...",
  "provider": "gemini"
}
```

**Rate Limit Headers:**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1698769032000
```

## File Structure

```
src/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # API route handler
├── lib/
│   ├── aiService.ts              # Gemini & Groq integration
│   └── rateLimiter.ts            # Rate limiting logic
└── components/
    └── Chatbot.tsx               # Chat UI component
```

## Customization

### Modify System Prompt

Edit `WHEELBOARD_CONTEXT` in `src/lib/aiService.ts`:

```typescript
const WHEELBOARD_CONTEXT = `You are WheelBot...`;
```

### Adjust Rate Limits

Edit values in `src/app/api/chat/route.ts`:

```typescript
const GUEST_LIMIT = 10; // Messages per hour for guests
const AUTH_LIMIT = 1000; // Messages per hour for authenticated users
const WINDOW_MS = 60 * 60 * 1000; // 1 hour window
```

### Change Provider Selection Logic

Edit `selectProvider` function in `src/lib/aiService.ts`:

```typescript
export function selectProvider(message: string): 'gemini' | 'groq' {
  // Add your custom logic here
  const complexPatterns = [/(explain|detail|analyze)/i];
  // ...
}
```

### Customize Chat UI

Edit `src/components/Chatbot.tsx` for:

- Colors and styling
- Button position
- Window size
- Animation effects

## Production Deployment

### 1. Environment Variables

Add environment variables to your deployment platform:

**Vercel:**

```bash
vercel env add GEMINI_API_KEY
vercel env add GROQ_API_KEY
```

**Other platforms:** Use their respective environment variable configuration.

### 2. Rate Limiting

For production, consider using **Redis** instead of in-memory storage:

```typescript
// src/lib/rateLimiter.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
) {
  // Use Redis for distributed rate limiting
  const key = `rate-limit:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, Math.floor(windowMs / 1000));
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    // ...
  };
}
```

### 3. Monitoring

Add logging and monitoring:

```typescript
// Log API usage
console.log(`Chat request from ${userId || ip} - Provider: ${provider}`);

// Track errors
if (!response.success) {
  console.error('Chat error:', response.error);
}
```

## Troubleshooting

### API Key Issues

**Error:** "Gemini API key not configured"

- **Solution:** Ensure `GEMINI_API_KEY` is set in `.env.local`
- Check for typos in the key
- Restart the dev server after adding the key

### Rate Limit Issues

**Error:** "Rate limit exceeded"

- **Solution for guests:** Login for unlimited messages
- **Solution for testing:** Clear browser localStorage
- Adjust rate limits in development if needed

### No Response from AI

**Check:**

1. API keys are valid
2. Network connection is stable
3. Check browser console for errors
4. Verify API quotas haven't been exceeded

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Best Practices

1. **API Key Security**
   - Never commit `.env.local` to version control
   - Use environment variables in production
   - Rotate keys periodically

2. **Rate Limiting**
   - Implement proper rate limiting to control costs
   - Use Redis for distributed systems
   - Monitor API usage regularly

3. **Error Handling**
   - Always handle API failures gracefully
   - Provide helpful error messages to users
   - Log errors for debugging

4. **User Experience**
   - Keep responses concise and helpful
   - Show loading indicators
   - Provide clear rate limit information

## Support

For issues or questions:

1. Check this documentation
2. Review the code comments
3. Check Gemini/Groq documentation
4. Create an issue in the repository

## License

This chatbot integration is part of the Wheelboard platform.
