'use client';
import React, { useState, ReactNode } from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => ReactNode;
}
export interface Tab {
  key: string;
  label: string;
}
export interface DataTableProps<T> {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  columns: Column<T>[];
  data: T[];
  addButtonLabel?: string;
  onAddClick?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  showAddButton?: boolean;
  getRowStatus?: (row: T) => 'Active' | 'Inactive' | 'Pending' | undefined;
  headerContent?: React.ReactNode;
}
export function StatusBadge({ status }: { status: 'Active' | 'Inactive' | 'Pending' | string }) {
  const getStatusClass = () => {
    switch (status) {
      case 'Active': return styles.statusActive;
      case 'Inactive': return styles.statusInactive;
      case 'Pending': return styles.statusPending;
      default: return styles.statusInactive;
    }
  };
  return (
    <span className={`${styles.statusBadge} ${getStatusClass()}`}>
      {status}
    </span>
  );
}
export default function DataTable<T extends Record<string, any>>({
  tabs,
  activeTab,
  onTabChange,
  columns,
  data,
  addButtonLabel = 'Add New',
  onAddClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  emptyMessage = 'No data available',
  showAddButton = true,
  getRowStatus,
  headerContent,
}: DataTableProps<T>) {
  const getRowClassName = (row: T) => {
    const status = getRowStatus?.(row);
    if (status === 'Active') return styles.rowActive;
    if (status === 'Inactive') return styles.rowInactive;
    return '';
  };
  
  const renderCell = (column: Column<T>, row: T) => {
    const value = column.key.toString().includes('.') 
      ? column.key.toString().split('.').reduce((obj, key) => obj?.[key], row as any)
      : row[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, row);
    }
    return value ?? 'N/A';
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;
    
    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      pages.push(i);
    }

    if (totalPages > maxVisiblePages) {
      
    }
    return (
      <div className={styles.pagination}>
        <button 
          className={styles.paginationButton}
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages.map((page, index) => (
          <button
            key={index}
            className={`${styles.pageNumber} ${page === currentPage ? styles.pageNumberActive : ''}`}
            onClick={() => typeof page === 'number' && onPageChange?.(page)}
          >
            {page}
          </button>
        ))}
        <button 
          className={styles.paginationButton}
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {showAddButton && (
        <div className={styles.addButtonWrapper}>
          <button className={styles.addButton} onClick={onAddClick}>
            {addButtonLabel}
          </button>
        </div>
      )}
      {tabs && tabs.length > 0 && (
        <div className={styles.tabsRow}>
          <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => onTabChange?.(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {headerContent}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : data.length === 0 ? (
          <div className={styles.emptyState}>{emptyMessage}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key.toString()}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={getRowClassName(row)}>
                  {columns.map((column) => (
                    <td key={column.key.toString()}>
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {renderPagination()}
    </div>
  );
}
