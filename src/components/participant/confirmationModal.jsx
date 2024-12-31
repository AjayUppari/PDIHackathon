import React from 'react';
import { Dialog } from '@headlessui/react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            {title}
          </Dialog.Title>

          <p className="text-sm text-gray-500 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ConfirmationModal;