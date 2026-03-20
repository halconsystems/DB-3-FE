import React from 'react'
import styles from './loader.module.css'

interface LoaderProps {
  variant?: 'full' | 'inline';
  bare?: boolean;
}

function Loader({ variant = 'full', bare = false }: LoaderProps) {
  if (bare) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.ring}></div>
        <div className={styles.center}>
          <div className={styles.label}>DHA</div>
        </div>
      </div>
    );
  }
  const containerClass = variant === 'inline' ? styles.inlineContainer : styles.container;
  return (
    <div className={containerClass}>
      <div className={styles.wrapper}>
        <div className={styles.ring}></div>
        <div className={styles.center}>
          <div className={styles.label}>DHA</div>
        </div>
      </div>
    </div>
  );
}

export default Loader