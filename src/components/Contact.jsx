import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config'; // Make sure this path matches your firebase config export

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactSection() {
  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Format the date for the document ID
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      const docId = `${formData.name.replace(/\s+/g, '_')}_${dateString}`;

      // Use setDoc instead of addDoc to specify the document ID
      await setDoc(doc(db, 'contact_messages', docId), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      });
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error sending message: ', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-20 font-poppins">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.h2
          className="mb-6 text-center text-4xl font-semibold text-gray-900 lg:text-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          Let’s Drive Success Together
        </motion.h2>
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-center text-gray-600"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to transform your transport operations? Get in touch with our
          team to discuss how Wheelboard can help you achieve your goals.
        </motion.p>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* 📇 Info + Map */}
          <motion.div
            className="flex flex-1 flex-col rounded-2xl bg-white/30 p-8 shadow-lg backdrop-blur-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/50 p-3">
                  <FiPhone className="h-6 w-6 text-[#0052CC]" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Phone</div>
                  <div className="text-sm text-gray-600">020‑67320492</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/50 p-3">
                  <FiMail className="h-6 w-6 text-[#FF6D1B]" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Email</div>
                  <div className="text-sm text-gray-600">
                    hello@wheelboard.in
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-white/50 p-3">
                  <FiMapPin className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Address</div>
                  <div className="text-sm text-gray-600">
                    WHEELBOARD SOLUTIONS PRIVATE LIMITED <br />
                    #204 Sapphire Chambers, First Floor, Baner Road, <br />
                    Baner, Pune‑411045, Maharashtra
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl">
              <iframe
                title="Wheelboard Location"
                src="https://www.google.com/maps?q=18.556523053744474,73.79475114500215&z=15&output=embed
"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[250px] w-full object-cover"
              ></iframe>
            </div>
          </motion.div>

          {/* 📨 Send Us a Message */}
          <motion.form
            onSubmit={handleSubmit}
            className="grid flex-1 gap-4 rounded-2xl bg-white/30 p-8 shadow-lg backdrop-blur-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
              Send Us a Message
            </h3>

            {/* Form Status Messages */}
            {submitStatus === 'success' && (
              <div className="rounded-lg bg-green-50 p-3 text-green-800">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="rounded-lg bg-red-50 p-3 text-red-800">
                Oops! There was a problem sending your message. Please try
                again.
              </div>
            )}

            {/* Form Fields */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
              className="rounded-lg bg-white/60 px-4 py-3 placeholder-gray-500 focus:bg-white focus:outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
              className="rounded-lg bg-white/60 px-4 py-3 placeholder-gray-500 focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company"
              className="rounded-lg bg-white/60 px-4 py-3 placeholder-gray-500 focus:bg-white focus:outline-none"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              placeholder="Message"
              required
              className="resize-none rounded-lg bg-white/60 px-4 py-3 placeholder-gray-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 py-3 ${
                isSubmitting
                  ? 'bg-gray-400'
                  : 'bg-[#FF6D1B] hover:bg-[#FF6D1B]/90'
              } flex items-center justify-center rounded-lg font-medium text-white transition-colors duration-300`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
