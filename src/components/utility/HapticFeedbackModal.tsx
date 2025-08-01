"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HapticFeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => /Mobi/i.test(window.navigator.userAgent);
    setIsMobile(checkMobile());

    const hapticPreference = localStorage.getItem('hapticFeedback');
    if (checkMobile() && hapticPreference === null) {
      setIsOpen(true);
    }
  }, []);

  const handleResponse = (response: boolean) => {
    localStorage.setItem('hapticFeedback', JSON.stringify(response));
    if (response) {
      localStorage.setItem('hapticIntensity', '0.2'); // Default intensity
      try {
        if (navigator.vibrate) {
          navigator.vibrate(100); // Vibrate for 100ms on enable
        }
      } catch (error) {
        console.error("Vibration failed:", error);
      }
    }
    setIsOpen(false);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Enable Haptic Feedback?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Enhance your experience with gentle vibrations on interactions. You can change this setting later in the Config page.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleResponse(false)}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                No, thanks
              </button>
              <button
                onClick={() => handleResponse(true)}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Yes, enable
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HapticFeedbackModal;
