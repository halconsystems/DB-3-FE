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

export function TextInputField({ field, value, onChange, styles, wrapperClassName }: InputFieldProps) {
  return (
    <div className={`${styles.capsule} ${wrapperClassName ?? ''}`.trim()} style={getWrapperStyle(field)}>
      <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
      <input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        className={styles.input}
        style={getInputStyle(field)}
        value={value}
        onChange={onChange}
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
      <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
      <div className={styles.selectWrapper}>
        <select
          ref={selectRef}
          id={field.name}
          name={field.name}
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
      <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
      <input
        ref={dateInputRef}
        type="date"
        name={field.name}
        className={styles.input + " " + styles.dateInput}
        style={getInputStyle(field)}
        value={value}
        onChange={onChange}
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
      <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
      <input
        type="checkbox"
        name={field.name}
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
      <label className={styles.formTitle + " " + (field.required ? styles.radioRed : '')}>{field.label}</label>
      <div className={styles.radioCards}>
        {options.map((option) => {
          const radioId = `${field.name}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <label key={option.value} style={{flexDirection: "row", justifyContent:"flex-start", gap: "16px", alignItems: "center"}} htmlFor={radioId} className={`${styles.capsule} ${isChecked ? styles.radioCardActive : ''}`.trim()}>
              <input
                id={radioId}
                type="radio"
                name={field.name}
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
        <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
        <label className={styles.plusButton}>
          +
          <input
            type="file"
            accept={field.name === 'profilePicture' ? 'image/*' : undefined}
            onChange={(event) => onFileChange(event, field.name)}
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


