import React from 'react';
import styles from './CircularButton.module.css';

interface CircularButtonProps {
  imagePath: string;
  imageAlt?: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  className?: string;
  pos?: "abs" | "";
}

export default function CircularButton({
  imagePath,
  imageAlt = '',
  width = 32,
  height = 32,
  onClick,
  className = '',
  pos = ""
}: CircularButtonProps) {
  const buttonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <button
      className={`${styles.circularButton} ${className} ${pos === "abs" ? styles.posAbsolute : ''}`}
      onClick={onClick}
      style={buttonStyle}
    >
      <img
        src={imagePath}
        alt={imageAlt}
        className={styles.buttonIcon}
      />
    </button>
  );
}
