import React from 'react';
import { FaEnvelope, FaPhone, FaQuestionCircle } from 'react-icons/fa';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <FaQuestionCircle className="mr-3 text-blue-500" />
          Support Center
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            If you're experiencing any issues or have questions about EasyDelivery, please don't hesitate to contact us. We're here to help!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-blue-500 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Support</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Send us an email and we'll get back to you as soon as possible.
              </p>
              <a
                href="mailto:easy delivery@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                easy delivery@gmail.com
              </a>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-4">
                <FaPhone className="text-green-500 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone Support</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Call us directly for immediate assistance.
              </p>
              <a
                href="tel:0123456768"
                className="text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                0123456768
              </a>
            </div>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Response Time
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We typically respond to emails within 24 hours and phone calls are answered during business hours (9 AM - 6 PM).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
