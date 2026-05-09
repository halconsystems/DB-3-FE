import React from 'react';
import styles from './HostDetailsModal.module.css';

interface HostDetailsModalProps {
  open: boolean;
  onClose: () => void;
  host: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
}

const HostDetailsModal: React.FC<HostDetailsModalProps> = ({ open, onClose, host }) => {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button onClick={onClose} className={styles.closeButton}>
            <img src="/icons/close.svg" alt="" />
        </button>
        <h2 className={styles.title}>Host Details</h2>
        <hr className={styles.divider} />
        <div className={styles.detailsContainer}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>ID</span>
            <span className={styles.detailValue}>{host.id}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Name</span>
            <span className={styles.detailValueBold}>{host.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Phone Number</span>
            <span className={styles.detailValue}>{host.phone}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Address</span>
            <span className={styles.detailValue}>{host.address}</span>
          </div>
        <hr className={styles.bottomDivider} />
        </div>
        <button
          onClick={onClose}
          className={styles.submitButton}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HostDetailsModal;
