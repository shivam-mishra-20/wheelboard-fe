// Chat API Route - Handle chatbot queries with rate limiting
import { NextRequest, NextResponse } from 'next/server';
import { queryChatbot, ChatMessage } from '@/lib/aiService';
import { checkRateLimit, getClientIP } from '@/lib/rateLimiter';

// Rate limit configuration
const GUEST_LIMIT = 10; // 10 messages per hour for guests
const AUTH_LIMIT = 1000; // 1000 messages per hour for authenticated users
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userId, provider } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const identifier = userId || getClientIP(request);
    const limit = userId ? AUTH_LIMIT : GUEST_LIMIT;
    const rateLimitResult = checkRateLimit(identifier, limit, WINDOW_MS);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          rateLimitExceeded: true,
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Query the chatbot
    const response = await queryChatbot(messages as ChatMessage[], provider);

    // Return response with rate limit headers
    return NextResponse.json(response, {
      status: response.success ? 200 : 500,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    });
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
