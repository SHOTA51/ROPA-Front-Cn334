'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName 
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header - Matching ref.jpg dark style */}
        <div className="flex justify-between items-center px-8 py-5 bg-[#0F172A] text-white">
          <h2 className="text-xl font-bold">Delete Record</h2>
          <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 flex flex-col items-center text-center space-y-6">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">Confirm Deletion</p>
            <p className="text-gray-900 text-xl font-bold">
              Are you sure you want to delete <br/>
              <span className="text-red-600">"{itemName}"</span>?
            </p>
          </div>
          <p className="text-sm text-gray-400">
            This action cannot be undone and will permanently remove this record from the system.
          </p>
        </div>

        {/* Footer - Matching ref.jpg button style */}
        <div className="px-8 pb-8 flex justify-center gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3.5 bg-[#0F172A] text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
