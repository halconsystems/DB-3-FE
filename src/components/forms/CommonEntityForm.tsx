'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './ProfileForm.module.css';
import SuccessModal from '../popup/SuccessModal';
import WarningModal from '../popup/WarningModal';
import Loader from '../ui/loader';
import type { ProfileField, ProfileFormData } from './FormTypes';
import {
  DateInputField,
  FileInputField,
  RadioCardInputField,
  SelectInputField,
  TextInputField,
  ToggleInputField,
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
}: CommonEntityFormProps) {
  
  const pathname = usePathname();
  const router = useRouter();
  let pageName = pathname?.split('/')[1] ?? '';
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  if (pageName.includes('Residential')) {
    pageName = 'Member';
  }
  else pageName = ''

  const [formData, setFormData] = useState<ProfileFormData>(withDerivedVehicleLicensePlate({ ...initialValues }));
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
        return withDerivedVehicleLicensePlate({ ...initialValues });
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

    if (name === 'licensePlate') {
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

  const handleSubmit = async () => {
    // Validate required fields
    if (fields && fields.length > 0) {
      const missingFields = fields.filter(
        (field) => field.required && (
          formData[field.name] === undefined ||
          formData[field.name] === null ||
          (typeof formData[field.name] === 'string' && (formData[field.name] as string).trim() === '')
        )
      );
      if (missingFields.length > 0) {
        // setWarningMessage('Please fill all the required fields.');
        // setShowWarning(true);
        return;
      }
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

  for (let index = 0; index < fields.length; index += 1) {
    const field = fields[index];

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
        {showStatusToggle && (
          <div className={styles.statusWrapper}>
            <span className={styles.statusLabel}>{pageName} Status</span>
            <label className={styles.statusToggle}>
              <button
                type="button"
                onClick={() => setIsActive((prev: boolean) => !prev)}
                className={`${styles.toggleButton} ${isActive ? styles.toggleActive : styles.toggleInactive}`}
                aria-pressed={isActive}
              >
                <span className={`${styles.toggleText} ${isActive ? styles.textActive : styles.textInactive}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`${styles.toggleCircle} ${isActive ? styles.circleActive : styles.circleInactive}`} />
              </button>
            </label>
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
      title={isEditMode ? 'Record Updated' : 'Record Added'}
      message={isEditMode ? 'The record has been updated successfully.' : 'The record has been added successfully.'}
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


