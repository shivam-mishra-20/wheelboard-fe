// AI Service - Gemini & Groq Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  provider?: 'gemini' | 'groq';
}

// Gemini Configuration
const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

// System prompt for Wheelboard context
const WHEELBOARD_CONTEXT = `You are WheelBot, a friendly AI assistant for Wheelboard - a transportation and logistics platform. 

Wheelboard connects:
- **Professionals**: Drivers, operators (trips, earnings, jobs)
- **Companies**: Fleet managers (vehicles, drivers, operations)
- **Businesses**: Parts suppliers, service providers

Key Features:
- Trip & fleet management
- Job opportunities
- Earnings tracking
- Service listings
- Real-time SOS
- KYC verification

Response Style:
- Be conversational, warm, and helpful
- Keep responses concise (2-3 sentences max for simple queries)
- Use emojis occasionally for friendliness 😊
- For greetings, be brief and welcoming
- Ask follow-up questions to understand user needs
- Focus on actionable guidance

IMPORTANT: 
- Never provide numbered lists asking users to select
- Never say "You're a: (Select: Professional, Company, Business)"
- Instead, ask: "Are you a driver, a fleet manager, or a service provider?"
- Be natural and conversational, not formal or robotic`;

// Gemini Service - For complex queries, detailed responses
export async function queryGemini(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build conversation history
    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: WHEELBOARD_CONTEXT }],
        },
        {
          role: 'model',
          parts: [
            {
              text: "Hey there! 👋 I'm WheelBot, your Wheelboard assistant. How can I help you today?",
            },
          ],
        },
        ...chatHistory,
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.8,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
      provider: 'gemini',
    };
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get response from Gemini',
      provider: 'gemini',
    };
  }
}

// Groq Service - For fast, real-time responses
export async function queryGroq(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    // Format messages for Groq - include system message first
    const formattedMessages = [
      {
        role: 'system',
        content: WHEELBOARD_CONTEXT,
      },
      ...messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    ] as Array<{
      role: 'system' | 'assistant' | 'user';
      content: string;
    }>;

    const requestBody = {
      model: 'llama-3.1-8b-instant', // Using Llama 3.1 - fast and reliable
      messages: formattedMessages,
      max_tokens: 800,
      temperature: 0.8,
    };

    console.log('Groq request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('No response from Groq');
    }

    return {
      success: true,
      message: text,
      provider: 'groq',
    };
  } catch (error: unknown) {
    console.error('Groq API Error:', error);

    // Fallback to Gemini if Groq fails
    console.log('Falling back to Gemini...');
    return queryGemini(messages);
  }
}

// Smart router - Choose best provider based on query
export function selectProvider(message: string): 'gemini' | 'groq' {
  // Use Gemini for complex queries
  const complexPatterns = [
    /(explain|detail|analyze|compare|difference|recommendation)/i,
    /(step by step|tutorial|guide|process)/i,
    /(why|strategy|best practice)/i,
  ];

  const isComplexQuery = complexPatterns.some((pattern) =>
    pattern.test(message)
  );

  // Default to Groq for speed, Gemini for complexity
  return isComplexQuery ? 'gemini' : 'groq';
}

// Main query function
export async function queryChatbot(
  messages: ChatMessage[],
  preferredProvider?: 'gemini' | 'groq'
): Promise<ChatResponse> {
  const lastMessage = messages[messages.length - 1];
  const provider = preferredProvider || selectProvider(lastMessage.content);

  if (provider === 'gemini') {
    return queryGemini(messages);
  } else {
    return queryGroq(messages);
  }
}
