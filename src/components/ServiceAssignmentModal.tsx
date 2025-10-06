'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  rating: number;
  reviews: number;
  price: number;
  status: string;
  coverage: string;
  response: string;
  icon?: React.ComponentType<Record<string, unknown>> | null;
}

interface ServiceAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onAssign: (serviceId: string) => void;
}

export default function ServiceAssignmentModal({
  isOpen,
  onClose,
  service,
  onAssign,
}: ServiceAssignmentModalProps) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedServiceId, setGeneratedServiceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    // Generate a service ID
    const serviceId = `WBD-${new Date().getFullYear()}${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(
        2,
        '0'
      )}${new Date().getDate().toString().padStart(2, '0')}${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, '0')}`;

    setGeneratedServiceId(serviceId);
    setIsSubmitted(true);

    // Call the parent's onAssign function
    setTimeout(() => {
      onAssign(service.id);
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setVehicleNumber('');
    setServiceDate('');
    setServiceTime('');
    setServiceDescription('');
    setGeneratedServiceId('');
    onClose();
  };

  const copyServiceId = () => {
    navigator.clipboard.writeText(generatedServiceId);
  };

  if (!service) return null;
  const ServiceIcon = service.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-hidden rounded-2xl border-none p-0 shadow-2xl sm:w-full">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6"
            >
              <DialogHeader className="mb-4 sm:mb-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-[#f36969]/10 p-2">
                    <FileText className="h-5 w-5 text-[#f36969]" />
                  </div>
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    Service Details
                  </DialogTitle>
                </div>
              </DialogHeader>

              {/* Service Info Display */}
              <div className="mb-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:mb-6 sm:p-4">
                <div className="mb-2 flex items-center gap-3 sm:mb-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    {ServiceIcon ? (
                      <ServiceIcon className="h-5 w-5 text-[#f36969]" />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600">{service.provider}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{service.description}</p>
              </div>

              {/* Make the modal body scrollable with hidden scrollbar for long content */}
              <div className="scrollbar-hide max-h-[45vh] overflow-y-auto pr-2 sm:max-h-[50vh]">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Service Title Field (Autofill) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Service Title
                    </Label>
                    <Input
                      value={`${service.name} (Autofill)`}
                      disabled
                      className="border-gray-300 bg-gray-50 text-gray-600"
                    />
                  </div>

                  {/* Date and Time Grid */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {/* Service Date */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Service Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          className="border-gray-300 pl-10 focus:border-[#f36969] focus:ring-[#f36969]/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Service Time */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Service Time
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="time"
                          value={serviceTime}
                          onChange={(e) => setServiceTime(e.target.value)}
                          className="border-gray-300 pl-10 focus:border-[#f36969] focus:ring-[#f36969]/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Number */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Vehicle Number
                    </Label>
                    <Input
                      type="text"
                      placeholder="DL01AB1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="border-gray-300 font-mono tracking-wider focus:border-[#f36969] focus:ring-[#f36969]/20"
                      required
                    />
                  </div>

                  {/* Service Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Service Description
                    </Label>
                    <Textarea
                      placeholder="Complete tyre replacement service including wheel alignment and balancing. Premium quality tyres with 2-year warranty coverage."
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      className="min-h-[60px] resize-none border-gray-300 focus:border-[#f36969] focus:ring-[#f36969]/20 sm:min-h-[80px]"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    Save Details
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6"
            >
              {/* Success Header */}
              <div className="mb-4 text-center sm:mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500"
                >
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-green-800"
                >
                  Service Assigned Successfully
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-1 text-sm text-green-700"
                >
                  The service has been successfully assigned!
                </motion.p>
              </div>

              {/* Service Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:mb-6 sm:p-4"
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-[#f36969]/10 p-2">
                    <FileText className="h-4 w-4 text-[#f36969]" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Service Details
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:gap-3">
                  <div className="flex flex-col rounded-lg bg-gray-50 p-2 sm:flex-row sm:justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-700">
                      Service Title
                    </span>
                    <span className="text-right font-semibold text-gray-900">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex flex-col rounded-lg bg-gray-50 p-2 sm:flex-row sm:justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-700">
                      Vehicle Number
                    </span>
                    <span className="text-right font-mono font-semibold text-gray-900">
                      {vehicleNumber}
                    </span>
                  </div>
                  <div className="flex flex-col rounded-lg bg-gray-50 p-2 sm:flex-row sm:justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-700">
                      Service Date
                    </span>
                    <span className="flex items-center gap-1 text-right font-semibold text-gray-900">
                      <Calendar className="h-3 w-3 text-[#f36969]" />
                      {new Date(serviceDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col rounded-lg bg-gray-50 p-2 sm:flex-row sm:justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-700">
                      Service Time
                    </span>
                    <span className="flex items-center gap-1 text-right font-semibold text-gray-900">
                      <Clock className="h-3 w-3 text-[#f36969]" />
                      {serviceTime}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Service ID */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4 rounded-xl border border-green-200 bg-green-100 p-3 sm:mb-6 sm:p-4"
              >
                <div className="mb-2 text-center">
                  <p className="text-sm font-semibold text-green-800">
                    Service ID
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <code className="rounded bg-white px-3 py-1 text-lg font-bold text-green-900">
                      {generatedServiceId}
                    </code>
                    <button
                      onClick={copyServiceId}
                      className="rounded-lg bg-green-600 p-1.5 text-white hover:bg-green-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-center text-xs text-green-700">
                  Linked with the client dashboard and trackable via Admin.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Reset for new assignment but keep success state
                    setVehicleNumber('');
                    setServiceDate('');
                    setServiceTime('');
                    setServiceDescription('');
                    setIsSubmitted(false);
                  }}
                  className="w-full rounded-xl border border-green-200 bg-white px-6 py-3 font-semibold text-green-700 transition-all hover:bg-green-50"
                >
                  + Assign Another Service
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
