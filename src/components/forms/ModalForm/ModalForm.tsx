import React from 'react'
import styles from './ModalForm.module.css';

function ModalForm({children, closeButton, title}: {children: React.ReactNode, closeButton?: () => void, title: string}) {

  return (
   <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>{title}</h2>
        <button onClick={closeButton} className={styles.closeButton}>
            <img src="/icons/close.svg" alt="" />
        </button>
        {children}
      </div>
    </div>
  )
}

export default ModalForm