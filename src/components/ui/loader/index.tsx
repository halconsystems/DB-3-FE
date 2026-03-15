import React from 'react'
import styles from './loader.module.css'

interface LoaderProps {
  variant?: 'full' | 'inline';
}

function Loader({ variant = 'full' }: LoaderProps) {
  const containerClass = variant === 'inline' ? styles.inlineContainer : styles.container;

  return (
    <div className={containerClass}>
        <div className={styles.wrapper}>
          {/* Outer spinning ring */}
          <div className={styles.ring}></div>

          {/* Inner pulsing dot */}
          <div className={styles.center}>
            <div className={styles.label}>DHA</div>
          </div>
        </div>
      </div>
  )
}

export default Loader