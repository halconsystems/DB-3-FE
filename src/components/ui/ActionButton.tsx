'use client';
import React from 'react';
interface ActionButtonProps {
  onClick: () => void;
  icon?: string;
  alt?: string;
}
export const ActionIcon = ({ onClick, icon = '/icons/Edit Button.png', alt = 'Edit' }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    style={{ 
      width: 32, 
      height: 32, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }}
  >
    <img src={icon} alt={alt} style={{ width: 18, height: 18, objectFit: 'contain' }} />
  </button>
);
export const IconButton = ({ icon, alt = 'Icon' }: { icon: string; alt?: string }) => (
  <div style={{ 
    width: 32, 
    height: 32, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    cursor: 'pointer'
  }}>
    <img src={icon} alt={alt} style={{ width: 18, height: 18, objectFit: 'contain' }} />
  </div>
);
interface AddNewButtonProps {
  onClick: () => void;
  label?: string;
}
export const AddNewButton = ({ onClick, label = 'Add New' }: AddNewButtonProps) => (
  <button
    onClick={onClick}
    style={{
      background: '#30B33D',
      color: 'white',
      border: 'none',
      width: '147px',
      height: '35px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);