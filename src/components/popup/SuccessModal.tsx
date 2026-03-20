"use client";

import React from "react";
import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Icon */}
        <div className={styles.iconRow}>
          <div className={styles.iconCircle}>
            <svg 
              className={styles.icon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className={styles.title}>
          {title}
        </h2>

        {/* Message */}
        <p className={styles.message}>
          {message}
        </p>

        {/* OK Button */}
        <div className={styles.buttonRow}>
          <button
            onClick={onClose}
            className={styles.okButton}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
