'use client';
import React, { useEffect, useMemo, useState, ReactNode } from 'react';
import styles from './DataTable.module.css';
import Loader from '../ui/loader';
import { usePathname } from 'next/navigation';
import { getStatusConfig } from '@/lib/statusMapping';
import { Search, ArrowLeft, ArrowRight, Plus, ArrowUp, ArrowDown, CreditCard } from 'lucide-react';

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
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enableCardStatusFilter?: boolean;
  filterPlaceholder?: string;
  searchVariant?: 'default' | 'card-management';
  showSearchActionButton?: boolean;
}

export function StatusBadge({
  status,
  type,
  value,
}: {
  status?: string;
  type?: string;
  value?: string | number | boolean | null;
}) {
  // If type and value are provided, use the status mapping
  let displayLabel = status;
  let bgColor: string | undefined;
  let textColor: string | undefined;

  if (type && value !== undefined && value !== null) {
    const config = getStatusConfig(type, value);
    if (config) {
      displayLabel = config.label;
      bgColor = config.bg;
      textColor = config.color;
    }
  }

  // Fallback to CSS classes if no custom colors
  if (!bgColor || !textColor) {
    const getStatusClass = () => {
      const statusStr = (displayLabel || '').toLowerCase();
      switch (statusStr) {
        case 'approved':
          return styles.statusApproved;
        case 'rejected':
          return styles.statusRejected;
        case 'cancelled':
          return styles.statusCancelled;
        case 'active':
          return styles.statusActive;
        case 'inactive':
          return styles.statusInactive;
        case 'pending':
        case 'blocked':
          return styles.statusPending;
        case 'private':
          return styles.statusPrivate;
        case 'official':
          return styles.statusOfficial;
        case 'service':
          return styles.statusService;
        case 'commercial':
          return styles.statusCommercial;
        default:
          return styles.statusInactive;
      }
    };

    const noStatus = "---"

    return (
      <span className={`${styles.statusBadge} ${getStatusClass()}`}>
        {displayLabel ?? noStatus}
      </span>
    );
  }

  return (
    <span
      className={styles.statusBadge}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {displayLabel}
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
  enableFiltering = true,
  enableSorting = true,
  enableCardStatusFilter = true,
  filterPlaceholder = 'Search',
  searchVariant = 'default',
  showSearchActionButton = false,
}: DataTableProps<T>) {
  const [filterTerm, setFilterTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [cardStatusFilter, setCardStatusFilter] = useState<string>('all');

  const hasCardStatusColumn = useMemo(
    () => columns.some((column) => String(column.key) === 'cardStatus'),
    [columns]
  );

  useEffect(() => {
    if (!enableSorting) return;
    if (hasCardStatusColumn && !sortKey) {
      setSortKey('cardStatus');
      setSortDirection('desc');
    }
  }, [hasCardStatusColumn, enableSorting, sortKey]);

  const cardStatusOptions = useMemo(() => {
    if (!hasCardStatusColumn) {
      return [];
    }

    const uniqueValues = Array.from(
      new Set(
        data
          .map((row) => row.cardStatus)
          .filter((value) => value !== null && value !== undefined)
          .map((value) => String(value))
      )
    );

    return uniqueValues
      .map((value) => {
        const numericValue = Number(value);
        const config = getStatusConfig('cardStatus', Number.isNaN(numericValue) ? value : numericValue);
        return {
          value,
          label: config?.label || value,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data, hasCardStatusColumn]);

  const getRawCellValue = (column: Column<T>, row: T) => {
    if (column.key.toString().includes('.')) {
      return column.key
        .toString()
        .split('.')
        .reduce((obj, key) => obj?.[key], row as any);
    }

    return row[column.key as keyof T];
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (enableCardStatusFilter && hasCardStatusColumn && cardStatusFilter !== 'all') {
      result = result.filter((row) => String(row.cardStatus) === cardStatusFilter);
    }

    const trimmedFilter = filterTerm.trim().toLowerCase();
    if (enableFiltering && trimmedFilter) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = getRawCellValue(column, row);
          if (value === null || value === undefined) {
            return false;
          }

          return String(value).toLowerCase().includes(trimmedFilter);
        })
      );
    }

    if (enableSorting && sortKey) {
      const selectedColumn = columns.find((column) => String(column.key) === sortKey);
      if (selectedColumn) {
        result.sort((a, b) => {
          const aValue = getRawCellValue(selectedColumn, a);
          const bValue = getRawCellValue(selectedColumn, b);

          if (aValue === bValue) return 0;
          if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
          if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

          const aNumber = Number(aValue);
          const bNumber = Number(bValue);
          const bothNumbers = !Number.isNaN(aNumber) && !Number.isNaN(bNumber);

          if (bothNumbers) {
            return sortDirection === 'asc' ? aNumber - bNumber : bNumber - aNumber;
          }

          const aString = String(aValue);
          const bString = String(bValue);
          return sortDirection === 'asc'
            ? aString.localeCompare(bString, undefined, { numeric: true, sensitivity: 'base' })
            : bString.localeCompare(aString, undefined, { numeric: true, sensitivity: 'base' });
        });
      }
    }

    return result;
  }, [
    cardStatusFilter,
    columns,
    data,
    enableCardStatusFilter,
    enableFiltering,
    enableSorting,
    filterTerm,
    hasCardStatusColumn,
    sortDirection,
    sortKey,
  ]);

  const isPaginationControlled = typeof currentPage === 'number';
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(rowsPerPage);
  const effectiveRowsPerPage = Math.max(1, internalRowsPerPage);
  const safeRowsPerPage = Math.max(1, effectiveRowsPerPage);
  const calculatedTotalPages = Math.max(1, Math.ceil(filteredAndSortedData.length / safeRowsPerPage));
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

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRows = parseInt(e.target.value, 10);
    setInternalRowsPerPage(newRows);
    setInternalCurrentPage(1); 
  };

  const paginatedData = filteredAndSortedData.slice((safeCurrentPage - 1) * safeRowsPerPage, safeCurrentPage * safeRowsPerPage);

  const getRowClassName = (row: T) => {
    const status = getRowStatus?.(row);
    if (status === 'Active') return styles.rowActive;
    if (status === 'Inactive') return styles.rowInactive;
    return '';
  };
  
  const renderCell = (column: Column<T>, row: T) => {
    const value = getRawCellValue(column, row);
    
    if (column.render) {
      return column.render(value, row);
    }
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
          <ArrowLeft size={16} />
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
          <ArrowRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      
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

      {showAddButton && (
        <div className={styles.addButtonWrapper}>
          <button className={styles.addButton} onClick={onAddClick}>
            <Plus size={14} style={{ marginRight: 8 }} />
            {addButtonLabel}
          </button>
        </div>
      )}

      {(enableFiltering || enableSorting || (enableCardStatusFilter && hasCardStatusColumn)) && (
        <div className={styles.controlsBar}>
          <div className={styles.leftControls}>
            {enableFiltering && (
              <div
                className={`${styles.searchWrapper} ${
                  searchVariant === 'card-management' ? styles.searchWrapperCardManagement : ''
                }`}
              >
                <Search
                  size={16}
                  className={`${styles.searchIcon} ${
                    searchVariant === 'card-management' ? styles.searchIconCardManagement : ''
                  }`}
                />
                <input
                  type="text"
                  className={`${styles.filterInput} ${
                    searchVariant === 'card-management' ? styles.filterInputCardManagement : ''
                  }`}
                  placeholder={filterPlaceholder}
                  value={filterTerm}
                  onChange={(e) => {
                    setFilterTerm(e.target.value);
                    if (!isPaginationControlled) {
                      setInternalCurrentPage(1);
                    }
                  }}
                />
                {showSearchActionButton && searchVariant === 'card-management' && (
                  <button
                    type="button"
                    className={styles.searchActionButton}
                    aria-label="Search action"
                  >
                    <CreditCard size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {((enableCardStatusFilter && hasCardStatusColumn) || enableSorting) && (
            <div className={styles.rightControls}>
              {enableCardStatusFilter && hasCardStatusColumn && (
                <div className={styles.filterGroup}>
                  <label className={styles.controlLabel} htmlFor="cardStatusFilterSelect">Card Status</label>
                  <select
                    id="cardStatusFilterSelect"
                    className={styles.sortSelect}
                    value={cardStatusFilter}
                    onChange={(e) => {
                      setCardStatusFilter(e.target.value);
                      if (!isPaginationControlled) {
                        setInternalCurrentPage(1);
                      }
                    }}
                  >
                    <option value="all">All</option>
                    {cardStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {enableSorting && (
                <div className={styles.sortControls}>
                  <div className={styles.filterGroup}>
                    <label className={styles.controlLabel} htmlFor="sortBySelect">Sort By</label>
                    <select
                      id="sortBySelect"
                      className={styles.sortSelect}
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value)}
                    >
                      <option value="">None</option>
                      {columns.map((column) => (
                        <option key={String(column.key)} value={String(column.key)}>
                          {column.header}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.filterGroup}>
                    <button
                      id="sortDirectionSelect"
                      type="button"
                      className={styles.sortToggleButton}
                      onClick={() => setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))}
                      disabled={!sortKey}
                      aria-label={`Sort direction ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                    >
                      {sortDirection === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      

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
                  <th key={ind} className={`${ind === 0 ? styles.tabEdgeLeft : ''} ${ind === columns.length - 1 ? styles.tabEdgeRight : ''}`}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${(rowIndex % 2 !== 0 ? styles.rowInactive : styles.rowActive)} ${rowIndex === paginatedData.length - 1 ? styles.lastRow : ''}`}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.footerBar}>
        {renderPagination()}
        <div className={styles.rowsPerPage}>
          <div>
            <label htmlFor="rowsPerPageSelect" style={{ fontWeight: 500 }}>Show list</label>
            <p className={styles.rowsPerPageValue}>{effectiveRowsPerPage}</p>
          </div>
          <select
            id="rowsPerPageSelect"
            value={effectiveRowsPerPage}
            onChange={handleRowsPerPageChange}
            className={styles.rowsPerPageSelect}
            >
            {[5, 10, 15, 20, 50, 100].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
