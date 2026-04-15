'use client';

import React from 'react';
import type { ProfileField, ProfileFormData } from './FormTypes';
import CircularButton from '../ui/CircularButton';

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

// Add disabled prop for phone/cell auto-disable
export function TextInputField({ field, value, onChange, styles, wrapperClassName, maxLength }: InputFieldProps & { maxLength?: number }) {
  return (
    <div className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()} style={getWrapperStyle(field)}>
      <label className={styles.labelGreen}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        type={field.type}
        name={String(field.name)}
        placeholder={field.placeholder}
        className={styles.input}
        style={getInputStyle(field)}
        value={value}
        onChange={onChange}
        readOnly={field.readOnly}
        maxLength={maxLength}
      />
    </div>
  );
}

export function SelectInputField({ field, value, onChange, styles, wrapperClassName }: SelectFieldProps) {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const openSelectDropdown = () => {
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

  return (
    <div className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()} style={getWrapperStyle(field)}>
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
          style={getInputStyle(field)}
          value={value}
          onChange={onChange}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value} >
              {option.label}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: '0', top: '-150%' }}>
          <CircularButton imagePath='/icons/DownArrow.svg' width="24px" height="24px" onClick={openSelectDropdown} />
        </div>
      </div>
    </div>
  );
}

export function DateInputField({ field, value, onChange, styles, wrapperClassName }: DateFieldProps) {
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
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
  };

  return (
    <div
      className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()}
      style={{ ...getWrapperStyle(field), position: 'relative' }}
    >
      <label className={styles.labelGreen}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        ref={dateInputRef}
        type="date"
        name={String(field.name)}
        className={styles.input + " " + styles.dateInput}
        style={getInputStyle(field)}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder || field.label}
      />
      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
        <CircularButton imagePath='/icons/Calendar.svg' width="24px" height="24px" onClick={openDatePicker} />
      </div> 
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

export function FileInputField({ field, formData, onFileChange, styles, wrapperClassName }: FileFieldProps) {
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
        <span className={formData[field.name] ? styles.fileSubtext : styles.fileSubtextInactive}>{formData[field.name] ? 'File has been uploaded' : 'No file chosen'}</span>
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


// StatusSwitch toggle button (styled like top-right status toggle)
interface StatusSwitchFieldProps extends SharedFieldProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StatusSwitchInputField({ field, checked, onChange, styles, wrapperClassName }: StatusSwitchFieldProps) {
  return (<div>
      <label className={styles.formTitle}>
        {field.label}
        {field.required && <span style={{ color: '#ff1744', marginLeft: '4px' }}>*</span>}
      </label>
      <button
        type="button"
        onClick={() => {
          // Simulate checkbox event for compatibility
          const fakeEvent = {
            target: { name: String(field.name), checked: !checked, type: 'checkbox' }
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(fakeEvent);
        }}
        className={`${styles.toggleButton} ${checked ? styles.toggleActive : styles.toggleInactive}`}
        aria-pressed={checked}
      >
        <span className={`${styles.toggleText} ${checked ? styles.textActive : styles.textInactive}`}>
          {checked ? 'Active' : 'Inactive'}
        </span>
        <span className={`${styles.toggleCircle} ${checked ? styles.circleActive : styles.circleInactive}`} />
      </button>
  </div>);
}