'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaCompress,
  FaTrash,
} from 'react-icons/fa';
import { api } from '@/lib/apiAdapter';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  buttons?: ActionButton[];
}

interface ActionButton {
  label: string;
  action: string;
  icon?: string;
}

interface RateLimitInfo {
  remaining: number;
  total: number;
  resetTime?: number;
}

const QUICK_ACTIONS = {
  userType: [
    {
      label: '👷 Professional (Driver/Operator)',
      action: 'professional',
      icon: '👷',
    },
    { label: '🏢 Company (Fleet Manager)', action: 'company', icon: '🏢' },
    {
      label: '🔧 Business (Service Provider)',
      action: 'business',
      icon: '🔧',
    },
  ],
  professional: [
    { label: '🚗 Find Jobs', action: 'find_jobs', icon: '🚗' },
    { label: '💰 Track Earnings', action: 'track_earnings', icon: '💰' },
    { label: '📋 My Trips', action: 'my_trips', icon: '📋' },
    { label: '🆘 SOS Help', action: 'sos_help', icon: '🆘' },
  ],
  company: [
    { label: '🚛 Manage Fleet', action: 'manage_fleet', icon: '🚛' },
    { label: '👥 Hire Drivers', action: 'hire_drivers', icon: '👥' },
    { label: '📊 View Analytics', action: 'view_analytics', icon: '📊' },
    { label: '🔐 KYC Verification', action: 'kyc_verify', icon: '🔐' },
  ],
  business: [
    { label: '📝 List Services', action: 'list_services', icon: '📝' },
    { label: '🔍 Find Clients', action: 'find_clients', icon: '🔍' },
    { label: '💼 My Services', action: 'my_services', icon: '💼' },
    { label: '📞 Support', action: 'support', icon: '📞' },
  ],
  general: [
    { label: '❓ How it works', action: 'how_it_works', icon: '❓' },
    { label: '💳 Pricing', action: 'pricing', icon: '💳' },
    { label: '📱 Download App', action: 'download_app', icon: '📱' },
    { label: '🔙 Back to start', action: 'restart', icon: '🔙' },
  ],
};

const ACTION_RESPONSES: Record<string, string> = {
  professional:
    'Great! As a Professional (Driver/Operator), Wheelboard helps you find jobs, track earnings, and manage trips. What would you like to do?',
  company:
    'Perfect! As a Company/Fleet Manager, you can manage your entire fleet, hire drivers, and track operations. How can I assist you?',
  business:
    'Excellent! As a Business/Service Provider, you can list your services, find clients, and grow your business. What do you need help with?',
  find_jobs:
    "🚗 To find jobs:\n1. Open the Wheelboard app\n2. Go to 'Jobs' section\n3. Browse available trips\n4. Apply with one tap!\n\nYou'll see job details, earnings, and distance. Want to know more about earnings?",
  track_earnings:
    "💰 Track your earnings easily:\n• View daily, weekly, monthly reports\n• See pending and completed payments\n• Export statements for taxes\n• Real-time trip earnings\n\nAll in the 'Earnings' tab! Need help setting up payments?",
  my_trips:
    "📋 Manage your trips:\n• Active trips with live tracking\n• Upcoming scheduled jobs\n• Trip history and ratings\n• Upload trip documents\n\nCheck the 'Trips' section in your dashboard!",
  sos_help:
    '🆘 Emergency SOS:\n1. Tap the SOS button in app\n2. Share live location\n3. Contact emergency services\n4. Alert Wheelboard support\n\nYour safety is our priority! Available 24/7.',
  manage_fleet:
    "🚛 Fleet Management:\n• Track all vehicles in real-time\n• Assign drivers to vehicles\n• Monitor fuel and maintenance\n• View route history\n\nGo to 'Fleet Dashboard' to get started!",
  hire_drivers:
    '👥 Hiring drivers is easy:\n1. Post job requirements\n2. Review verified profiles\n3. Check ratings & experience\n4. Hire with one click!\n\nAll drivers are KYC-verified. Want to post a job now?',
  view_analytics:
    "📊 Analytics Dashboard shows:\n• Fleet utilization rates\n• Driver performance metrics\n• Revenue and costs\n• Trip completion rates\n\nMake data-driven decisions! Available in 'Analytics' section.",
  kyc_verify:
    "🔐 KYC Verification:\n1. Upload ID proof & documents\n2. Verify contact details\n3. Get verified badge\n4. Build trust with clients\n\nVerified accounts get priority! Start verification in 'Profile'.",
  list_services:
    "📝 List your services:\n1. Go to 'Services' section\n2. Add service details & photos\n3. Set pricing & availability\n4. Get discovered by clients!\n\nStart getting inquiries today!",
  find_clients:
    "🔍 Find clients:\n• Browse service requests\n• Bid on projects\n• Build your reputation\n• Get recurring business\n\nCheck 'Opportunities' for active requests!",
  my_services:
    "💼 Manage your services:\n• Edit service listings\n• View inquiries & quotes\n• Track active projects\n• See customer reviews\n\nAll in your 'Business Dashboard'!",
  support:
    "📞 Get support:\n• 24/7 chat support\n• Email: support@wheelboard.com\n• Call: +1-XXX-XXX-XXXX\n• Help center & FAQs\n\nWe're here to help! What's your concern?",
  how_it_works:
    "❓ How Wheelboard works:\n\n1️⃣ Sign up (Professional/Company/Business)\n2️⃣ Complete KYC verification\n3️⃣ Access your dashboard\n4️⃣ Start managing trips, fleet, or services\n\nIt's that simple! What would you like to explore?",
  pricing:
    '💳 Wheelboard Pricing:\n\n• Professionals: FREE (small commission per trip)\n• Companies: Starting at $99/month\n• Businesses: FREE listing (commission on inquiries)\n\nNo hidden fees! Want to sign up?',
  download_app:
    '📱 Download Wheelboard:\n\n• iOS: App Store\n• Android: Google Play\n• Web: wheelboard.com\n\nAvailable on all platforms! Need help getting started?',
  restart:
    "🔄 Let's start over! I'm WheelBot, your Wheelboard assistant. Are you a Professional, Company, or Business?",
};

interface ChatbotFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotFullscreen({
  isOpen,
  onClose,
}: ChatbotFullscreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey there! 👋 I'm WheelBot, your Wheelboard AI assistant. I'm here to help you navigate through our platform. How can I assist you today?",
      timestamp: Date.now(),
      buttons: QUICK_ACTIONS.userType,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [currentContext, setCurrentContext] = useState<string>('userType');
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Enhanced typing animation effect - faster and more natural
  const typeMessage = (text: string, callback: () => void) => {
    setIsTyping(true);
    setTypingText('');

    // Split by words for more natural typing
    const words = text.split(' ');
    let wordIndex = 0;
    let charIndex = 0;
    let currentText = '';

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        const currentWord = words[wordIndex];

        if (charIndex < currentWord.length) {
          // Type characters within a word quickly
          currentText += currentWord[charIndex];
          setTypingText(currentText);
          charIndex++;
        } else {
          // Add space after word (except for last word)
          if (wordIndex < words.length - 1) {
            currentText += ' ';
            setTypingText(currentText);
          }
          wordIndex++;
          charIndex = 0;
        }
      } else {
        clearInterval(interval);
        setIsTyping(false);
        callback();
      }
    }, 12); // Even faster: 12ms per character (was 15ms)

    return () => clearInterval(interval);
  };
  const handleButtonClick = async (action: string) => {
    const response = ACTION_RESPONSES[action];

    if (response) {
      const buttonLabels: Record<string, string> = {
        professional: '👷 Professional (Driver/Operator)',
        company: '🏢 Company (Fleet Manager)',
        business: '🔧 Business (Service Provider)',
        find_jobs: '🚗 Find Jobs',
        track_earnings: '💰 Track Earnings',
        my_trips: '📋 My Trips',
        sos_help: '🆘 SOS Help',
        manage_fleet: '🚛 Manage Fleet',
        hire_drivers: '👥 Hire Drivers',
        view_analytics: '📊 View Analytics',
        kyc_verify: '🔐 KYC Verification',
        list_services: '📝 List Services',
        find_clients: '🔍 Find Clients',
        my_services: '💼 My Services',
        support: '📞 Support',
        how_it_works: '❓ How it works',
        pricing: '💳 Pricing',
        download_app: '📱 Download App',
        restart: '🔙 Back to start',
      };

      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: buttonLabels[action] || action,
          timestamp: Date.now(),
        },
      ]);

      // Determine next set of buttons
      let nextButtons: ActionButton[] = QUICK_ACTIONS.general;

      if (action === 'professional') {
        nextButtons = [...QUICK_ACTIONS.professional, ...QUICK_ACTIONS.general];
        setCurrentContext('professional');
      } else if (action === 'company') {
        nextButtons = [...QUICK_ACTIONS.company, ...QUICK_ACTIONS.general];
        setCurrentContext('company');
      } else if (action === 'business') {
        nextButtons = [...QUICK_ACTIONS.business, ...QUICK_ACTIONS.general];
        setCurrentContext('business');
      } else if (action === 'restart') {
        nextButtons = QUICK_ACTIONS.userType;
        setCurrentContext('userType');
      }

      // Add bot response with typing animation
      setTimeout(() => {
        typeMessage(response, () => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: response,
              timestamp: Date.now(),
              buttons: nextButtons,
            },
          ]);
          setTypingText('');
        });
      }, 500);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const user = api.getCurrentUser();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Update rate limit info
      setRateLimit({
        remaining: parseInt(
          response.headers.get('X-RateLimit-Remaining') || '0'
        ),
        total: parseInt(response.headers.get('X-RateLimit-Limit') || '10'),
        resetTime: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
      });

      // Determine appropriate buttons
      let contextButtons = QUICK_ACTIONS.general;
      if (
        currentContext &&
        QUICK_ACTIONS[currentContext as keyof typeof QUICK_ACTIONS]
      ) {
        contextButtons = [
          ...(QUICK_ACTIONS[currentContext as keyof typeof QUICK_ACTIONS] ||
            []),
          ...QUICK_ACTIONS.general,
        ];
      }

      // Type the response with animation
      typeMessage(data.message, () => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.message,
            timestamp: Date.now(),
            buttons: contextButtons,
          },
        ]);
        setTypingText('');
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg =
        error instanceof Error
          ? `❌ ${error.message}`
          : '❌ Sorry, something went wrong. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMsg,
          timestamp: Date.now(),
          buttons: QUICK_ACTIONS.general,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hey there! 👋 I'm WheelBot, your Wheelboard AI assistant. I'm here to help you navigate through our platform. How can I assist you today?",
        timestamp: Date.now(),
        buttons: QUICK_ACTIONS.userType,
      },
    ]);
    setCurrentContext('userType');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-gray-50 via-white to-orange-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
            <FaRobot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              WheelBot AI Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Powered by Gemini & Groq • Always ready to help
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Rate Limit Badge */}
          {rateLimit && (
            <div className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
              💬 {rateLimit.remaining}/{rateLimit.total} messages
            </div>
          )}

          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
            title="Clear chat"
          >
            <FaTrash size={18} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600"
            title="Close fullscreen"
          >
            <FaCompress size={20} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-md">
                  <FaRobot size={20} className="text-white" />
                </div>
              )}

              <div
                className={`flex max-w-[75%] flex-col ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-6 py-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line text-base leading-relaxed">
                    {message.content}
                  </p>
                </div>

                {/* Action Buttons */}
                {message.buttons && message.buttons.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.buttons.map((button, btnIndex) => (
                      <motion.button
                        key={btnIndex}
                        onClick={() => handleButtonClick(button.action)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                        disabled={isLoading || isTyping}
                      >
                        {button.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                <p className="mt-2 px-2 text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shadow-md">
                  <FaUser size={18} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator with Animation */}
          {(isTyping || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-md">
                <FaRobot size={20} className="text-white" />
              </div>
              <div className="max-w-[75%]">
                <div className="rounded-2xl bg-white px-6 py-4 shadow-md">
                  {isTyping && typingText ? (
                    <div className="flex items-start">
                      <p className="whitespace-pre-line text-base leading-relaxed text-gray-800">
                        {typingText}
                      </p>
                      <span className="typing-cursor ml-0.5 mt-0.5 inline-block h-5 w-[2px] bg-orange-500" />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div
                        className="h-3 w-3 animate-bounce rounded-full bg-orange-500"
                        style={{
                          animationDelay: '0ms',
                          animationDuration: '0.6s',
                        }}
                      />
                      <div
                        className="h-3 w-3 animate-bounce rounded-full bg-orange-500"
                        style={{
                          animationDelay: '100ms',
                          animationDuration: '0.6s',
                        }}
                      />
                      <div
                        className="h-3 w-3 animate-bounce rounded-full bg-orange-500"
                        style={{
                          animationDelay: '200ms',
                          animationDuration: '0.6s',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end gap-3 rounded-2xl border border-gray-300 bg-white p-2 shadow-sm focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              disabled={isLoading || isTyping}
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed"
              style={{
                minHeight: '48px',
                maxHeight: '128px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || isTyping}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            WheelBot can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
