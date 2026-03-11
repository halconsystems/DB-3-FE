
'use client';
export const residentialFields: ProfileField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'emailAddress', label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Password here' },
  { name: 'phoneNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [ { value: 'resident', label: 'Resident' }, { value: 'commercial', label: 'Commercial' } ] },
  { name: 'subCategory', label: 'Sub-Category', type: 'select', required: true, options: [ { value: 'house', label: 'House' }, { value: 'shop', label: 'Shop' } ] },
  { name: 'phase', label: 'Phase', type: 'select', required: true, options: [ { value: 'phase1', label: 'Phase 1' }, { value: 'phase2', label: 'Phase 2' } ] },
  { name: 'zone', label: 'Zone', type: 'select', required: true, options: [ { value: 'zoneA', label: 'Zone A' }, { value: 'zoneB', label: 'Zone B' } ] },
  { name: 'khayaban', label: 'Khayaban', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'floor', label: 'Floor', type: 'text', required: true, placeholder: '2-Digits Only' },
  { name: 'laneStreetNumber', label: 'Lane/Street No.', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'plotNo1', label: 'Plot No.', type: 'text', required: true, placeholder: '123 Only' },
  { name: 'plotNo2', label: 'Plot No.', type: 'text', required: false, placeholder: 'ABC Only' },
  { name: 'plotNo3', label: 'Plot No.', type: 'text', required: false, placeholder: '55-C' },
  { name: 'cardNo', label: 'Card No./ID', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'cardStatus', label: 'Card Status', type: 'select', required: true, options: [ { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  { name: 'profilePicture', label: 'Profile Picture', type: 'file', required: false },
  { name: 'proofOfPossession', label: 'Proof of Possession', type: 'file', required: false },
];

import React, { useState } from 'react';
import styles from '../forms/ProfileForm.module.css';

export interface ProfileFormData {
  fullName?: string;
  emailAddress?: string;
  password?: string;
  phoneNumber?: string;
  category?: string;
  subCategory?: string;
  phase?: string;
  zone?: string;
  khayaban?: string;
  floor?: string;
  laneStreetNumber?: string;
  
  zoneName?: string;
  plotNo1?: string;
  plotNo2?: string;
  plotNo3?: string;
  cardNo?: string;
  issueDate?: string;
  expiryDate?: string;
  cardStatus?: string;
  profilePicture?: File | null;
  proofOfPossession?: File | null;
  isActive?: boolean;
  idNumber?: string;
  role?: string;
  userName?: string;
  cnic?: string;
  vehicleTagId?: string;
  cnicFront?: File | null;
  
  vehicleNo?: string;
  vehicleNo2?: string;
  licensePlate?: string;
  qrReference?: string;
  status?: string;
  quickPick?: string;
  fromDate?: string;
  toDate?: string;
  cnicBack?: File | null;
  
  search?: string;
  dob?: string;
  cardDelivery?: string;
  jobType?: string;
  fatherOrHusband?: string;
  cellNumber?: string;
  policeVerification?: string;
  address?: string;
  policeVerificationFile?: File | null;
  
  make?: string;
  model?: string;
  color?: string;
  year?: string;
  eTagId?: string;
  eTagType?: string;
  tagStatus?: string;
  attachment?: File | null;
  
  cpAgentName?: string;
  serverIp?: string;
  controller?: string;
  cpType?: string;
  tagLimit?: string;
  tagIdentityFix?: string;
  addPrinter?: string;
  printType?: string;
  interCommId?: string;
  interCommPassword?: string;
  interCommName?: string;
  laneType?: string;
  type?: string;
  laneReader?: string;
  readerSno?: string;
  manufacturer?: string;
  timeOut?: string;
  
  bankName?: string;
  bankCode?: string;
  accountNo?: string;
  iban?: string;
  branchCode?: string;
  branch?: string;
  
  serviceNo?: string;
  designation?: string;
  nextOfKin?: string;
  nextOfKinNumber?: string;
  tempPassword?: string;
  
  businessName?: string;
  city?: string;
  contactPerson?: string;
  cellNumber1?: string;
  cellNumber2?: string;
  vendorId?: string;
  
  packageName?: string;
  packageId?: string;
  minCharges?: string;
  minRenewalCharges?: string;
  
  phaseName?: string;
  description?: string;
}
export interface ProfileField {
  name: keyof ProfileFormData;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'file' | 'toggle';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}
interface ProfileFormProps {
  onCancel?: () => void;
  onSave?: (data: ProfileFormData) => void;
  initialValues?: Partial<ProfileFormData>;
  title?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  showStatusToggle?: boolean;
  fields?: ProfileField[];
}
export default function ProfileForm({
  onCancel,
  onSave,
  initialValues = {},
  title = 'Please provide details below!',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  loading = false,
  showStatusToggle = true,
  fields = [],
}: ProfileFormProps) {
  
  const [formData, setFormData] = useState<ProfileFormData>({ ...initialValues });
  const [isActive, setIsActive] = useState(initialValues.isActive ?? true);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
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
        <h2 className={styles.formTitle}>{title}</h2>
        {showStatusToggle && (
          <div className={styles.statusWrapper}>
            <span className={styles.statusLabel}>Member Status</span>
            <label className={styles.statusToggle}>
              <button
                type="button"
                onClick={() => setIsActive(prev => !prev)}
                className={`${styles.toggleButton} ${isActive ? styles.toggleActive : styles.toggleInactive}`}
                aria-pressed={isActive}
              >
                <span
                  className={`${styles.toggleText} ${isActive ? styles.textActive : styles.textInactive}`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>

                <span
                  className={`${styles.toggleCircle} ${isActive ? styles.circleActive : styles.circleInactive}`}
                />
              </button>
     
            </label>
          </div>
        )}
      </div>

      <div className={styles.formGrid}>
        {fields.map((field) => {
          if (field.type === 'file') {
            return (
              <div className={styles.capsuleFileWithPreview} key={field.name}>
                <div className={styles.fileLabelRow}>
                  <label className={styles.labelRed}>{field.label}{field.required && ' *'}</label>
                  <label className={styles.plusButton}>
                    +
                    <input
                      type="file"
                      accept={field.name === 'profilePicture' ? 'image/*' : undefined}
                      onChange={(e) => handleFileChange(e, field.name)}
                    />
                  </label>
                </div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileText}>Add Picture</span>
                  <span className={styles.fileSubtext}>{formData[field.name] ? 'File chosen' : 'No file chosen'}</span>
                </div>
                {field.name === 'profilePicture' && formData.profilePicture && (
                  <div className={styles.profilePreviewWrapper}>
                    <div className={styles.profilePreview}>
                      <img src={URL.createObjectURL(formData.profilePicture)} alt="Preview" />
                    </div>
                  </div>
                )}
              </div>
            );
          }
          if (field.type === 'select') {
            return (
              <div className={styles.capsule} key={field.name}>
                <label className={styles.labelRed}>{field.label}{field.required && ' *'}</label>
                <div className={styles.selectWrapper}>
                  <select
                    name={field.name}
                    className={styles.select}
                    value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <img src="/icons/Arrow.png" alt="" className={styles.selectArrow} />
                </div>
              </div>
            );
          }
          if (field.type === 'date') {
            return (
              <div className={styles.capsule} key={field.name}>
                <label className={styles.labelGreen}>{field.label}{field.required && ' *'}</label>
                <input
                  type="date"
                  name={field.name}
                  className={styles.input}
                  value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ''}
                  onChange={handleInputChange}
                />
              </div>
            );
          }
          if (field.type === 'toggle') {
            return (
              <div className={styles.capsule} key={field.name}>
                <label className={styles.labelGreen}>{field.label}{field.required && ' *'}</label>
                <input
                  type="checkbox"
                  name={field.name}
                  checked={!!formData[field.name]}
                  onChange={handleInputChange}
                />
              </div>
            );
          }
          
          return (
            <div className={styles.capsule} key={field.name}>
              <label className={styles.labelGreen}>{field.label}{field.required && ' *'}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className={styles.input}
                value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ''}
                onChange={handleInputChange}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>
          {cancelButtonText}
        </button>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : saveButtonText}
        </button>
      </div>
    </div>
  );
}
