'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaExpand,
} from 'react-icons/fa';
import { mockAPI } from '@/lib/mockApi';
import dynamic from 'next/dynamic';

const ChatbotFullscreen = dynamic(() => import('./ChatbotFullscreen'), {
  ssr: false,
});

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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey there! 👋 I'm WheelBot. Welcome to Wheelboard! How can I help you today?",
      timestamp: Date.now(),
      buttons: QUICK_ACTIONS.userType,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [currentContext, setCurrentContext] = useState<string>('userType');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleButtonClick = async (action: string) => {
    const response = ACTION_RESPONSES[action];

    if (response) {
      // Add user's button click as message
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

      // Add bot response with buttons
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response,
            timestamp: Date.now(),
            buttons: nextButtons,
          },
        ]);
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
      const user = mockAPI.getCurrentUser();
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

      // Determine appropriate buttons based on context
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

      const botMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        buttons: contextButtons,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error instanceof Error
              ? `❌ ${error.message}`
              : '❌ Sorry, something went wrong. Please try again.',
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

  return (
    <>
      {/* Fullscreen Chatbot */}
      <ChatbotFullscreen
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaComments size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 flex h-[650px] w-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <FaRobot size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">WheelBot</h3>
                  <p className="text-xs text-white/80">
                    Always here to help 🚀
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsFullscreen(true);
                    setIsOpen(false);
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-white/20"
                  aria-label="Open fullscreen"
                  title="Open fullscreen mode"
                >
                  <FaExpand size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Rate Limit Info */}
            {rateLimit && rateLimit.remaining < 5 && (
              <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-xs text-yellow-800">
                ⚠️ {rateLimit.remaining} messages remaining. Sign in for
                unlimited access.
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <FaUser size={14} />
                    ) : (
                      <FaRobot size={14} />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="max-w-[75%] flex-1">
                    <div
                      className={`rounded-2xl p-3 ${
                        message.role === 'user'
                          ? 'rounded-tr-none bg-orange-500 text-white'
                          : 'rounded-tl-none bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {message.buttons && message.buttons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.buttons.map((button, btnIndex) => (
                          <button
                            key={btnIndex}
                            onClick={() => handleButtonClick(button.action)}
                            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
                            disabled={isLoading}
                          >
                            {button.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="mt-1 px-1 text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300">
                    <FaRobot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-orange-500 p-3 text-white transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                  aria-label="Send message"
                >
                  <FaPaperPlane size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">
                Powered by Gemini & Groq AI ⚡
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
