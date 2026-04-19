
"use client";

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
  error?: string;
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
  error,
}: CommonEntityFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  let pageName = pathname?.split('/')[1] ?? '';
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  if (pageName.includes('Residential')) {
    pageName = 'Member';
  } else pageName = '';

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
  

  // Helper for phone number masking and blocking further input
  const formatAndLimitPhone = (raw: string) => {
    // Remove all non-digits
    let digits = raw.replace(/\D/g, '');
    // Format for +92 3XX YYYYYYY
    if (digits.startsWith('92')) {
      digits = '+' + digits;
    }
    if (digits.startsWith('+92')) {
      // +92 3XX YYYYYYY
      if (digits.length > 12) digits = digits.slice(0, 12);
      let formatted = '+92 ';
      if (digits.length > 3) {
        formatted += digits.slice(3, 4); // 3
      }
      if (digits.length > 4) {
        formatted += digits.slice(4, 6); // XX
      }
      if (digits.length > 6) {
        formatted += ' ' + digits.slice(6, 13); // YYYYYYY
      }
      return formatted.trim();
    }
    // Format for 03XX-YYYYYYY
    if (digits.startsWith('03')) {
      if (digits.length > 11) digits = digits.slice(0, 11);
      let formatted = digits.slice(0, 4);
      if (digits.length > 4) {
        formatted += '-' + digits.slice(4, 11);
      }
      return formatted;
    }
    // Default: just digits, max 12
    return digits.slice(0, 12);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    // Phone/cell masking and block further input
    if (name === 'phoneNumber' || name === 'cellNumber') {
      const formatted = formatAndLimitPhone(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }

    // CNIC masking and block further input (XXXXX-XXXXXXX-X)
    if (name === 'cnic') {
      // Only allow digits, auto-insert dashes, max length 15
      let digits = value.replace(/\D/g, '');
      let formatted = '';
      if (digits.length > 5) {
        formatted += digits.slice(0, 5) + '-';
        if (digits.length > 12) {
          formatted += digits.slice(5, 12) + '-';
          formatted += digits.slice(12, 13);
        } else if (digits.length > 5) {
          formatted += digits.slice(5, 12);
        }
      } else {
        formatted = digits;
      }
      if (formatted.length > 15) formatted = formatted.slice(0, 15);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }



    // Vehicle No: only alphabet, max 4
    if (name === 'vehicleNo') {
      let alpha = value.replace(/[^A-Za-z]/g, '');
      if (alpha.length > 4) alpha = alpha.slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: alpha }));
      return;
    }

    // Vehicle No 2: only numeric, max 4
    if (name === 'vehicleNo2') {
      let numeric = value.replace(/\D/g, '');
      if (numeric.length > 4) numeric = numeric.slice(0, 4);
      setFormData((prev) => withDerivedVehicleLicensePlate({ ...prev, [name]: numeric }));
      return;
    }

    // eTagId (RFID) and tagNumber: format as 1234 5678 1234 5678, allow only 16 digits
    if (name === 'eTagId' || name === 'tagNumber') {
      let digits = value.replace(/\D/g, '');
      if (digits.length > 16) digits = digits.slice(0, 16);
      // Insert space every 4 digits
      let formatted = '';
      for (let i = 0; i < digits.length; i += 4) {
        if (i > 0) formatted += ' ';
        formatted += digits.slice(i, i + 4);
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'feeScaleId') {
      console.log('[CommonEntityForm] feeScaleId change', value);
    }

    if (name === 'licensePlate') {
      return;
    }

    // Autofill validFrom and validTo when trialPeriod changes
    if (name === 'trialPeriod') {
      const today = new Date();
      const validFrom = today.toISOString().split('T')[0];
      let validTo = validFrom;
      const days = Number(value);
      if (!isNaN(days) && days > 0) {
        const toDate = new Date(today);
        toDate.setDate(toDate.getDate() + days);
        validTo = toDate.toISOString().split('T')[0];
      }
      setFormData((prev) => withDerivedVehicleLicensePlate({ ...prev, [name]: value, validFrom, validTo }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (event.target as HTMLInputElement).checked }));
      return;
    }

    // Auto-fill validFrom and validTo when planType changes
    if (name === 'planType') {
      console.log('[CommonEntityForm] planType changed to:', value, 'type:', typeof value);
      const today = new Date();
      const validFrom = today.toISOString().split('T')[0];
      let validTo = validFrom;
      let daysToAdd = 0;
      
      // Convert to number for comparison
      const planTypeNum = Number(value);
      console.log('[CommonEntityForm] planTypeNum:', planTypeNum);
      
      switch (planTypeNum) {
        case 1: // Day
          daysToAdd = 1;
          break;
        case 2: // Week
          daysToAdd = 7;
          break;
        case 3: // Month
          daysToAdd = 30;
          break;
        case 4: // Year
          daysToAdd = 365;
          break;
        default:
          daysToAdd = 0;
      }
      
      console.log('[CommonEntityForm] daysToAdd:', daysToAdd);
      
      if (daysToAdd > 0) {
        const toDate = new Date(today);
        toDate.setDate(toDate.getDate() + daysToAdd);
        validTo = toDate.toISOString().split('T')[0];
      }
      
      console.log('[CommonEntityForm] validFrom:', validFrom, 'validTo:', validTo);
      setFormData((prev) => withDerivedVehicleLicensePlate({ ...prev, [name]: value, validFrom, validTo }));
      return;
    }
    setFormData((prev) => withDerivedVehicleLicensePlate({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {


    // eTagId (RFID) and tagNumber validation: must be exactly 16 digits, formatted as 1234 5678 1234 5678
    for (const field of ['eTagId', 'tagNumber']) {
      if (formData[field]) {
        const digits = formData[field].replace(/\D/g, '');
        if (digits.length !== 16) {
          setWarningMessage(`${field === 'eTagId' ? 'Vehicle E-Tag ID (RFID)' : 'Tag Number'} must be exactly 16 digits.`);
          setShowWarning(true);
          return;
        }
        if (!/^\d{4}( \d{4}){3}$/.test(formData[field])) {
          setWarningMessage(`${field === 'eTagId' ? 'Vehicle E-Tag ID (RFID)' : 'Tag Number'} must be in the format 1234 5678 1234 5678.`);
          setShowWarning(true);
          return;
        }
      }
    }

    // Card No validation: 1234 5678 1234 5678
    if (formData.cardNo && !/^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNo)) {
      setWarningMessage('Card No must be in the format 1234 5678 1234 5678.');
      setShowWarning(true);
      return;
    }

    // Tag Number 18-digit validation removed as requested
    console.log('[CommonEntityForm] submit clicked', formData);
    // Skipping required fields validation as requested

    // Custom validations
    // Contact No: 11 digits (phoneNumber or cellNumber)
    if (formData.phoneNumber && !/^\d{11}$/.test(formData.phoneNumber) && !/^\+92 3\d{2} \d{7}$/.test(formData.phoneNumber) && !/^03\d{2}-\d{7}$/.test(formData.phoneNumber)) {
      setWarningMessage('Contact Number must be exactly 11 digits.');
      setShowWarning(true);
      return;
    }
    if (formData.cellNumber && !/^\d{11}$/.test(formData.cellNumber) && !/^\+92 3\d{2} \d{7}$/.test(formData.cellNumber) && !/^03\d{2}-\d{7}$/.test(formData.cellNumber)) {
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

    // For phone/cell fields, pass maxLength to block further input
    if (field.name === 'phoneNumber' || field.name === 'cellNumber') {
      // maxLength: +92 3XX YYYYYYY = 13, 03XX-YYYYYYY = 12
      // Use 13 to allow both
      return (
        <TextInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
          maxLength={13}
        />
      );
    }
    // For CNIC field, pass maxLength 15
    if (field.name === 'cnic') {
      return (
        <TextInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
          maxLength={15}
        />
      );
    }
    // For vehicleNo field, only alphabet, maxLength 4
    if (field.name === 'vehicleNo') {
      return (
        <TextInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
          maxLength={4}
        />
      );
    }
    // For vehicleNo2 field, only numeric, maxLength 4
    if (field.name === 'vehicleNo2') {
      return (
        <TextInputField
          key={field.name}
          field={field}
          value={typeof formData[field.name] === 'string' ? (formData[field.name] as string) : ''}
          onChange={handleInputChange}
          styles={styles}
          wrapperClassName={wrapperClassName}
          maxLength={4}
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
      <div className={styles.innerForm}>
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
        {error && (
          <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fee', borderLeft: '4px solid #f44336', borderRadius: '4px', color: '#c62828', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <div className={styles.formGrid}>
          {renderedFields}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>
          {cancelButtonText}
        </button>
        <button type="button" className={styles.saveButton} onClick={handleSubmit} disabled={loading}>
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


