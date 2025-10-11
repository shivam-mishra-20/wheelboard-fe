'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Zap,
  Crown,
  Building2,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: PlanFeature[];
  buttonText: string;
  buttonStyle: string;
  recommended?: boolean;
  priceValue: number;
}

interface FAQ {
  question: string;
  answer: string;
}

const SubscriptionsPage = () => {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹2,999',
      period: '/month',
      priceValue: 2999,
      description: 'Perfect for individuals starting out.',
      icon: <Zap className="h-6 w-6 text-primary-500" />,
      features: [
        { text: '10 Listings', included: true },
        { text: '5 GB Storage', included: true },
        { text: '24 / 7 Support', included: true },
        { text: 'Custom Branding', included: false },
        { text: 'Unlimited Post Creation', included: false },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle:
        'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg',
      recommended: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹4,999',
      period: '/month',
      priceValue: 4999,
      description: 'Best suited for growing businesses.',
      icon: <Crown className="h-6 w-6 text-blue-500" />,
      features: [
        { text: '50 Listings', included: true },
        { text: 'Unlimited Post Creation', included: true },
        { text: '15 GB Storage', included: true },
        { text: '24 / 7 Support', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'Website Listing', included: false },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle: 'bg-blue-500 text-white hover:bg-blue-600',
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹9,999',
      period: '/month',
      priceValue: 9999,
      description: 'For very large enterprises.',
      icon: <Building2 className="h-6 w-6 text-purple-500" />,
      features: [
        { text: 'Unlimited Listings', included: true },
        { text: 'Unlimited Post Creation', included: true },
        { text: 'Unlimited Storage', included: true },
        { text: '24 / 7 Priority Support', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'Website Listing', included: true },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle: 'bg-purple-500 text-white hover:bg-purple-600',
      recommended: false,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: 'How do I upgrade a guidance about subscriptions?',
      answer:
        'You can upgrade your subscription at any time from your account dashboard. Navigate to Subscription Plans, select your desired plan, and complete the payment process. Your new features will be available immediately.',
    },
    {
      question: 'Can I change my plan anytime?',
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the credit will be applied to your next billing cycle.",
    },
    {
      question: 'Is there a free trial available?',
      answer:
        "We offer a 14-day free trial for the Pro plan. No credit card required. You can explore all Pro features and decide if it's right for your business.",
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, and digital wallets. All payments are processed securely through our payment gateway.',
    },
    {
      question: 'Do you offer discounts for annual subscriptions?',
      answer:
        'Yes! Annual subscriptions come with a 20% discount compared to monthly billing. You can switch to annual billing from your account settings and save significantly.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer:
        "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again.",
    },
    {
      question: 'Is customer support included?',
      answer:
        'All plans include 24/7 customer support. Pro and Enterprise plans get priority support with faster response times and dedicated account managers for Enterprise customers.',
    },
  ];

  const handleSubscribe = (planId: string) => {
    // Handle subscription logic here
    console.log(`Subscribing to plan: ${planId}`);
    // In production, this would integrate with a payment gateway
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Subscription Plans
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose the perfect plan for your business needs. Upgrade, downgrade,
            or cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl ${
                plan.recommended ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute right-0 top-0">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-1 text-xs font-semibold text-white">
                    RECOMMENDED
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Icon & Name */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      plan.id === 'starter'
                        ? 'bg-primary-50'
                        : plan.id === 'pro'
                          ? 'bg-blue-50'
                          : 'bg-purple-50'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                {/* Description */}
                <p className="mb-6 text-sm text-gray-600">{plan.description}</p>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`mb-6 w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-50">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                          <X className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* View Details Link */}
                <div className="mt-6 text-center">
                  <button className="text-sm font-medium text-primary-500 hover:text-primary-600">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Frequently Asked Questions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mb-12 max-w-7xl"
        >
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mb-8 text-center text-gray-600">
            Everything you need to know about our subscription plans
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="overflow-hidden rounded-xl bg-white shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100 px-6 pb-6 pt-4"
                  >
                    <p className="pl-8 text-sm leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-center shadow-xl"
        >
          <h3 className="mb-3 text-2xl font-bold text-white">
            Still have questions?
          </h3>
          <p className="mb-6 text-primary-100">
            Our team is here to help you choose the right plan for your business
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 transition-all hover:bg-gray-50">
              Contact Sales
            </button>
            <button className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-primary-600">
              Schedule a Demo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
