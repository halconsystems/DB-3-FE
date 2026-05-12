'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CustomDatePickers.module.css';

type PickerMode = 'single' | 'range';

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toYmd(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromYmd(value: string): Date | null {
  if (!value) return null;
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function sameDay(left: Date | null, right: Date | null): boolean {
  if (!left || !right) return false;
  return startOfDay(left) === startOfDay(right);
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = startOfDay(date);
  return time > startOfDay(start) && time < startOfDay(end);
}

function formatDisplay(value: string): string {
  if (!value) return '';

  const date = fromYmd(value);
  if (!date) return value;

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(
    new Date(year, month, 1)
  );
}

function buildWeeks(year: number, month: number): CalendarDate[][] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startOffset);
  const weeks: CalendarDate[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week: CalendarDate[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
      week.push({
        year: current.getFullYear(),
        month: current.getMonth(),
        day: current.getDate(),
      });
    }

    weeks.push(week);
  }

  return weeks;
}

function getCurrentMonthAnchor(initialValue?: string): Date {
  const selected = fromYmd(initialValue ?? '');
  return selected ?? new Date();
}

interface BaseCalendarProps {
  mode: PickerMode;
  label: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
}

interface SingleDatePickerProps extends BaseCalendarProps {
  mode: 'single';
  value: string;
  onChange: (value: string) => void;
}

interface RangeDatePickerProps extends BaseCalendarProps {
  mode: 'range';
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

type CustomDatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

export default function CustomDatePicker(props: CustomDatePickerProps) {
  const isRange = props.mode === 'range';
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const singleValue = props.mode === 'single' ? props.value : '';
  const rangeFromValue = props.mode === 'range' ? props.fromValue : '';
  const rangeToValue = props.mode === 'range' ? props.toValue : '';
  const monthOptions = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const [anchorDate, setAnchorDate] = useState(() =>
    props.mode === 'single'
      ? getCurrentMonthAnchor(props.value)
      : getCurrentMonthAnchor(props.fromValue || props.toValue)
  );
  const [draftSingle, setDraftSingle] = useState(props.mode === 'single' ? props.value : '');
  const [draftFrom, setDraftFrom] = useState(props.mode === 'range' ? props.fromValue : '');
  const [draftTo, setDraftTo] = useState(props.mode === 'range' ? props.toValue : '');

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const updatePanelPosition = (useVisibleHeight = false) => {
    const trigger = rootRef.current;
    const panel = panelRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const estimatedWidth = panel?.offsetWidth ?? 340;
    const estimatedHeight = panel?.offsetHeight ?? 0;
    const fallbackHeight = 416;
    const panelWidth = Math.min(estimatedWidth, window.innerWidth - 24);
    const viewportPadding = 12;
    const gap = 10;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - panelWidth - viewportPadding);
    const preferredLeft = rect.left;
    const left = Math.min(
      Math.max(viewportPadding, preferredLeft),
      maxLeft
    );
    const panelHeight = useVisibleHeight && estimatedHeight > 0 ? estimatedHeight : fallbackHeight;
    const availableBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
    const availableAbove = rect.top - gap - viewportPadding;
    const shouldOpenAbove = availableBelow < panelHeight && availableAbove > availableBelow;
    const preferredTop = shouldOpenAbove
      ? Math.max(viewportPadding, rect.top - gap - panelHeight)
      : rect.bottom + gap;
    const maxTop = Math.max(viewportPadding, window.innerHeight - viewportPadding - panelHeight);
    const top = Math.min(Math.max(viewportPadding, preferredTop), maxTop);
    const maxHeight = Math.max(180, window.innerHeight - viewportPadding * 2 - gap * 2);

    setPanelStyle({
      position: 'fixed',
      top,
      left,
      width: panelWidth,
      maxHeight,
      overflowY: 'auto',
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      if (props.mode === 'single') {
        setDraftSingle(singleValue);
        setAnchorDate(getCurrentMonthAnchor(singleValue));
      } else {
        setDraftFrom(rangeFromValue);
        setDraftTo(rangeToValue);
        setAnchorDate(getCurrentMonthAnchor(rangeFromValue || rangeToValue));
      }
    }
  }, [isOpen, props.mode, rangeFromValue, rangeToValue, singleValue]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    const onReposition = () => {
      updatePanelPosition();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', onPointerDown);
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('resize', onReposition);
      window.addEventListener('scroll', onReposition, true);
      updatePanelPosition(true);
    }

    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [isOpen]);

  const displayValue = props.mode === 'single'
    ? (singleValue ? formatDisplay(singleValue) : props.placeholder ?? 'Select date')
    : (rangeFromValue || rangeToValue
      ? `${formatDisplay(rangeFromValue || rangeToValue)} - ${formatDisplay(rangeToValue || rangeFromValue)}`
        : props.placeholder ?? 'Select date range');

    const selectedSingleDate = props.mode === 'single' ? fromYmd(draftSingle) : null;
    const selectedFromDate = props.mode === 'range' ? fromYmd(draftFrom) : null;
    const selectedToDate = props.mode === 'range' ? fromYmd(draftTo) : null;

  const openPicker = () => {
    if (props.readOnly) return;
    updatePanelPosition(false);
    setIsOpen(true);
    requestAnimationFrame(() => updatePanelPosition(true));
  };

  const prevMonth = () => {
    setAnchorDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setAnchorDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const prevYear = () => {
    setAnchorDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1));
  };

  const nextYear = () => {
    setAnchorDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1));
  };

  const handleMonthChange = (monthIndex: number) => {
    setAnchorDate((current) => new Date(current.getFullYear(), monthIndex, 1));
  };

  const handleYearChange = (year: number) => {
    setAnchorDate((current) => new Date(year, current.getMonth(), 1));
  };

  const handleDayClick = (calendarDate: CalendarDate) => {
    const nextValue = toYmd(new Date(calendarDate.year, calendarDate.month, calendarDate.day));

    if (props.mode === 'single') {
      setDraftSingle(nextValue);
      return;
    }

    if (!draftFrom || (draftFrom && draftTo)) {
      setDraftFrom(nextValue);
      setDraftTo('');
      return;
    }

    const fromDate = fromYmd(draftFrom);
    const clickedDate = fromYmd(nextValue);
    if (!fromDate || !clickedDate) return;

    if (startOfDay(clickedDate) < startOfDay(fromDate)) {
      setDraftTo(draftFrom);
      setDraftFrom(nextValue);
      return;
    }

    setDraftTo(nextValue);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
    if (props.mode === 'single') {
      props.onChange(draftSingle || props.value);
    } else {
      props.onFromChange(draftFrom || props.fromValue);
      props.onToChange(draftTo || props.toValue);
    }

    setIsOpen(false);
  };

  const weeks = buildWeeks(anchorDate.getFullYear(), anchorDate.getMonth());

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div ref={rootRef} className={`${styles.root} ${props.className ?? ''}`.trim()}>
      <button
        type="button"
        className={`${styles.trigger} ${props.buttonClassName ?? ''}`.trim()}
        onClick={openPicker}
        aria-label={props.label}
        disabled={props.readOnly}
      >
        <span className={displayValue ? styles.triggerValue : styles.triggerPlaceholder}>
          {displayValue}
        </span>
        <span className={styles.triggerIcon} aria-hidden="true">
          <img src="/icons/calendar.svg" alt="Calendar" className={styles.calendarIcon} />
        </span>
      </button>

      {isOpen && portalReady && createPortal(
        <div
          ref={panelRef}
          className={`${styles.panel} ${props.panelClassName ?? ''}`.trim()}
          role="dialog"
          aria-label={props.label}
          style={panelStyle}
        >
          <div className={styles.headerRow}>
            <div className={styles.navGroup}>
              <button type="button" className={styles.navButton} onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <label className={styles.selectWrap} aria-label="Month selector">
                <select
                  className={styles.selectButton}
                  value={anchorDate.getMonth()}
                  onChange={(event) => handleMonthChange(Number(event.target.value))}
                >
                  {monthOptions.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectIcon} />
              </label>
              <button type="button" className={styles.navButton} onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className={styles.navGroup}>
              <button type="button" className={styles.navButton} onClick={prevYear} aria-label="Previous year">
                <ChevronLeft size={18} />
              </button>
              <label className={styles.selectWrap} aria-label="Year selector">
                <select
                  className={styles.selectButton}
                  value={anchorDate.getFullYear()}
                  onChange={(event) => handleYearChange(Number(event.target.value))}
                >
                  {Array.from({ length: 21 }, (_, index) => anchorDate.getFullYear() - 10 + index).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectIcon} />
              </label>
              <button type="button" className={styles.navButton} onClick={nextYear} aria-label="Next year">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className={styles.weekHeader}>
            {dayHeaders.map((day) => (
              <span key={day} className={styles.weekDay}>{day}</span>
            ))}
          </div>

          <div className={styles.grid}>
            {weeks.flat().map((cell) => {
              const cellDate = new Date(cell.year, cell.month, cell.day);
              const cellYmd = toYmd(cellDate);
              const inCurrentMonth = cell.month === anchorDate.getMonth();
              const isSelectedSingle = props.mode === 'single' && sameDay(cellDate, selectedSingleDate);
              const isSelectedFrom = props.mode === 'range' && sameDay(cellDate, selectedFromDate);
              const isSelectedTo = props.mode === 'range' && sameDay(cellDate, selectedToDate);
              const isBetween = props.mode === 'range' && isInRange(cellDate, selectedFromDate, selectedToDate);
              const isRangeEdge = isSelectedFrom || isSelectedTo;

              return (
                <button
                  key={cellYmd}
                  type="button"
                  className={[
                    styles.dayCell,
                    inCurrentMonth ? styles.dayCellCurrentMonth : styles.dayCellMuted,
                    isSelectedSingle ? styles.dayCellSelectedSingle : '',
                    isRangeEdge ? styles.dayCellSelectedRangeEdge : '',
                    isBetween ? styles.dayCellRangeMiddle : '',
                    isSelectedFrom && selectedToDate ? styles.dayCellRangeStart : '',
                    isSelectedTo && selectedFromDate ? styles.dayCellRangeEnd : '',
                  ].join(' ').trim()}
                  onClick={() => handleDayClick(cell)}
                >
                  <span className={styles.dayText}>{cell.day}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className={styles.okButton} onClick={handleApply}>
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export function SingleDatePicker(props: Omit<SingleDatePickerProps, 'mode'>) {
  return <CustomDatePicker {...props} mode="single" />;
}

export function RangeDatePicker(props: Omit<RangeDatePickerProps, 'mode'>) {
  return <CustomDatePicker {...props} mode="range" />;
}