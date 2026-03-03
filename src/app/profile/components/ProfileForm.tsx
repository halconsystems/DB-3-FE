'use client';
import React, { useState } from 'react';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  onCancel?: () => void;
  onSave?: (data: ProfileFormData) => void;
}

interface ProfileFormData {
  idNumber: string;
  role: string;
  fullName: string;
  userName: string;
  cnic: string;
  vehicleTagId: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  cnicFront: File | null;
  cnicBack: File | null;
  profilePicture: File | null;
  isActive: boolean;
}

export default function ProfileForm({ onCancel, onSave }: ProfileFormProps) {
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    idNumber: '',
    role: '',
    fullName: '',
    userName: '',
    cnic: '',
    vehicleTagId: '',
    emailAddress: '',
    password: '',
    phoneNumber: '',
    cnicFront: null,
    cnicBack: null,
    profilePicture: null,
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave({ ...formData, isActive });
    }
  };

  return (
    <div className={styles.formContainer}>
      
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Please provide details below!</h2>
        <div className={styles.statusWrapper}>
          <span className={styles.statusLabel}>Status</span>
          <label className={styles.statusToggle}>
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={() => setIsActive(!isActive)} 
            />
            <span className={styles.statusSlider}></span>
            <span className={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</span>
          </label>
        </div>
      </div>

      
      <div className={styles.formGrid}>
        
        <div className={styles.capsule}>
          <label className={styles.labelGreen}>ID Number</label>
          <input 
            type="text" 
            name="idNumber"
            placeholder="Type here"
            className={styles.input}
            value={formData.idNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.capsule}>
          <label className={styles.labelRed}>Role</label>
          <div className={styles.selectWrapper}>
            <select 
              name="role"
              className={styles.select}
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="">Select Role here</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <img src="/icons/Arrow.png" alt="" className={styles.selectArrow} />
          </div>
        </div>

        
        <div className={styles.capsule}>
          <label className={styles.labelRed}>Full Name</label>
          <div className={styles.inputWithAvatar}>
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name here"
              className={styles.input}
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.capsule}>
          <label className={styles.labelGreen}>User Name</label>
          <input 
            type="text" 
            name="userName"
            placeholder="User name here"
            className={styles.input}
            value={formData.userName}
            onChange={handleInputChange}
          />
        </div>

        
        <div className={styles.capsule}>
          <label className={styles.labelGreen}>CNIC</label>
          <input 
            type="text" 
            name="cnic"
            placeholder="(12345-1234567-1)"
            className={styles.input}
            value={formData.cnic}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.capsule}>
          <label className={styles.labelGreen}>Vehicle Tag ID</label>
          <input 
            type="text" 
            name="vehicleTagId"
            placeholder="Vehicle Tag ID"
            className={styles.input}
            value={formData.vehicleTagId}
            onChange={handleInputChange}
          />
        </div>

        
        <div className={styles.capsule}>
          <label className={styles.labelRed}>Email Address</label>
          <input 
            type="email" 
            name="emailAddress"
            placeholder="Email Address here"
            className={styles.input}
            value={formData.emailAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.capsule}>
          <label className={styles.labelGreen}>Password</label>
          <input 
            type="password" 
            name="password"
            placeholder="Password here"
            className={styles.input}
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        
        <div className={styles.capsule}>
          <label className={styles.labelRed}>Phone Number</label>
          <input 
            type="text" 
            name="phoneNumber"
            placeholder="0301-2346550"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.capsuleEmpty}></div>

        
        <div className={styles.capsuleFile}>
          <div className={styles.fileLabelRow}>
            <label className={styles.labelRed}>CNIC Front</label>
            <label className={styles.plusButton}>
              +
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'cnicFront')}
              />
            </label>
          </div>
          <div className={styles.fileInfo}>
            <span className={styles.fileText}>Add Picture</span>
            <span className={styles.fileSubtext}>No file chosen</span>
          </div>
        </div>
        <div className={styles.capsuleFile}>
          <div className={styles.fileLabelRow}>
            <label className={styles.labelRed}>CNIC Back</label>
            <label className={styles.plusButton}>
              +
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'cnicBack')}
              />
            </label>
          </div>
          <div className={styles.fileInfo}>
            <span className={styles.fileText}>Add Picture</span>
            <span className={styles.fileSubtext}>No file chosen</span>
          </div>
        </div>

        
        <div className={styles.capsuleFileWithPreview}>
          <div className={styles.fileLabelRow}>
            <label className={styles.labelRed}>Profile Picture</label>
            <label className={styles.plusButton}>
              +
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profilePicture')}
              />
            </label>
          </div>
          <div className={styles.fileInfo}>
            <span className={styles.fileText}>Add Picture</span>
            <span className={styles.fileSubtext}>No file chosen</span>
          </div>
        <div className={styles.profilePreviewWrapper}>
          <div className={styles.profilePreview}>
            <img src="/icons/Profile Picture.jpg" alt="Preview" />
          </div>
        </div>
        </div>
      </div>

      
      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={styles.saveButton} onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}
