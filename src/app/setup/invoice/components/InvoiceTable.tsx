'use client';
import { useState } from 'react';
import { useInvoices } from '../../../../hooks/invoice/useInvoices';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import { saveTableRow } from '../../../../lib/tableRowStorage';

interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  name: string;
  serviceType: string;
  amount: number;
  taxAmount: number;
  bankCharges: number;
  totalAmount: number;
  paymentMethod: string;
  trialPeriodDays: number;
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




export default function InvoiceTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: InvoiceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useInvoices();
  // Map InvoiceRecord to Invoice for DataTable
  const invoices: Invoice[] = (data?.data || []).map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    userId: inv.entityId || '',
    name: inv.entityType || '', // Placeholder, adjust if you have user name
    serviceType: inv.entityType || '', // Show entityType instead of serviceType
    amount: inv.amount,
    taxAmount: inv.taxAmount,
    bankCharges: 0, // Not present in InvoiceRecord, set to 0 or fetch if available
    totalAmount: inv.totalAmount,
    paymentMethod: inv.paymentMethod || '',
    trialPeriodDays: inv.trialPeriodDays ?? 15,
    transactionId: inv.transactionId || '',
    status: (inv.status === 'Paid' || inv.status === 'Pending' || inv.status === 'Failed') ? inv.status : 'Pending',
  }));

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
    { key: 'name', header: 'Name' },
    { key: 'serviceType', header: 'Entity Type' },
    { key: 'amount', header: 'Amount' },
    { key: 'taxAmount', header: 'Tax Amount' },
    { key: 'bankCharges', header: 'Bank Charges' },
    { key: 'totalAmount', header: 'Total Amount' },
    { key: 'paymentMethod', header: 'Payment Method' },
    { key: 'trialPeriodDays', header: 'Trial Period (Days)' },
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
      loading={isLoading}
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
