import React from 'react';
import styles from './CircularButton.module.css';

interface CircularButtonProps {
  imagePath?: string;
  imageAlt?: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  className?: string;
  pos?: "abs" | "";
  imgSize?: number;
  children?: React.ReactNode;
}

export default function CircularButton({
  imagePath= '',
  imageAlt = '',
  width = 32,
  height = 32,
  onClick,
  className = '',
  pos = "",
  imgSize = 15,
  children,
}: CircularButtonProps) {
  const isViewIcon = imagePath.includes('/icons/View.svg');
  const resolvedImgSize = isViewIcon && imgSize === 15 ? 22 : imgSize;
  const buttonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <button
      type="button"
      className={`${styles.circularButton} ${isViewIcon ? styles.iconOnlyButton : ''} ${className} ${pos === "abs" ? styles.posAbsolute : ''}`}
      onClick={onClick}
      style={buttonStyle}
    >
      <img
        className={styles.buttonIcon}
        src={imagePath}
        alt={imageAlt}
        width={resolvedImgSize}
        height={resolvedImgSize}
        style={{display: imagePath ? 'block' : 'none' }}
      />
      {children}
    </button>
  );
}
