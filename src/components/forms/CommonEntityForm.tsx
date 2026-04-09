'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './ProfileForm.module.css';
import SuccessModal from '../popup/SuccessModal';
import WarningModal from '../popup/WarningModal';
import Loader from '../ui/loader';
import { normalizeFormStatuses } from '../../lib/statusUtils';
import type { ProfileField, ProfileFormData } from './FormTypes';
import {
  DateInputField,
  FileInputField,
  RadioCardInputField,
  SelectInputField,
  TextInputField,
  ToggleInputField,
  StatusSwitchInputField,
} from './CommonFormFields';
export type { ProfileField, ProfileFormData } from './FormTypes';

interface CommonEntityFormProps {
  onCancel?: () => void;
  onSave?: (data: ProfileFormData) => void | Promise<void>;
  initialValues?: Partial<ProfileFormData> | any;
  title?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  showStatusToggle?: boolean;
  fields?: ProfileField[];
  successTitle?: string;
  successMessage?: string;
}

const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
  const firstPart = (vehicleNo ?? '').trim();
  const secondPart = (vehicleNo2 ?? '').trim();

  if (!firstPart && !secondPart) {
    return '';
  }
  return `${firstPart}-${secondPart}`;
};

const withDerivedVehicleLicensePlate = (data: ProfileFormData): ProfileFormData => {
  const hasVehicleFields = data.vehicleNo !== undefined || data.vehicleNo2 !== undefined || data.licensePlate !== undefined;

  if (!hasVehicleFields) {
    return data;
  }

  return {
    ...data,
    licensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
  };
};

export default function CommonEntityForm({
  onCancel,
  onSave,
  initialValues = {},
  title = 'Please provide details below!',
  saveButtonText = 'Add',
  cancelButtonText = 'Cancel',
  loading = false,
  showStatusToggle = true,
  fields = [],
  successTitle,
  successMessage,
}: CommonEntityFormProps) {
  
  const pathname = usePathname();
  const router = useRouter();
  let pageName = pathname?.split('/')[1] ?? '';
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  if (pageName.includes('Residential')) {
    pageName = 'Member';
  }
  else pageName = ''

  const [formData, setFormData] = useState<ProfileFormData>(
    withDerivedVehicleLicensePlate(normalizeFormStatuses({ ...initialValues }))
  );
  const [isActive, setIsActive] = useState(initialValues.isActive ?? true);
  React.useEffect(() => {
    // Only update if initialValues actually changed (shallow compare)
    setFormData((prev) => {
      const prevKeys = Object.keys(prev);
      const initKeys = Object.keys(initialValues);
      if (
        prevKeys.length !== initKeys.length ||
        prevKeys.some((k) => prev[k as keyof ProfileFormData] !== initialValues[k as keyof ProfileFormData])
      ) {
        return withDerivedVehicleLicensePlate(normalizeFormStatuses({ ...initialValues }));
      }
      return prev;
    });
    setIsActive(initialValues.isActive ?? true);
  }, [JSON.stringify(initialValues)]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (name === 'feeScaleId') {
      console.log('[CommonEntityForm] feeScaleId change', value);
    }

    if (name === 'licensePlate') {
      return;
    }

    // Autofill validFrom and validTo when planType changes
    if (name === 'planType') {
      console.log('[CommonEntityForm] planType change:', value);
      const today = new Date();
      const validFrom = today.toISOString().split('T')[0];
      let validTo = validFrom;
      
      if (value === 'Day') {
        validTo = validFrom;
      } else if (value === 'Week') {
        const toDate = new Date(today);
        toDate.setDate(toDate.getDate() + 7);
        validTo = toDate.toISOString().split('T')[0];
      } else if (value === 'Month') {
        const toDate = new Date(today);
        toDate.setDate(toDate.getDate() + 30);
        validTo = toDate.toISOString().split('T')[0];
      } else if (value === 'Year') {
        const toDate = new Date(today);
        toDate.setDate(toDate.getDate() + 365);
        validTo = toDate.toISOString().split('T')[0];
      }
      
      console.log('[CommonEntityForm] planType autofill:', { validFrom, validTo, planType: value });
      setFormData((prev) => withDerivedVehicleLicensePlate({ ...prev, [name]: value, validFrom, validTo }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (event.target as HTMLInputElement).checked }));
      return;
    }

    setFormData((prev) => withDerivedVehicleLicensePlate({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  // Validate required fields
  const validateRequiredFields = (): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        
        // Check for empty values
        if (value === null || value === undefined || value === '') {
          missingFields.push(field.label);
        }
        
        // For select fields, also check if empty string is selected
        if (field.type === 'select' && value === '') {
          missingFields.push(field.label);
        }
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  };

  // Check if form is valid (for button disabled state)
  const isFormValid = (): boolean => {
    const { isValid } = validateRequiredFields();
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate required fields FIRST
    const { isValid, missingFields } = validateRequiredFields();
    if (!isValid) {
      setWarningMessage(`Please fill in all required fields:\n${missingFields.join(', ')}`);
      setShowWarning(true);
      return;
    }

    // RFID 18-digit validation
    if (formData.rfidCardNo && !/^\d{18}$/.test(formData.rfidCardNo)) {
      setWarningMessage('RFID Card No must be exactly 18 digits.');
      setShowWarning(true);
      return;
    }

    // Tag Number 18-digit validation removed as requested
    console.log('[CommonEntityForm] submit clicked', formData);

    // Custom validations
    const normalizePakistaniPhone = (phone:string) => {
      // Remove all spaces, dashes, parentheses
      let cleaned = phone.replace(/[\s\-\(\)]/g, '');
      
      // Handle +92XXXXXXXXXX or 92XXXXXXXXXX → 0XXXXXXXXX
      if (cleaned.startsWith('+92')) {
        cleaned = '0' + cleaned.slice(3);
      } else if (cleaned.startsWith('92') && cleaned.length === 12) {
        cleaned = '0' + cleaned.slice(2);
      }
      
      return cleaned;
    };

    const isValidPakistaniPhone = (phone:string) => {
      const normalized = normalizePakistaniPhone(phone);
      // Must be exactly 11 digits starting with 03
      return /^03\d{9}$/.test(normalized);
    };

    // Contact No: 11 digits (phoneNumber or cellNumber)
    if (formData.phoneNumber) {
      if (!isValidPakistaniPhone(formData.phoneNumber)) {
        setWarningMessage('Please enter a valid Pakistani phone number.');
        setShowWarning(true);
        return;
      }
      // Optionally normalize before saving
      formData.phoneNumber = normalizePakistaniPhone(formData.phoneNumber);
    }
    if (formData.cellNumber && !/^\d{11}$/.test(formData.cellNumber)) {
      setWarningMessage('Contact Number must be exactly 11 digits.');
      setShowWarning(true);
      return;
    }
    // CNIC: 13 digits
    if (formData.cnic && (!/^\d{13}$/.test(formData.cnic) && !/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic))) {
      setWarningMessage('CNIC must be exactly 13 digits.');
      setShowWarning(true);
      return;
    }


    // Email validation for both 'email' and 'emailAddress' fields
    const emailToValidate = formData.email || formData.emailAddress;
    if (emailToValidate && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)) {
      setWarningMessage('Please enter a valid email address.');
      setShowWarning(true);
      return;
    }

    if(formData.licensePlate && !/^[A-Za-z]+-\d+$/.test(formData.licensePlate)) {
      setWarningMessage('License Plate must be in format ABC-123.');
      setShowWarning(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(withDerivedVehicleLicensePlate({ ...formData, isActive }));
      }
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: ProfileField, wrapperClassName?: string) => {
    if (field.type === 'file') {
      return (
        <FileInputField
          key={field.name}
          field={field}
          formData={formData}
          onFileChange={handleFileChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <SelectInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
        />
      );
    }

    if (field.type === 'date') {
      return (
        <DateInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
        />
      );
    }

    if (field.type === 'radio') {
      return (
        <RadioCardInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
        />
      );
    }

    if (field.type === 'toggle') {
      return (
        <ToggleInputField
          key={field.name}
          field={field}
          checked={!!formData[field.name]}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
        />
      );
    }

    if (field.type === 'statusSwitch') {
      return (
        <StatusSwitchInputField
          key={field.name}
          field={field}
          checked={!!formData[field.name]}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
        />
      );
    }

    return (
      <TextInputField
        key={field.name}
        field={field}
        value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
        onChange={handleInputChange}
        styles={styles}
        wrapperClassName={wrapperClassName}
      />
    );
  };

  const renderedFields: React.ReactNode[] = [];

  const getFieldClassName = (baseClassName?: string, isHidden?: boolean) => {
    if (!isHidden) {
      return baseClassName;
    }

    return [baseClassName, styles.hiddenCapsule].filter(Boolean).join(' ');
  };

  // Separate statusSwitch fields for header, others for grid
  const statusSwitchFields = fields.filter(f => f.type === 'statusSwitch');
  for (let index = 0; index < fields.length; index += 1) {
    const field = fields[index];
    if (field.type === 'statusSwitch') continue; // skip from grid
    if (!field.sameCellKey) {
      renderedFields.push(renderField(field, getFieldClassName(undefined, field.isHidden)));
      continue;
    }
    const groupedFields: ProfileField[] = [field];
    let nextIndex = index + 1;
    while (nextIndex < fields.length && fields[nextIndex].sameCellKey === field.sameCellKey) {
      groupedFields.push(fields[nextIndex]);
      nextIndex += 1;
    }
    index = nextIndex - 1;
    renderedFields.push(
      <div
        key={`same-cell-${field.sameCellKey}-${field.name}`}
        className={styles.groupedCell}
        style={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}
      >
        <div
          className={styles.groupedCellGrid}
          style={{
            gridTemplateColumns: `repeat(${field.sameCellColumns ?? groupedFields.length}, minmax(0, 1fr))`,
          }}
        >
          {groupedFields.map((groupField) => renderField(groupField, getFieldClassName(styles.groupedCellItem, groupField.isHidden)))}
        </div>
      </div>
    );
  }

  const isEditMode = saveButtonText.toLowerCase().includes('edit');

  if (loading || isSubmitting) {
    return <Loader />;
  }

    return (
    <>
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>{title}</h2>
        {statusSwitchFields.length > 0 && (
          <div className={styles.statusWrapper} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {statusSwitchFields.map(field => (
              <StatusSwitchInputField
                key={field.name as string}
                field={field}
                checked={!!formData[field.name]}
                onChange={handleInputChange}
                styles={styles}
                wrapperClassName={styles.statusToggle}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.formGrid}>
        {renderedFields}
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>
          {cancelButtonText}
        </button>
        <button 
          type="button" 
          className={styles.saveButton} 
          onClick={handleSubmit} 
          disabled={loading || !isFormValid()}
          title={!isFormValid() ? 'Please fill in all required fields' : ''}
        >
          {loading ? 'Saving...' : saveButtonText}
        </button>
      </div>
    </div>
    <SuccessModal
      isOpen={showSuccess}
      onClose={() => {
        setShowSuccess(false);
        router.back();
      }}
      title={successTitle || (isEditMode ? 'Record Updated' : 'Record Added')}
      message={successMessage || (isEditMode ? 'The record has been updated successfully.' : 'The record has been added successfully.')}
    />
    <WarningModal
      isOpen={showWarning}
      onClose={() => setShowWarning(false)}
      onConfirm={() => setShowWarning(false)}
      title="Required Fields Missing"
      message={warningMessage}
      confirmText="OK"
      cancelText=""
    />
    </>
  );
}


