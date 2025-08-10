"use client";

import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg"
      : "bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full border border-primary-100">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border-2 border-primary-200 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 rounded-full transition-all duration-200 font-semibold ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
