'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  FileText,
  CreditCard,
  Car,
  Building2,
  User as UserIcon,
  Info,
  Camera,
  X,
} from 'lucide-react';
import { uploadKYCDocument, updateBankDetails } from '@/lib/mockApi';
import Img from 'next/image';

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  accountNumberConfirm: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
}

interface DocumentUpload {
  file: File | null;
  preview: string | null;
  status: 'pending' | 'uploaded' | 'error';
}

const KYCUploadPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Document uploads
  const [aadharUpload, setAadharUpload] = useState<DocumentUpload>({
    file: null,
    preview: null,
    status: 'pending',
  });
  const [panUpload, setPanUpload] = useState<DocumentUpload>({
    file: null,
    preview: null,
    status: 'pending',
  });
  const [licenseUpload, setLicenseUpload] = useState<DocumentUpload>({
    file: null,
    preview: null,
    status: 'pending',
  });
  const [profilePhotoUpload, setProfilePhotoUpload] = useState<DocumentUpload>({
    file: null,
    preview: null,
    status: 'pending',
  });

  // Bank details
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    accountNumberConfirm: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
  });

  // File input refs
  const aadharInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const kycProgress = () => {
    let uploaded = 0;
    if (aadharUpload.file) uploaded++;
    if (panUpload.file) uploaded++;
    if (licenseUpload.file) uploaded++;
    if (profilePhotoUpload.file) uploaded++;
    if (
      bankDetails.accountHolderName &&
      bankDetails.accountNumber &&
      bankDetails.ifscCode &&
      bankDetails.bankName
    )
      uploaded++;
    return Math.round((uploaded / 5) * 100);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUpload: React.Dispatch<React.SetStateAction<DocumentUpload>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
      ];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPG, PNG) or PDF file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUpload({
          file,
          preview: reader.result as string,
          status: 'uploaded',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (
    setUpload: React.Dispatch<React.SetStateAction<DocumentUpload>>
  ) => {
    setUpload({
      file: null,
      preview: null,
      status: 'pending',
    });
  };

  const handleBankDetailsChange = (field: keyof BankDetails, value: string) => {
    setBankDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateBankDetails = () => {
    if (!bankDetails.accountHolderName) {
      alert('Please enter account holder name');
      return false;
    }
    if (!bankDetails.accountNumber) {
      alert('Please enter account number');
      return false;
    }
    if (bankDetails.accountNumber !== bankDetails.accountNumberConfirm) {
      alert('Account numbers do not match');
      return false;
    }
    if (!bankDetails.ifscCode) {
      alert('Please enter IFSC code');
      return false;
    }
    if (!bankDetails.bankName) {
      alert('Please enter bank name');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please confirm that all uploaded documents are accurate');
      return;
    }

    if (!validateBankDetails()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API calls
      if (aadharUpload.file) {
        await uploadKYCDocument('1', 'aadhar', aadharUpload.file);
      }
      if (panUpload.file) {
        await uploadKYCDocument('1', 'pan', panUpload.file);
      }
      if (licenseUpload.file) {
        await uploadKYCDocument('1', 'license', licenseUpload.file);
      }
      if (profilePhotoUpload.file) {
        await uploadKYCDocument('1', 'photo', profilePhotoUpload.file);
      }

      await updateBankDetails('1', bankDetails);

      // Show success and redirect
      alert(
        'KYC documents submitted successfully! We will verify them within 24-48 hours.'
      );
      router.push('/professional/kyc');
    } catch {
      alert('Failed to submit KYC documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = kycProgress();
  const documentsUploaded = [
    aadharUpload.file,
    panUpload.file,
    licenseUpload.file,
    profilePhotoUpload.file,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-500"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KYC</h1>
                <p className="text-sm text-gray-500">
                  Step 1 of 1: Document Upload
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Your KYC is
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {progress}% Complete
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      {documentsUploaded} of 5 documents uploaded
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-green-500"
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Incomplete</span>
                <span>In Progress</span>
                <span>Complete</span>
              </div>
            </motion.div>

            {/* Document Upload Sections */}
            <div className="space-y-6">
              {/* Aadhar Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Upload Aadhar Card
                      </h3>
                      <p className="text-sm text-gray-500">
                        Government issued identity proof
                      </p>
                    </div>
                  </div>
                  {aadharUpload.status === 'uploaded' ? (
                    <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                      Pending
                    </div>
                  ) : (
                    <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      Not Uploaded
                    </div>
                  )}
                </div>

                {aadharUpload.preview ? (
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg border-2 border-gray-200">
                      {aadharUpload.file?.type === 'application/pdf' ? (
                        <div className="flex h-48 items-center justify-center bg-gray-100">
                          <FileText className="h-16 w-16 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-600">
                            {aadharUpload.file.name}
                          </span>
                        </div>
                      ) : (
                        <Img
                          src={aadharUpload.preview}
                          alt="Aadhar Card"
                          width={48}
                          height={48}
                          className="h-48 w-full object-contain"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveFile(setAadharUpload)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => aadharInputRef.current?.click()}
                      className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700">
                        No file uploaded
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                    <input
                      ref={aadharInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, setAadharUpload)}
                      className="hidden"
                    />
                  </>
                )}

                {!aadharUpload.preview && (
                  <button
                    onClick={() => aadharInputRef.current?.click()}
                    className="mt-3 w-full rounded-lg bg-red-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                  >
                    Upload
                  </button>
                )}

                <button className="mt-2 w-full text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Sample Image
                </button>
              </motion.div>

              {/* PAN Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                      <CreditCard className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Upload PAN Card
                      </h3>
                      <p className="text-sm text-gray-500">
                        Permanent Account Number
                      </p>
                    </div>
                  </div>
                  {panUpload.status === 'uploaded' ? (
                    <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                      Pending
                    </div>
                  ) : (
                    <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      Not Uploaded
                    </div>
                  )}
                </div>

                {panUpload.preview ? (
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg border-2 border-gray-200">
                      {panUpload.file?.type === 'application/pdf' ? (
                        <div className="flex h-48 items-center justify-center bg-gray-100">
                          <FileText className="h-16 w-16 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-600">
                            {panUpload.file.name}
                          </span>
                        </div>
                      ) : (
                        <Img
                          src={panUpload.preview}
                          alt="PAN Card"
                          width={48}
                          height={48}
                          className="h-48 w-full object-contain"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveFile(setPanUpload)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => panInputRef.current?.click()}
                      className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700">
                        No file uploaded
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                    <input
                      ref={panInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, setPanUpload)}
                      className="hidden"
                    />
                  </>
                )}

                {!panUpload.preview && (
                  <button
                    onClick={() => panInputRef.current?.click()}
                    className="mt-3 w-full rounded-lg bg-red-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                  >
                    Upload
                  </button>
                )}

                <button className="mt-2 w-full text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Sample Image
                </button>
              </motion.div>

              {/* Driving License */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Car className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Upload Driving License
                      </h3>
                      <p className="text-sm text-gray-500">
                        Valid driving license
                      </p>
                    </div>
                  </div>
                  {licenseUpload.status === 'uploaded' ? (
                    <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                      Pending
                    </div>
                  ) : (
                    <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      Not Uploaded
                    </div>
                  )}
                </div>

                {licenseUpload.preview ? (
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg border-2 border-gray-200">
                      {licenseUpload.file?.type === 'application/pdf' ? (
                        <div className="flex h-48 items-center justify-center bg-gray-100">
                          <FileText className="h-16 w-16 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-600">
                            {licenseUpload.file.name}
                          </span>
                        </div>
                      ) : (
                        <Img
                          src={licenseUpload.preview}
                          alt="Driving License"
                          className="h-48 w-full object-contain"
                          width={192}
                          height={192}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveFile(setLicenseUpload)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => licenseInputRef.current?.click()}
                      className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700">
                        No file uploaded
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                    <input
                      ref={licenseInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, setLicenseUpload)}
                      className="hidden"
                    />
                  </>
                )}

                {!licenseUpload.preview && (
                  <button
                    onClick={() => licenseInputRef.current?.click()}
                    className="mt-3 w-full rounded-lg bg-red-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                  >
                    Upload
                  </button>
                )}

                <button className="mt-2 w-full text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Sample Image
                </button>
              </motion.div>

              {/* Bank Account Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Bank Account Details
                      </h3>
                      <p className="text-sm text-gray-500">
                        For payment processing
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                    Pending
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Account Holder Name */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name as per bank"
                      value={bankDetails.accountHolderName}
                      onChange={(e) =>
                        handleBankDetailsChange(
                          'accountHolderName',
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXXXXX"
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        handleBankDetailsChange('accountNumber', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Re-enter Account Number */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Re-enter to confirm
                    </label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXXXXX"
                      value={bankDetails.accountNumberConfirm}
                      onChange={(e) =>
                        handleBankDetailsChange(
                          'accountNumberConfirm',
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={bankDetails.ifscCode}
                      onChange={(e) =>
                        handleBankDetailsChange(
                          'ifscCode',
                          e.target.value.toUpperCase()
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Find on cheque or passbook
                    </p>
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank"
                      value={bankDetails.bankName}
                      onChange={(e) =>
                        handleBankDetailsChange('bankName', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* UPI ID (Optional) */}
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      UPI ID
                      <span className="text-xs font-normal text-gray-500">
                        (optional)
                      </span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. johndoe@upi"
                      value={bankDetails.upiId}
                      onChange={(e) =>
                        handleBankDetailsChange('upiId', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Profile Photo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                      <UserIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Upload Profile Photo
                      </h3>
                      <p className="text-sm text-gray-500">
                        Clear photo with plain background
                      </p>
                    </div>
                  </div>
                  {profilePhotoUpload.status === 'uploaded' ? (
                    <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                      Pending
                    </div>
                  ) : (
                    <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      Not Uploaded
                    </div>
                  )}
                </div>

                {profilePhotoUpload.preview ? (
                  <div className="relative mx-auto w-48">
                    <div className="overflow-hidden rounded-full border-4 border-gray-200">
                      <Img
                        src={profilePhotoUpload.preview}
                        alt="Profile Photo"
                        className="h-48 w-48 object-cover"
                        width={192}
                        height={192}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFile(setProfilePhotoUpload)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="mx-auto flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Camera className="mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700">
                        Tap to Upload
                      </p>
                    </div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(e, setProfilePhotoUpload)
                      }
                      className="hidden"
                    />
                  </>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                  Upload a clear selfie with a plain background. No sunglasses
                  or caps.
                </p>
              </motion.div>

              {/* Terms Confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that all uploaded documents are accurate and
                    belong to me
                  </span>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !agreedToTerms}
                className="w-full rounded-xl bg-red-500 py-4 text-center font-bold text-white shadow-lg transition-all hover:bg-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Save and Continue'}
              </motion.button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Upload Progress
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Aadhar Card</span>
                    </div>
                    {aadharUpload.file ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">PAN Card</span>
                    </div>
                    {panUpload.file ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Driving License
                      </span>
                    </div>
                    {licenseUpload.file ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Bank Details
                      </span>
                    </div>
                    {bankDetails.accountHolderName &&
                    bankDetails.accountNumber &&
                    bankDetails.ifscCode &&
                    bankDetails.bankName ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Profile Photo
                      </span>
                    </div>
                    {profilePhotoUpload.file ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="overflow-hidden rounded-2xl bg-blue-50 p-6 shadow-lg"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Important Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Upload clear, readable documents</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>File size should not exceed 5MB</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Accepted formats: JPG, PNG, PDF</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Verification takes 24-48 hours</span>
                  </li>
                </ul>
              </motion.div>

              {/* Help Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg"
              >
                <h3 className="mb-2 font-bold text-gray-900">Need Help?</h3>
                <p className="mb-4 text-sm text-gray-700">
                  Our support team is available 24/7 to assist you with KYC
                  verification.
                </p>
                <button className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700">
                  Contact Support
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCUploadPage;
