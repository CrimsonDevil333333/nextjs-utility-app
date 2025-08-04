'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HapticFeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Function to check if the user is on a mobile device
    const checkIsMobile = () => /Mobi|Android/i.test(navigator.userAgent);
    const mobileCheck = checkIsMobile();
    setIsMobileDevice(mobileCheck);

    // Only show the modal on mobile devices if the preference hasn't been set
    const hapticPreference = localStorage.getItem('hapticFeedback');
    if (mobileCheck && hapticPreference === null) {
      // Delay showing the modal slightly to allow the page to load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleResponse = (response: boolean) => {
    localStorage.setItem('hapticFeedback', JSON.stringify(response));
    if (response) {
      // Set a default intensity if enabling
      localStorage.setItem('hapticIntensity', '0.2');
      // Provide a confirmation vibration
      try {
        if (navigator.vibrate) {
          navigator.vibrate(50); // A short vibration to confirm enabling
        }
      } catch (error) {
        console.error("Vibration failed:", error);
      }
    }
    setIsOpen(false);
  };

  // The modal is only ever rendered on mobile devices
  if (!isMobileDevice) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Enhanced backdrop with blur effect for theme consistency
          className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            // Enhanced modal panel styling
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Enable Haptic Feedback?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Enhance your experience with gentle vibrations on interactions. You can change this later in the Config page.
            </p>
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={() => handleResponse(false)}
                // Enhanced secondary button style
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                No, thanks
              </button>
              <button
                onClick={() => handleResponse(true)}
                // Enhanced primary button style
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
