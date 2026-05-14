'use client';

import { useState } from 'react';
import styles from './DateRangeSelector.module.css';
import CustomDatePicker from '@/components/date-pickers/CustomDatePickers';

interface DateRangeSelectorProps {
  onDateRangeChange?: (from: string, to: string) => void;
}

export default function DateRangeSelector({ onDateRangeChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState<string>('21/02/26');
  const [to, setTo] = useState<string>('20/03/26');

  return (
    <div className={styles.dateRangeContainer}>
      <button 
        className={styles.dateRangeButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.dateRangeText}>{from} - {to}</span>
        <img src="/icons/Calendar.svg" alt="Calendar" className={styles.calendarIcon} />
      </button>

      {isOpen && (
        <div className={styles.datePickerWrapper}>
          <CustomDatePicker
            mode="range"
            label="Select date range"
            fromValue={from}
            toValue={to}
            onFromChange={(fromDate) => {
              setFrom(fromDate);
              onDateRangeChange?.(fromDate, to);
            }}
            onToChange={(toDate) => {
              setTo(toDate);
              onDateRangeChange?.(from, toDate);
            }}
            placeholder="Select date range"
          />
        </div>
      )}
    </div>
  );
}
