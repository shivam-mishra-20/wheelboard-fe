'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  type: 'vehicle' | 'driver';
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  type,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Icon */}
            <div className="flex justify-center pt-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200"
              >
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-6 text-center">
              <h2 className="mb-3 text-2xl font-bold text-gray-900">{title}</h2>
              <p className="mb-2 text-gray-600">{message}</p>
              <p className="text-lg font-semibold text-gray-900">
                &ldquo;{itemName}&rdquo;
              </p>
              <p className="mt-4 text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white shadow-md transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg"
              >
                Delete {type === 'vehicle' ? 'Vehicle' : 'Driver'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
