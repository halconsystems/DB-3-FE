'use client';
import { useState } from 'react';
import DataTable, { Column, StatusBadge, Tab } from '@/components/tables/DataTable';
import CircularButton from '@/components/ui/CircularButton';
import styles from './DhaXHalconTable.module.css';

interface DhaXHalconTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface HalconRow {
  invoiceNumber: string;
  date: string;
  userId: string;
  name: string;
  serviceType: string;
  amount: string;
  taxAmount: string;
  bankCharges: string;
  totalAmount: string;
  paymentMethod: string;
  transactionId: string;
  dhaShare: string;
  halconShare: string;
  status: string;
}

const rows: HalconRow[] = Array.from({ length: 8 }).map((_, idx) => ({
  invoiceNumber: `00${idx + 1}`,
  date: '26-Feb-2026',
  userId: '09244',
  name: 'User',
  serviceType: 'RFID',
  amount: 'PKR 1200',
  taxAmount: 'PKR 1800',
  bankCharges: 'PKR 600',
  totalAmount: 'PKR 600',
  paymentMethod: 'Cash',
  transactionId: '123456789',
  dhaShare: 'PKR 1000',
  halconShare: 'PKR 300',
  status: 'Paid',
}));

const columns: Column<HalconRow>[] = [
  { key: 'invoiceNumber', header: 'Invoice Number' },
  { key: 'date', header: 'Date' },
  { key: 'userId', header: 'User ID' },
  { key: 'name', header: 'Name' },
  { key: 'serviceType', header: 'Service Type' },
  { key: 'amount', header: 'Amount' },
  { key: 'taxAmount', header: 'Tax Amount' },
  { key: 'bankCharges', header: 'Bank Charges' },
  { key: 'totalAmount', header: 'Total Amount' },
  { key: 'paymentMethod', header: 'Payment Method' },
  { key: 'transactionId', header: 'Transaction ID' },
  { key: 'dhaShare', header: 'DHA %' },
  { key: 'halconShare', header: 'Halcon %' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'action',
    header: 'Action',
    render: () => (
      <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} />
    ),
  },
];

export default function DhaXHalconTable({ tabs, activeTab, onTabChange }: DhaXHalconTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const headerContent = (
    <div className={styles.headerArea}>
      <div className={styles.filtersRow}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Select Head</p>
          <p className={styles.cardValue}>Select (DHA/Halcon)</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Date Range</p>
          <p className={styles.cardValue}>21/03/26 - 20/03/26</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Total Amount</p>
          <p className={styles.cardValue}>PKR 5800</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>DHA %</p>
          <p className={styles.cardValue}>PKR 4500</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Halcon %</p>
          <p className={styles.cardValue}>PKR 3300</p>
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
      data={rows}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      headerContent={headerContent}
      enableSorting={false}
      enableCardStatusFilter={false}
      enableFiltering={false}
    />
  );
}
