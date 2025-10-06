'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  //X,
  Wrench,
  MessageSquare,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle2,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ServiceEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceEnquiryModal({
  isOpen,
  onClose,
}: ServiceEnquiryModalProps) {
  const [selectedService, setSelectedService] = useState<string>('tire');
  const [serviceLocation, setServiceLocation] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      selectedService,
      serviceLocation,
      currentChallenges,
      specialRequirements,
    });
    setIsSubmitted(true);

    // Reset form after 2 seconds and close
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedService('tire');
      setServiceLocation('');
      setCurrentChallenges('');
      setSpecialRequirements('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <DialogHeader className="space-y-0 p-6 pb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Service Enquiry
                  </DialogTitle>
                  {/* <button
                    onClick={handleClose}
                    className="rounded-full p-1 transition-colors hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button> */}
                </div>
              </DialogHeader>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
                {/* Service Type Selection */}
                <div className="space-y-3">
                  <RadioGroup
                    value={selectedService}
                    onValueChange={setSelectedService}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <RadioGroupItem
                        value="tire"
                        id="tire"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="tire"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 peer-data-[state=checked]:border-[#f36969] peer-data-[state=checked]:bg-[#f36969]/5"
                      >
                        <div className="mb-2 rounded-full bg-black p-3">
                          <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="mb-1 font-semibold text-gray-900">
                            Tire Services
                          </div>
                          <div className="text-xs text-gray-600">
                            We Manage and Maintain Your Tires
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem
                        value="consulting"
                        id="consulting"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="consulting"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 peer-data-[state=checked]:border-[#f36969] peer-data-[state=checked]:bg-[#f36969]/5"
                      >
                        <div className="mb-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="mb-1 font-semibold text-gray-900">
                            Consulting
                          </div>
                          <div className="text-xs text-gray-600">
                            We manage Your Operational Complexities
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Service Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700"
                  >
                    <MapPin className="h-4 w-4 text-[#f36969]" />
                    Required Service Location:
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your service location.."
                    value={serviceLocation}
                    onChange={(e) => setServiceLocation(e.target.value)}
                    className="border-gray-200 focus:border-[#f36969] focus:ring-[#f36969]/20"
                    required
                  />
                </div>

                {/* Current Challenges */}
                <div className="space-y-2">
                  <Label
                    htmlFor="challenges"
                    className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700"
                  >
                    <AlertTriangle className="h-4 w-4 text-[#f36969]" />
                    Current Challenges Faced:
                  </Label>
                  <Textarea
                    id="challenges"
                    placeholder="Describe current issues..."
                    value={currentChallenges}
                    onChange={(e) => setCurrentChallenges(e.target.value)}
                    className="min-h-[80px] resize-none border-gray-200 focus:border-[#f36969] focus:ring-[#f36969]/20"
                    required
                  />
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label
                    htmlFor="requirements"
                    className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700"
                  >
                    <Info className="h-4 w-4 text-[#f36969]" />
                    Special Requirements (if any):
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="Mention any special instructions..."
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    className="min-h-[80px] resize-none border-gray-200 focus:border-[#f36969] focus:ring-[#f36969]/20"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#e85555] px-6 py-3.5 font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Submit Enquiry
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
              >
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </motion.div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Enquiry Submitted!
              </h3>
              <p className="text-gray-600">
                We&apos;ll get back to you shortly with the best service
                options.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
