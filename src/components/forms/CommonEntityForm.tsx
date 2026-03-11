'use client';

import React, { useState } from 'react';
import styles from './ProfileForm.module.css';
import type { ProfileField, ProfileFormData } from './FormTypes';
import {
  DateInputField,
  FileInputField,
  SelectInputField,
  TextInputField,
  ToggleInputField,
} from './CommonFormFields';
export type { ProfileField, ProfileFormData } from './FormTypes';

interface CommonEntityFormProps {
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

export default function CommonEntityForm({
  onCancel,
  onSave,
  initialValues = {},
  title = 'Please provide details below!',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  loading = false,
  showStatusToggle = true,
  fields = [],
}: CommonEntityFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({ ...initialValues });
  const [isActive, setIsActive] = useState(initialValues.isActive ?? true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (event.target as HTMLInputElement).checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
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
                onClick={() => setIsActive((prev) => !prev)}
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
        {fields.map((field) => {
          if (field.type === 'file') {
            return (
              <FileInputField
                key={field.name}
                field={field}
                formData={formData}
                onFileChange={handleFileChange}
                styles={styles}
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
            />
          );
        })}
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
  );
}


