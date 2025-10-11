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
      period: '/year',
      priceValue: 2999,
      description: 'Perfect for small fleets getting started',
      icon: <Zap className="h-6 w-6 text-primary-500" />,
      features: [
        { text: 'Up to 10 vehicles', included: true },
        { text: '15 Trips Creation', included: true },
        { text: '20 Job Posts', included: true },
        { text: '20 Hirings', included: true },
        { text: 'Unlimited Post creation', included: true },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle:
        'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg',
      recommended: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹4,999',
      period: '/year',
      priceValue: 4999,
      description: 'Ideal for growing businesses with medium fleets',
      icon: <Crown className="h-6 w-6 text-blue-500" />,
      features: [
        { text: 'Up to 50 vehicles', included: true },
        { text: '25 Trips Creation', included: true },
        { text: '50 Job Posts', included: true },
        { text: 'Priority support', included: true },
        { text: '30 Hirings', included: true },
        { text: 'Unlimited Post Creations', included: true },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle:
        'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg',
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹9,999',
      period: '/year',
      priceValue: 9999,
      description: 'Complete solution for large enterprises',
      icon: <Building2 className="h-6 w-6 text-red-500" />,
      features: [
        { text: 'Unlimited vehicles', included: true },
        { text: 'Unlimited Job Posting', included: true },
        { text: 'Unlimited Hiring', included: true },
        { text: '24/7 dedicated support', included: true },
        { text: 'Unlimited Feed Posting', included: true },
        { text: 'Unlimited Trips Creation', included: true },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle:
        'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg',
      recommended: false,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: 'Can I change my plan anytime?',
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. If you upgrade, you'll be charged the prorated difference. If you downgrade, the credit will be applied to your next billing cycle.",
    },
    {
      question: 'Is there a free trial available?',
      answer:
        "We offer a 14-day free trial for all plans. No credit card required to get started. You can explore all features and decide if it's right for your needs.",
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit/debit cards, UPI, net banking and digital wallets for your convenience.',
    },
    {
      question: 'Do you offer discounts for yearly plans?',
      answer:
        'Yes! annual subscriptions come with a 20% discount compared to monthly billing. You can switch to annual billing from your account settings and save significantly.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer:
        "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again.",
    },
    {
      question: 'Is customer support included?',
      answer:
        'All plans include 24/7 customer support. Pro and Enterprise plans get priority support with faster response times and dedicated support representatives.',
    },
  ];

  const handleSubscribe = (planId: string) => {
    console.log(`Subscribing to plan: ${planId}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Subscription Plans
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose the perfect plan for your career growth. Upgrade, downgrade,
            or cancel anytime.
          </p>
        </motion.div>

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
              {plan.recommended && (
                <div className="absolute right-0 top-0">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-1 text-xs font-semibold text-white">
                    RECOMMENDED
                  </div>
                </div>
              )}

              <div className="p-8">
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

                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <p className="mb-6 text-sm text-gray-600">{plan.description}</p>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`mb-6 w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>

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

                <div className="mt-6 text-center">
                  <button className="text-sm font-medium text-primary-500 hover:text-primary-600">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
            Our team is here to help you choose the right plan for your career
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 transition-all hover:bg-gray-50">
              Contact Support
            </button>
            <button className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-primary-600">
              Schedule a Call
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
