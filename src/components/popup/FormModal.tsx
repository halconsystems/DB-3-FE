'use client';

import React from 'react';
import styles from './FormModal.module.css';
import CircularButton from '../ui/CircularButton';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  const isCompact = !title.trim();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${isCompact ? styles.compactModal : ''}`.trim()} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.header} ${isCompact ? styles.compactHeader : ''}`.trim()}>
          <h2 className={styles.title}>{title}</h2>
          {/* <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button> */}
          <CircularButton imagePath="/icons/close.svg" imageAlt="Close" onClick={onClose} className={styles.closeButton} imgSize={12} />
        </div>
        <div className={`${styles.content} ${isCompact ? styles.compactContent : ''}`.trim()}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
