'use client';

import { useMemo, useState } from 'react';
import DataTable, { Column, StatusBadge, Tab } from '@/components/tables/DataTable';
import CircularButton from '@/components/ui/CircularButton';
import { endOfDayIso, formatDateDisplay, startOfDayIso } from '@/lib/dateUtils';
import { useInvoiceSummary } from '@/hooks/invoice/useInvoiceSummary';
import { useInvoiceSummaryDetails } from '@/hooks/invoice/useInvoiceSummaryDetails';
import type { InvoiceSummaryDetailItem } from '@/services/invoice.service';
import { exportInvoicesExcel } from '@/services/invoice.service';
import { ChevronDown, FileSpreadsheet } from 'lucide-react';
import styles from './DhaXHalconTable.module.css';

interface DhaXHalconTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface HalconRow {
  id: string;
  invoiceNumber: string;
  date: string;
  userId: string;
  name: string;
  entityType: string;
  parentUserName: string;
  serviceType: string;
  amount: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  dhaShare: string;
  halconShare: string;
  invoiceStatus: string;
  paymentMethod: string;
  transactionId: string;
  durationDays: string;
  trialDueDate: string;
}

function formatPkr(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '-';
  return `PKR ${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const columns: Column<HalconRow>[] = [
  { key: 'invoiceNumber', header: 'Invoice Number' },
  { key: 'date', header: 'Date', render: (v) => (v ? formatDateDisplay(String(v)) : '-') },
  { key: 'userId', header: 'User ID' },
  { key: 'name', header: 'Name' },
  { key: 'entityType', header: 'Entity Type' },
  { key: 'parentUserName', header: 'Parent User' },
  { key: 'serviceType', header: 'Service Type' },
  { key: 'amount', header: 'Amount' },
  { key: 'taxAmount', header: 'Tax Amount' },
  { key: 'discountAmount', header: 'Discount' },
  { key: 'totalAmount', header: 'Total Amount' },
  { key: 'dhaShare', header: 'DHA share (est.)' },
  { key: 'halconShare', header: 'Halcon share (est.)' },
  {
    key: 'invoiceStatus',
    header: 'Status',
    render: (value) => <StatusBadge status={String(value || '-')} />,
  },
  { key: 'paymentMethod', header: 'Payment Method' },
  { key: 'transactionId', header: 'Transaction ID' },
  { key: 'durationDays', header: 'Duration (days)' },
  { key: 'trialDueDate', header: 'Trial due', render: (v) => (v ? formatDateDisplay(String(v)) : '-') },
  {
    key: 'action',
    header: 'Action',
    render: () => <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} />,
  },
];

export default function DhaXHalconTable({ tabs, activeTab, onTabChange }: DhaXHalconTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHead, setSelectedHead] = useState<'dha' | 'halcon'>('dha');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [excelExporting, setExcelExporting] = useState(false);

  const fromDateIso = fromDate ? startOfDayIso(fromDate) : undefined;
  const toDateIso = toDate ? endOfDayIso(toDate) : undefined;

  const {
    data: summaryTotals,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
  } = useInvoiceSummary({
    pageNumber: 1,
    pageSize: 5,
    fromDate: fromDateIso,
    toDate: toDateIso,
  });

  const {
    data: detailsData,
    isLoading: detailsLoading,
    isError: detailsError,
    error: detailsErr,
  } = useInvoiceSummaryDetails({
    pageNumber: currentPage,
    pageSize,
    fromDate: fromDateIso,
    toDate: toDateIso,
  });

  const dhaPct = summaryTotals?.dhaPercentage ?? 0;
  const halconPct = summaryTotals?.halconPercentage ?? 0;

  const tableRows: HalconRow[] = useMemo(() => {
    const items: InvoiceSummaryDetailItem[] = detailsData?.items ?? [];
    return items.map((item) => {
      const total = Number(item.totalAmount) || 0;
      const dhaPart = (total * dhaPct) / 100;
      const halconPart = (total * halconPct) / 100;
      return {
        id: item.id,
        invoiceNumber: item.invoiceNumber || '-',
        date: item.date || '-',
        userId: item.userId || '-',
        name: item.username || '-',
        entityType: item.entityType || '-',
        parentUserName: item.parentUserName || '-',
        serviceType: item.serviceType || '-',
        amount: formatPkr(item.amount),
        taxAmount: formatPkr(item.taxAmount),
        discountAmount: formatPkr(item.discountAmount ?? null),
        totalAmount: formatPkr(item.totalAmount),
        dhaShare: formatPkr(dhaPart),
        halconShare: formatPkr(halconPart),
        invoiceStatus: item.invoiceStatus || '-',
        paymentMethod: item.paymentMethod || '-',
        transactionId: item.transactionId || '-',
        durationDays: item.durationDays != null ? String(item.durationDays) : '-',
        trialDueDate: item.trialDueDate || '-',
      };
    });
  }, [detailsData?.items, dhaPct, halconPct]);

  const totalListPages = Math.max(1, detailsData?.totalPages ?? 1);
  const isLoading = summaryLoading || detailsLoading;
  const isError = detailsError || summaryError;
  const error = detailsErr ?? summaryErr;

  const excelDateRangeIso = () => {
    const toYmd = toDate.trim() || new Date().toISOString().slice(0, 10);
    const fromYmd = fromDate.trim() || toYmd;
    return {
      from: startOfDayIso(fromYmd)!,
      to: endOfDayIso(toYmd)!,
    };
  };

  const handleExportExcel = async () => {
    const { from, to } = excelDateRangeIso();
    setExcelExporting(true);
    try {
      const blob = await exportInvoicesExcel({
        pageNumber: 0,
        pageSize: 0,
        invoiceNumber: '',
        fromDate: from,
        toDate: to,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dha-halcon-invoices-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // eslint-disable-next-line no-alert
      alert('Excel export failed. Please try again.');
    } finally {
      setExcelExporting(false);
    }
  };

  const headerContent = (
    <div className={styles.headerArea}>
      <div className={styles.summaryStrip}>
        <div className={styles.leftGroup}>
          <div className={styles.controlCard}>
            <p className={styles.cardLabel}>Select Head</p>
            <div className={styles.selectWrap}>
              <select
                value={selectedHead}
                onChange={(e) => setSelectedHead(e.target.value as 'dha' | 'halcon')}
                className={styles.headSelect}
              >
                <option value="dha">DHA</option>
                <option value="halcon">Halcon</option>
              </select>
              <ChevronDown size={13} className={styles.selectIcon} />
            </div>
          </div>
          <div className={styles.controlCard}>
            <p className={styles.cardLabel}>Date Range</p>
            <div className={styles.dateInputsRow}>
              <input
                id="dha-x-from"
                type="date"
                className={styles.dateInput}
                value={fromDate}
                aria-label="From date"
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className={styles.cardValue} style={{ alignSelf: 'center' }}>
                –
              </span>
              <input
                id="dha-x-to"
                type="date"
                className={styles.dateInput}
                value={toDate}
                aria-label="To date"
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.midGroup}>
          <button
            type="button"
            className={styles.excelBtn}
            onClick={handleExportExcel}
            disabled={excelExporting}
            title="Download Excel"
            aria-label="Export Excel"
          >
            <FileSpreadsheet size={22} color="#217346" strokeWidth={1.75} />
          </button>
        </div>
        <div className={styles.rightGroup}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Total Amount</p>
            <p className={styles.cardValue}>{formatPkr(summaryTotals?.totalAmount)}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>DHA %</p>
            <p className={styles.cardSub}>{summaryTotals != null ? `${summaryTotals.dhaPercentage}%` : '—'}</p>
            <p className={styles.cardValue}>{formatPkr(summaryTotals?.dhaAmount)}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Halcon %</p>
            <p className={styles.cardSub}>{summaryTotals != null ? `${summaryTotals.halconPercentage}%` : '—'}</p>
            <p className={styles.cardValue}>{formatPkr(summaryTotals?.halconAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DataTable<HalconRow>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={columns}
      data={tableRows}
      showAddButton={false}
      loading={isLoading}
      currentPage={currentPage}
      totalPages={totalListPages}
      onPageChange={setCurrentPage}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      serverSidePagination
      headerContent={headerContent}
      enableSorting={false}
      enableFiltering={false}
      error={
        isError
          ? `Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`
          : undefined
      }
    />
  );
}
