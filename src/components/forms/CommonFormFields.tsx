'use client';

import React from 'react';
import type { ProfileField, ProfileFormData } from './FormTypes';

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

interface FileFieldProps extends SharedFieldProps {
  formData: Partial<ProfileFormData>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => void;
}

const getWrapperStyle = (field: ProfileField): React.CSSProperties => ({
  width: toCssSize(field.fieldWidth),
  minHeight: toCssSize(field.fieldHeight),
});

const getInputStyle = (field: ProfileField): React.CSSProperties => ({
  width: toCssSize(field.inputWidth),
  height: toCssSize(field.inputHeight),
});

export function TextInputField({ field, value, onChange, styles }: InputFieldProps) {
  return (
    <div className={styles.capsule} key={field.name} style={getWrapperStyle(field)}>
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

export function SelectInputField({ field, value, onChange, styles }: SelectFieldProps) {
  return (
    <div className={styles.capsule} key={field.name} style={getWrapperStyle(field)}>
      <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
      <div className={styles.selectWrapper}>
        <select
          name={field.name}
          className={styles.select}
          style={getInputStyle(field)}
          value={value}
          onChange={onChange}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img src="/icons/Arrow.png" alt="" className={styles.selectArrow} />
      </div>
    </div>
  );
}

export function DateInputField({ field, value, onChange, styles }: DateFieldProps) {
  return (
    <div className={styles.capsule} key={field.name} style={getWrapperStyle(field)}>
      <label className={field.required ? styles.labelRed : styles.labelGreen}>{field.label}</label>
      <input
        type="date"
        name={field.name}
        className={styles.input}
        style={getInputStyle(field)}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export function ToggleInputField({ field, checked, onChange, styles }: ToggleFieldProps) {
  return (
    <div className={styles.capsule} key={field.name} style={getWrapperStyle(field)}>
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

export function FileInputField({ field, formData, onFileChange, styles }: FileFieldProps) {
  return (
    <div className={styles.capsuleFileWithPreview} key={field.name} style={getWrapperStyle(field)}>
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


