'use client';
import { useEffect, useState, useMemo } from 'react';
import { useInvoices } from '../../../../hooks/invoice/useInvoices';
import { useCreateInvoice } from '../../../../hooks/invoice/useCreateInvoice';
import { useUpdateInvoice } from '../../../../hooks/invoice/useUpdateInvoice';
import { useInvoiceById } from '../../../../hooks/invoice/useInvoiceById';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import InvoicePreviewModal from './InvoicePreviewModal';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { formatDateDisplay } from '../../../../lib/dateUtils';
import { invoiceFields } from '../fields';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string | null;
  entityType: string | null;
  userId: string;
  username: string | null;
  parentUserName: string | null;
  familyUserName: string | null;
  serviceType: string | null;
  amount: number;
  taxAmount: number;
  bankCharges: number;
  discountAmount: number;
  mdrAmount: number;
  fedTaxAmount: number;
  totalAmount: number;
  paymentMethod: string | null;
  durationDays: number | null;
  trialPeriodDays: number;
  trialDueDate: string | null;
  transactionId: string | null;
  status: string;
  invoiceStatus: string | null;
}

interface InvoiceTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}

export default function InvoiceTable(props: InvoiceTableProps) {
  const { tabs, activeTab, onTabChange, onAddNew, addButtonLabel, searchParams } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  // Pass required payload to useInvoices
  const { data, isLoading } = useInvoices({ pageNumber: currentPage, pageSize: 10 });
  const [editInvoiceId, setEditInvoiceId] = useState<string | undefined>();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: createInvoice } = useCreateInvoice();
  const { mutateAsync: updateInvoice } = useUpdateInvoice();
  const { data: editInvoiceDetails, isLoading: isEditInvoiceLoading } = useInvoiceById(editInvoiceId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit' || modalMode === 'view') {
      if (modalId) {
        setEditInvoiceId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('invoice');
        if (selected?.id) {
          setEditInvoiceId(String(selected.id));
          clearTableRow('invoice');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditInvoiceId(undefined);
    setSelectedInvoice(null);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/invoice');
  };

  const handleAddInvoice = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createInvoice({
        id: data.id || '',
        paymentMethod: data.paymentMethod || '',
        transactionId: data.transactionId || '',
        invoiceNumber: data.invoiceNumber || '',
        tagId: data.tagId || '',
        entityType: data.entityType || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create invoice';
      setFormError(message);
    }
  };

  const initialInvoiceValues = useMemo<ProfileFormData | null>(() => {
    if (!editInvoiceDetails?.data) return null;
    return {
      id: editInvoiceDetails.data.id || '',
      paymentMethod: editInvoiceDetails.data.paymentMethod || '',
      transactionId: editInvoiceDetails.data.transactionId || '',
      invoiceNumber: editInvoiceDetails.data.invoiceNumber || '',
      tagId: editInvoiceDetails.data.tagId || '',
      entityType: editInvoiceDetails.data.entityType || '',
    };
  }, [editInvoiceDetails]);

  const handleUpdateInvoice = async (formData: ProfileFormData) => {
    if (!editInvoiceId || !editInvoiceDetails?.data) return;
    setFormError('');
    try {
      await updateInvoice({
        id: editInvoiceId,
        paymentMethod: formData.paymentMethod || editInvoiceDetails.data.paymentMethod || '',
        transactionId: formData.transactionId || editInvoiceDetails.data.transactionId || '',
        invoiceNumber: formData.invoiceNumber || editInvoiceDetails.data.invoiceNumber || '',
        tagId: formData.tagId || editInvoiceDetails.data.tagId || '',
        entityType: formData.entityType || editInvoiceDetails.data.entityType || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update invoice';
      setFormError(message);
    }
  };
  // Map InvoiceRecord to Invoice for DataTable
  const invoices: Invoice[] = (data?.data || []).map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    date: inv.date ?? null,
    entityType: inv.entityType ?? null,
    userId: inv.userId || inv.entityId || '',
    username: inv.username ?? null,
    parentUserName: inv.parentUserName ?? null,
    familyUserName: inv.familyUserName ?? null,
    serviceType: inv.serviceType ?? null,
    amount: inv.amount,
    taxAmount: inv.taxAmount,
    bankCharges: inv.bankCharges ?? 0,
    discountAmount: inv.discountAmount ?? 0,
    mdrAmount: inv.mdrAmount ?? 0,
    fedTaxAmount: inv.fedTaxAmount ?? 0,
    totalAmount: inv.totalAmount,
    paymentMethod: inv.paymentMethod ?? null,
    durationDays: inv.durationDays ?? null,
    trialPeriodDays: inv.trialPeriodDays ?? 0,
    trialDueDate: inv.trialDueDate || inv.trialDueAtUtc || null,
    transactionId: inv.transactionId ?? null,
    status: inv.status || '',
    invoiceStatus: inv.invoiceStatus ?? null,
  }));

  const handleView = (item: Invoice) => {
    setSelectedInvoice(item);
    saveTableRow('invoice', item);
    router.push(`/setup/invoice?modal=view&id=${encodeURIComponent(item.id)}`);
  };

  const dashIfEmpty = (value: any) =>
    value === null || value === undefined || value === '' ? '-' : value;

  const columns: Column<Invoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice Number', render: dashIfEmpty },
    { key: 'date', header: 'Date', render: (value) => (value ? formatDateDisplay(value) : '-') },
    { key: 'entityType', header: 'Entity Type', render: dashIfEmpty },
    { key: 'parentUserName', header: 'Entity Name', render: dashIfEmpty },
    { key: 'serviceType', header: 'Tag Type', render: dashIfEmpty },
    { key: 'amount', header: 'Amount', render: dashIfEmpty },
    { key: 'bankCharges', header: 'Bank Charges', render: dashIfEmpty },
    { key: 'taxAmount', header: 'Tax Amount', render: dashIfEmpty },
    { key: 'discountAmount', header: 'Discount', render: dashIfEmpty },
    { key: 'mdrAmount', header: 'MDR Amount', render: dashIfEmpty },
    { key: 'fedTaxAmount', header: 'FED Tax', render: dashIfEmpty },
    { key: 'totalAmount', header: 'Total Amount', render: dashIfEmpty },
    { key: 'paymentMethod', header: 'Payment Method', render: dashIfEmpty },
    { key: 'durationDays', header: 'Duration (Days)', render: dashIfEmpty },
    { key: 'trialPeriodDays', header: 'Trial Period (Days)', render: dashIfEmpty },
    { key: 'trialDueDate', header: 'Trial Due Date', render: (value) => (value ? formatDateDisplay(value) : '-') },
    { key: 'transactionId', header: 'Transaction ID', render: dashIfEmpty },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => <StatusBadge status={dashIfEmpty(value)} />
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} onClick={() => handleView(row)} />
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable<Invoice>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={columns}
        data={invoices}
        loading={isLoading}
        showAddButton={false}
        addButtonLabel={addButtonLabel}
        onAddClick={() => router.push('/setup/invoice?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add Invoice"
      >
        <CommonEntityForm
          title=""
          fields={invoiceFields}
          initialValues={{
            id: '',
            paymentMethod: '',
            transactionId: '',
            invoiceNumber: '',
            tagId: '',
            entityType: '',
          }}
          onSave={handleAddInvoice}
          onCancel={handleCloseModal}
          loading={false}
          error={formError}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Invoice"
      >
        {isEditInvoiceLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={invoiceFields}
            initialValues={initialInvoiceValues || { id: '', paymentMethod: '', transactionId: '', invoiceNumber: '', tagId: '', entityType: '' }}
            onSave={handleUpdateInvoice}
            onCancel={handleCloseModal}
            loading={false}
            error={formError}
            isViewMode={false}
          />
        )}
      </FormModal>

      <InvoicePreviewModal
        isOpen={modalMode === 'view' && hasCheckedId}
        onClose={handleCloseModal}
        invoice={
          selectedInvoice
            ? {
                id: selectedInvoice.id,
                invoiceNumber: selectedInvoice.invoiceNumber,
                date: selectedInvoice.date,
                username: selectedInvoice.username,
                amount: selectedInvoice.amount,
                taxAmount: selectedInvoice.taxAmount,
                discountAmount: selectedInvoice.discountAmount,
                totalAmount: selectedInvoice.totalAmount,
                serviceType: selectedInvoice.serviceType,
              }
            : editInvoiceDetails?.data
              ? {
                  id: editInvoiceDetails.data.id || '',
                  invoiceNumber: editInvoiceDetails.data.invoiceNumber || '',
                  date: editInvoiceDetails.data.date || null,
                  username: editInvoiceDetails.data.username || null,
                  amount: Number(editInvoiceDetails.data.amount || 0),
                  taxAmount: Number(editInvoiceDetails.data.taxAmount || 0),
                  discountAmount: Number(editInvoiceDetails.data.discountAmount || 0),
                  totalAmount: Number(editInvoiceDetails.data.totalAmount || 0),
                  serviceType: editInvoiceDetails.data.serviceType || null,
                }
              : null
        }
      />
    </>
  );
}
