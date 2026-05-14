 'use client';

import React from 'react';
import { SingleDatePicker } from '@/components/date-pickers/CustomDatePickers';
import type { ProfileField, ProfileFormData } from './FormTypes';
import CircularButton from '../ui/CircularButton';
import { resolvePublicMediaUrl } from '@/lib/resolveMediaUrl';

type CssModule = Record<string, string>;

type SizeValue = string | number;

const toCssSize = (value?: SizeValue): string | undefined => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
};

interface SharedFieldProps {
  field: ProfileField;
  styles: CssModule;
  wrapperClassName?: string;
}

interface InputFieldProps extends SharedFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SelectFieldProps extends SharedFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface DateFieldProps extends SharedFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ToggleFieldProps extends SharedFieldProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface RadioFieldProps extends SharedFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FileFieldProps extends SharedFieldProps {
  formData: Partial<ProfileFormData>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => void;
}

const getWrapperStyle = (field: ProfileField): React.CSSProperties => ({
  width: toCssSize(field.fieldWidth),
  minHeight: toCssSize(field.fieldHeight),
  gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined,  
});

const getInputStyle = (field: ProfileField): React.CSSProperties => ({
  width: toCssSize(field.inputWidth),
  height: toCssSize(field.inputHeight),
});

const getReadOnlyStyle = (field: ProfileField): React.CSSProperties => (
  field.readOnly
    ? {
        cursor: 'not-allowed',
        opacity: 0.7,
      }
    : {}
);

const getReadOnlyWrapperStyle = (field: ProfileField): React.CSSProperties => (
  field.readOnly
    ? {
        cursor: 'not-allowed',
      }
    : {}
);

// Add disabled prop for phone/cell auto-disable
export function TextInputField({ field, value, onChange, styles, wrapperClassName, maxLength }: InputFieldProps & { maxLength?: number }) {
  return (
    <div className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()} style={{ ...getWrapperStyle(field), ...getReadOnlyWrapperStyle(field) }}>
      <label className={styles.labelGreen}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        type={field.type}
        name={String(field.name)}
        placeholder={field.placeholder}
        className={styles.input}
        style={{ ...getInputStyle(field), ...getReadOnlyStyle(field) }}
        value={value}
        onChange={field.readOnly ? undefined : onChange}
        readOnly={field.readOnly}
        maxLength={maxLength}
      />
    </div>
  );
}

export function SelectInputField({ field, value, onChange, styles, wrapperClassName }: SelectFieldProps) {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const openSelectDropdown = () => {
    if (field.readOnly) {
      return;
    }

    const selectElement = selectRef.current;

    if (!selectElement) {
      return;
    }

    const pickerSelect = selectElement as HTMLSelectElement & { showPicker?: () => void };

    if (typeof pickerSelect.showPicker === 'function') {
      pickerSelect.showPicker();
      return;
    }

    selectElement.focus();
    selectElement.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    if (field.onChange) {
      field.onChange(e.target.value);
    }
  };

  return (
    <div className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()} style={{ ...getWrapperStyle(field), ...getReadOnlyWrapperStyle(field) }}>
      <label className={styles.labelGreen}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <div className={styles.selectWrapper}>
        <select
          ref={selectRef}
          id={String(field.name)}
          name={String(field.name)}
          className={styles.select}
          style={{ ...getInputStyle(field), ...getReadOnlyStyle(field) }}
          value={value}
          onChange={field.readOnly ? undefined : handleChange}
          disabled={field.readOnly}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value} >
              {option.label}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-100%)', cursor: field.readOnly ? 'not-allowed' : 'pointer' }}>
          <CircularButton imagePath='/icons/DownArrow.svg' width="24px" height="24px" onClick={openSelectDropdown} />
        </div>
      </div>
    </div>
  );
}

export function DateInputField({ field, value, onChange, styles, wrapperClassName }: DateFieldProps) {
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    if (field.readOnly) {
      return;
    }

    const dateInput = dateInputRef.current;

    if (!dateInput) {
      return;
    }

    const pickerInput = dateInput as HTMLInputElement & { showPicker?: () => void };

    if (typeof pickerInput.showPicker === 'function') {
      pickerInput.showPicker();
      return;
    }

    dateInput.focus();
    dateInput.click();
  } ;

  return (
    <div
      className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()}
      style={{ ...getWrapperStyle(field), ...getReadOnlyWrapperStyle(field), position: 'relative' }}
    >
      <label className={styles.labelGreen}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <SingleDatePicker
        className={styles.input}
        buttonClassName={styles.dateInput}
        label={field.label}
        value={value}
        onChange={(val) => {
          const fakeEvent = { target: { name: String(field.name), value: val } } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(fakeEvent);
        }}
        placeholder={field.placeholder || field.label}
        readOnly={field.readOnly}
      />
    </div>
  );
}

export function ToggleInputField({ field, checked, onChange, styles, wrapperClassName }: ToggleFieldProps) {
  return (
    <div className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()} style={getWrapperStyle(field)}>
      <label className={styles.labelGreen}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        type="checkbox"
        name={String(field.name)}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

export function RadioCardInputField({ field, value, onChange, styles, wrapperClassName }: RadioFieldProps) {
  const options = field.options ?? [];

  return (
    <div className={`${styles.capsule} ${styles.radioCapsule} ${wrapperClassName ?? ''}`.trim()} style={getWrapperStyle(field)}>
      <label className={styles.formTitle}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <div className={styles.radioCards}>
        {options.map((option) => {
          const radioId = `${field.name}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <label key={option.value} style={{flexDirection: "row", justifyContent:"flex-start", gap: "16px", alignItems: "center"}} htmlFor={radioId} className={`${styles.capsule} ${isChecked ? styles.radioCardActive : ''}`.trim()}>
              <input
                id={radioId}
                type="radio"
                name={String(field.name)}
                value={option.value}
                checked={isChecked}
                onChange={onChange}
                className={styles.radioInput}
              />
              <span className={styles.radioIndicator} aria-hidden="true" />
              <span className={styles.radioLabel}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

const IMAGE_ATTACHMENT_FIELDS = new Set<keyof ProfileFormData>([
  'profilePicture',
  'cnicFront',
  'cnicBack',
  'policeVerificationFile',
]);

export function FileInputField({ field, formData, onFileChange, styles, wrapperClassName }: FileFieldProps) {
  const raw = formData[field.name];
  const hasUploaded =
    (typeof raw === 'string' && raw.trim() !== '') || raw instanceof File;
  let previewSrc = '';
  if (typeof raw === 'string' && raw.trim()) {
    previewSrc = resolvePublicMediaUrl(raw);
  } else if (raw instanceof File) {
    previewSrc = URL.createObjectURL(raw);
  }
  const showImagePreview =
    previewSrc && IMAGE_ATTACHMENT_FIELDS.has(field.name);

  return (
    <div className={`${styles.capsuleFileWithPreview} ${wrapperClassName ?? ''}`.trim()} style={getWrapperStyle(field)}>
      <div className={styles.fileLabelRow}>
        <label className={styles.labelGreen}>
          {field.label}
          {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
        </label>
        <label className={styles.plusButton}>
          <img src="/icons/plus.svg" alt="" />
          <input
            type="file"
            accept={field.name === 'profilePicture' ? 'image/*' : undefined}
            onChange={(event) => onFileChange(event, field.name)}
          />
        </label>
      </div>
      <div className={styles.fileInfo}>
        <span className={styles.fileText}>Add Picture</span>
        <span className={hasUploaded ? styles.fileSubtext : styles.fileSubtextInactive}>
          {hasUploaded ? 'File has been uploaded' : 'No file chosen'}
        </span>
      </div>
      {showImagePreview &&
        (field.name === 'profilePicture' ? (
          <div className={styles.profilePreviewWrapper}>
            <div className={styles.profilePreview}>
              <img src={previewSrc} alt="" />
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 10, width: '100%', maxWidth: 280 }}>
            <div
              style={{
                maxHeight: 180,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                background: '#fafafa',
              }}
            >
              <img src={previewSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', maxHeight: 180 }} />
            </div>
          </div>
        ))}
    </div>
  );
}


// StatusSwitch toggle button (styled like top-right status toggle)
interface StatusSwitchFieldProps extends SharedFieldProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function StatusSwitchInputField({ field, checked, onChange, styles, wrapperClassName, disabled = false }: StatusSwitchFieldProps) {
  return (<div>
      <label className={styles.formTitle}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <button
        type="button"
        onClick={() => {
          if (disabled) {
            return;
          }
          // Simulate checkbox event for compatibility
          const fakeEvent = {
            target: { name: String(field.name), checked: !checked, type: 'checkbox' }
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(fakeEvent);
        }}
        className={`${styles.toggleButton} ${checked ? styles.toggleActive : styles.toggleInactive}`}
        aria-pressed={checked}
        disabled={disabled}
        style={disabled ? { cursor: 'not-allowed', opacity: 0.7 } : undefined}
      >
        <span className={`${styles.toggleText} ${checked ? styles.textActive : styles.textInactive}`}>
          {checked ? 'Active' : 'Inactive'}
        </span>
        <span className={`${styles.toggleCircle} ${checked ? styles.circleActive : styles.circleInactive}`} />
      </button>
  </div>);
}