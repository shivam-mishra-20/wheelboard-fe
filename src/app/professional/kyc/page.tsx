'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  CreditCard,
  Car,
  Building2,
  User,
  HelpCircle,
} from 'lucide-react';
import { getKYCStatus } from '@/lib/mockApi';

interface KYCDocument {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

interface KYCDocuments {
  aadharCard?: 'verified' | 'pending' | 'missing';
  panCard?: 'verified' | 'pending' | 'missing';
  drivingLicense?: 'verified' | 'pending' | 'missing';
  bankAccount?: 'verified' | 'pending' | 'missing';
  profilePhoto?: 'verified' | 'pending' | 'missing';
}

interface KYCData {
  progress?: number;
  documents?: KYCDocuments;
}

const KYCDashboardPage = () => {
  const router = useRouter();
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKYCData = async () => {
      setIsLoading(true);
      const data = await getKYCStatus('1'); // Mock user ID
      setKycData(data);
      setIsLoading(false);
    };

    fetchKYCData();
  }, []);

  const documents: KYCDocument[] = [
    {
      id: 'aadhar',
      name: 'Aadhar Card',
      status: kycData?.documents?.aadharCard || 'missing',
      icon: FileText,
      description: 'Government issued identity proof',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      status: kycData?.documents?.panCard || 'missing',
      icon: CreditCard,
      description: 'Permanent Account Number for tax purposes',
    },
    {
      id: 'license',
      name: 'Driving License',
      status: kycData?.documents?.drivingLicense || 'missing',
      icon: Car,
      description: 'Valid driving license for vehicle operation',
    },
    {
      id: 'bank',
      name: 'Bank Details',
      status: kycData?.documents?.bankAccount || 'missing',
      icon: Building2,
      description: 'Bank account for payment processing',
    },
    {
      id: 'photo',
      name: 'Profile Photo',
      status: kycData?.documents?.profilePhoto || 'missing',
      icon: User,
      description: 'Clear photo with plain background',
    },
  ];

  const faqs = [
    {
      question: 'Why is KYC required?',
      answer:
        'KYC (Know Your Customer) is mandatory to verify your identity and comply with regulatory requirements. It ensures platform security and builds trust among clients.',
    },
    {
      question: 'How long does verification take?',
      answer:
        'Document verification typically takes 24-48 hours. You will receive notifications about your verification status via email and SMS.',
    },
    {
      question: 'What documents are accepted?',
      answer:
        'We accept Aadhar Card, PAN Card, valid Driving License, and bank account details. All documents must be clear, valid, and match your registered details.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, all your documents are encrypted and stored securely. We follow industry-standard security protocols and never share your data with third parties without consent.',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      default:
        return 'Not Uploaded';
    }
  };

  const uploadedCount = documents.filter(
    (doc) => doc.status !== 'missing'
  ).length;
  const totalCount = documents.length;
  const kycProgress =
    kycData?.progress || Math.round((uploadedCount / totalCount) * 100);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                KYC Verification
              </h1>
              <p className="text-sm text-gray-500">
                Complete your profile to start earning
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* KYC Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 inline-block rounded-lg bg-blue-200 px-3 py-1 text-sm font-semibold text-blue-800">
                    KYC {kycProgress === 100 ? 'Complete' : 'Incomplete'}
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Complete your KYC
                  </h2>
                  <p className="text-gray-700">
                    To start earning on the platform
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative h-24 w-24">
                    <svg className="h-24 w-24 -rotate-90 transform">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#3B82F6"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - kycProgress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {kycProgress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>
                  {uploadedCount} of {totalCount} documents uploaded
                </span>
              </div>

              <button
                onClick={() => router.push('/professional/kyc/upload')}
                className="mt-4 w-full rounded-xl bg-red-500 py-3 text-center font-semibold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg"
              >
                Continue KYC
              </button>
            </motion.div>

            {/* Documents List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Your KYC Documents
                </h3>
                <button
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === null ? 0 : null)
                  }
                >
                  Expand all
                </button>
              </div>

              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          doc.status === 'verified'
                            ? 'bg-green-100'
                            : doc.status === 'pending'
                              ? 'bg-yellow-100'
                              : 'bg-red-100'
                        }`}
                      >
                        <doc.icon
                          className={`h-6 w-6 ${
                            doc.status === 'verified'
                              ? 'text-green-600'
                              : doc.status === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {doc.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {doc.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {getStatusIcon(doc.status)}
                        {getStatusText(doc.status)}
                      </div>
                      {doc.status !== 'verified' && (
                        <button
                          onClick={() =>
                            router.push('/professional/kyc/upload')
                          }
                          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* KYC FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">KYC FAQ</h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-gray-200"
                  >
                    <button
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === index ? null : index)
                      }
                      className="flex w-full items-center justify-between bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
                    >
                      <span className="font-semibold text-gray-900">
                        {faq.question}
                      </span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="bg-white p-4">
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  Complete your KYC to start earning on this platform
                </h3>
                <p className="text-sm text-gray-600">
                  Secure your account and unlock all features.
                </p>
              </motion.div>

              {/* Benefits Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Benefits of KYC
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Access to premium job opportunities
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Faster payment processing
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Verified badge on your profile
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Enhanced trust from clients
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Priority customer support
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => router.push('/professional/kyc/upload')}
                className="w-full rounded-xl bg-blue-600 py-4 text-center font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                Proceed to KYC Steps
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDashboardPage;
