'use client';
import React, { useEffect, useState, ReactNode } from 'react';
import styles from './DataTable.module.css';
import Loader from '../ui/loader';
import { usePathname } from 'next/navigation';

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
  rowsPerPage?: number;
  loading?: boolean;
  error?: string | Error;
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
      case 'Pending': case 'Blocked': return styles.statusPending;
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
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage = 10,
  loading = false,
  error,
  emptyMessage = 'No data available',
  showAddButton = true,
  getRowStatus,
  headerContent,
}: DataTableProps<T>) {
  const isPaginationControlled = typeof currentPage === 'number';
  const safeRowsPerPage = Math.max(1, rowsPerPage);
  const calculatedTotalPages = Math.max(1, Math.ceil(data.length / safeRowsPerPage));
  const resolvedTotalPages = Math.max(calculatedTotalPages, Math.max(1, totalPages ?? 1));

  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const pathName = usePathname();

  useEffect(() => {
    if (isPaginationControlled) return;

    setInternalCurrentPage((prevPage) => Math.min(prevPage, resolvedTotalPages));
  }, [isPaginationControlled, resolvedTotalPages]);

  const activePage = isPaginationControlled ? (currentPage as number) : internalCurrentPage;
  const safeCurrentPage = Math.min(Math.max(activePage, 1), resolvedTotalPages);

  const handlePageChange = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(nextPage, 1), resolvedTotalPages);
    if (clampedPage === safeCurrentPage) return;

    if (isPaginationControlled) {
      onPageChange?.(clampedPage);
      return;
    }

    setInternalCurrentPage(clampedPage);
  };

  const paginatedData = data.slice((safeCurrentPage - 1) * safeRowsPerPage, safeCurrentPage * safeRowsPerPage);

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
    // Show '-' if value is null, undefined, or empty string
    if (value === null) return '-';
    return value ?? '-';
  };

  const renderPagination = () => {
    if (resolvedTotalPages < 1) return null;

    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (resolvedTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= resolvedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, safeCurrentPage - 1);
      const endPage = Math.min(resolvedTotalPages - 1, safeCurrentPage + 1);

      if (startPage > 2) pages.push('...');

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < resolvedTotalPages - 1) pages.push('...');

      pages.push(resolvedTotalPages);
    }

    return (
      <div className={styles.pagination}>
        <button 
          className={styles.paginationButton}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
        >
          <img src="/icons/leftArrow.svg" alt="" />
        </button>
        {pages.map((page, index) => (
          <button
            key={`${page}-${index}`}
            className={`${styles.pageNumber} ${page === safeCurrentPage ? styles.pageNumberActive : ''}`}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        <button 
          className={styles.paginationButton}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === resolvedTotalPages}
        >
         <img src="/icons/rightArrow.svg" alt="" />
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
      
      {tabs && tabs.length > 0 && (() => {


        const chunkTabs = (tabs: Tab[], size: number): Tab[][] => {
          const chunks: Tab[][] = [];
          for (let i = 0; i < tabs.length; i += size) {
            chunks.push(tabs.slice(i, i + size));
          }
          return chunks;
        };

        const tabChunks = chunkTabs(tabs, 7);

        return (
          <>
            {tabChunks.map((chunk: Tab[], rowIndex: number) => (
              <div key={rowIndex} className={styles.tabsRow}>
                <div className={styles.tabsContainer}>
                  {chunk.map((tab: Tab, ind: number) => (
                    <button
                      key={tab.key}
                      className={`
                        ${styles.tab}
                        ${pathName?.includes('setup') ? styles.tabSetup : ''}
                        ${activeTab === tab.key ? styles.tabActive : ''}
                        ${ind === 0 ? styles.tabEdgeLeft : ''}
                        ${ind === chunk.length - 1 ? styles.tabEdgeRight : ''}
                      `}
                      onClick={() => onTabChange?.(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        );
      })()}

      {headerContent}

      <div className={styles.tableWrapper}>
        {error ? (
          <div style={{ color: 'red', marginBottom: 12, padding: '12px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
            {error instanceof Error ? error.message : error}
          </div>
        ) : loading ? (
          <div className={styles.loading}><Loader variant="inline" /></div>
        ) : paginatedData.length === 0 ? (
          <div className={styles.emptyState}>{emptyMessage}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((column, ind) => (
                  <th key={column.key.toString()} className={`${ind === 0 ? styles.tabEdgeLeft : ''} ${ind === columns.length - 1 ? styles.tabEdgeRight : ''}`}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${(rowIndex % 2 !== 0 ? styles.rowInactive : styles.rowActive)} ${rowIndex === paginatedData.length - 1 ? styles.lastRow : ''}`}>
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
