'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import { saveTableRow } from '../../../../lib/tableRowStorage';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  userId: string;
  name: string;
  serviceType: string;
  amount: number;
  taxAmount: number;
  bankCharges: number;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

interface InvoiceTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

// Demo data
const demoInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    date: '2026-04-02',
    userId: 'U123',
    name: 'John Doe',
    serviceType: 'Parking',
    amount: 200,
    taxAmount: 10,
    bankCharges: 5,
    totalAmount: 215,
    paymentMethod: 'Credit Card',
    transactionId: 'TXN12345',
    status: 'Paid'
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    date: '2026-04-01',
    userId: 'U124',
    name: 'Jane Smith',
    serviceType: 'Registration',
    amount: 150,
    taxAmount: 7.5,
    bankCharges: 3,
    totalAmount: 160.5,
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN12346',
    status: 'Pending'
  }
];

export default function InvoiceTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: InvoiceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [invoices] = useState<Invoice[]>(demoInvoices);

  const handleEdit = (item: Invoice) => {
    saveTableRow('invoice', item);
    router.push('/setup/invoice/edit-invoice');
  };

  const handleDelete = (id: string) => {
    console.log('Delete Invoice:', id);
    // Handle delete if needed
  };

  const columns: Column<Invoice>[] = [
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
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Paid' | 'Pending' | 'Failed') => <StatusBadge status={value} />
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row.id)} />
        </div>
      )
    }
  ];

  return (
    <DataTable<Invoice>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={columns}
      data={invoices}
      loading={false}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      headerContent={
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
          <AddNewButton onClick={onAddNew} label={addButtonLabel} />
        </div>
      }
    />
  );
}
