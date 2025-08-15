"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animations } from "@/lib/animations";

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
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Get current scroll position
      const scrollY = window.scrollY;

      // Lock the body scroll and maintain scroll position
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore body scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg"
      : "bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative bg-white rounded-card shadow-xl p-6 mx-4 max-w-sm w-full border border-primary-100"
              variants={animations.variants.dropdown.menu}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-subheading font-semibold text-primary mb-2">
                  {title}
                </h3>
                <p className="text-secondary mb-6">{message}</p>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-secondary border-2 border-primary-200 rounded-button hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 font-medium"
                  >
                    {cancelText}
                  </button>
                  <motion.button
                    type="button"
                    onClick={onConfirm}
                    className={`px-6 py-3 rounded-button transition-all duration-200 font-semibold ${confirmButtonClass}`}
                    {...animations.presets.button}
                  >
                    {confirmText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
