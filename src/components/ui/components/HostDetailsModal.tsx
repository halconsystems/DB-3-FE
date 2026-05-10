import React from 'react';
import styles from './HostDetailsModal.module.css';

export type HostDetailRow = { label: string; value: string };

interface HostDetailsModalProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  details: HostDetailRow[];
}

const HostDetailsModal: React.FC<HostDetailsModalProps> = ({ open, onClose, loading, details }) => {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button type="button" onClick={onClose} className={styles.closeButton}>
          <img src="/icons/close.svg" alt="" />
        </button>
        <h2 className={styles.title}>Host Details</h2>
        <hr className={styles.divider} />
        <div className={styles.detailsContainer}>
          {loading ? (
            <div className={styles.detailRow}>
              <span className={styles.detailValue}>Loading...</span>
            </div>
          ) : (
            details.map((row) => (
              <div key={row.label} className={styles.detailRow}>
                <span className={styles.detailLabel}>{row.label}</span>
                <span className={styles.detailValue}>{row.value}</span>
              </div>
            ))
          )}
          <hr className={styles.bottomDivider} />
        </div>
        <button type="button" onClick={onClose} className={styles.submitButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HostDetailsModal;
