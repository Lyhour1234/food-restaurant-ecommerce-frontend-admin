import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  // Khmer translations for common buttons
  const khmerConfirmText = confirmText === 'Delete' ? 'លុប' : 
                           confirmText === 'Yes' ? 'បាទ/ចាស' : confirmText;
  const khmerCancelText = cancelText === 'Cancel' ? 'បោះបង់' : 
                          cancelText === 'No' ? 'ទេ' : cancelText;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2 font-khmer">{title}</h3>
          <p className="text-gray-600 text-center mb-6 font-khmer leading-relaxed">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-khmer"
            >
              {khmerCancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-khmer"
            >
              {khmerConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;