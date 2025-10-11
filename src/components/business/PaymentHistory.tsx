'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface Payment {
  id: string;
  service: string;
  amount: number;
  date: string;
}

const paymentHistory: Payment[] = [
  {
    id: '1',
    service: 'Tyre Replacement',
    amount: 1200,
    date: '5 June, 2025',
  },
  {
    id: '2',
    service: 'Engine Repair',
    amount: 2400,
    date: '12 June, 2025',
  },
  {
    id: '3',
    service: 'Battery Service',
    amount: 800,
    date: '18 June, 2025',
  },
];

interface PaymentHistoryProps {
  onRegisterPayment: () => void;
}

export default function PaymentHistory({
  onRegisterPayment,
}: PaymentHistoryProps) {
  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Exporting to PDF...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Payment History
      </h3>

      <div className="mb-4 space-y-3">
        {paymentHistory.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="rounded-lg border border-gray-100 p-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{payment.service}</h4>
                <p className="mt-1 text-xs text-gray-500">{payment.date}</p>
              </div>
              <p className="font-bold text-gray-900">
                ₹{payment.amount.toLocaleString('en-IN')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleExportPDF}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-red-400 bg-white px-4 py-3 font-semibold text-red-500 transition-all hover:bg-red-50"
        >
          <Download className="h-5 w-5" />
          Export as PDF
        </button>

        <button
          onClick={onRegisterPayment}
          className="w-full rounded-lg bg-gradient-to-r from-red-400 to-red-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
        >
          Register New Payment
        </button>
      </div>
    </motion.div>
  );
}
