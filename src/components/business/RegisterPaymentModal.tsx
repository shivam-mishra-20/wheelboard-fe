'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Service {
  id: string;
  name: string;
  icon: string;
}

interface FormData {
  purpose: string;
  amount: string;
  serviceId: string;
  notes: string;
  date: string; // YYYY-MM-DD
}

const availableServices: Service[] = [
  { id: '1', name: 'Tyre Replacement', icon: '🔧' },
  { id: '2', name: 'Engine Repair', icon: '⚙️' },
  { id: '3', name: 'Battery Service', icon: '🔋' },
  { id: '4', name: 'Oil Change', icon: '🛢️' },
  { id: '5', name: 'Brake Service', icon: '🛑' },
  { id: '6', name: 'AC Repair', icon: '❄️' },
];

export default function RegisterPaymentModal({
  isOpen,
  onClose,
}: RegisterPaymentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    purpose: '',
    amount: '',
    serviceId: '',
    notes: '',
    date: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = availableServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement payment registration logic
    console.log('Payment registered:', formData);
    onClose();
    setFormData({
      purpose: '',
      amount: '',
      serviceId: '',
      notes: '',
      date: '',
    });
    setSearchQuery('');
  };

  const selectedService = availableServices.find(
    (s) => s.id === formData.serviceId
  );

  // lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-0 top-12 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl md:left-100"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Register Payment
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form - scrollable on small screens */}
            {/* inject small CSS to hide the scrollbar visually but keep scrolling */}
            <style>{`
              .register-payment-modal-scroll::-webkit-scrollbar { display: none; }
              .register-payment-modal-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <form
              onSubmit={handleSubmit}
              className="register-payment-modal-scroll max-h-[70vh] space-y-4 overflow-y-auto pr-2"
            >
              {/* Payment Details */}
              <div>
                <label className="mb-2 block text-sm font-medium text-primary-600">
                  Payment Details
                </label>
              </div>

              {/* Purpose */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Purpose of Payment*
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="Enter purpose"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                />
              </div>

              {/* Payment Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Amount*
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="1200"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-8 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    required
                  />
                </div>
              </div>

              {/* Service Information */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Service Information*
                </label>
              </div>

              {/* Linked Service */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Linked Service*
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search service ID..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                {/* Service Dropdown */}
                {searchQuery && (
                  <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {filteredServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, serviceId: service.id });
                          setSearchQuery('');
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <span className="font-medium text-gray-900">
                          {service.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Service Display */}
                {selectedService && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2">
                    <span className="text-xl">{selectedService.icon}</span>
                    <span className="font-medium text-primary-700">
                      {selectedService.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Enter Notes */}
              {/* Payment Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Date*
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enter Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add your optional notes..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <p className="mt-1 text-right text-xs text-gray-500">
                  {formData.notes.length}/500
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !formData.purpose || !formData.amount || !formData.serviceId
                }
                className="w-full rounded-lg bg-gradient-to-r from-red-400 to-red-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                SAVE PAYMENT
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
