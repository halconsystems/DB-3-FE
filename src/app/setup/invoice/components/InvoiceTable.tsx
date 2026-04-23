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
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { invoiceFields } from '../fields';

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
  searchParams?: any | null;
}

export default function InvoiceTable(props: InvoiceTableProps) {
  const { tabs, activeTab, onTabChange, onAddNew, addButtonLabel, searchParams } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  // Pass required payload to useInvoices
  const { data, isLoading } = useInvoices({ pageNumber: currentPage, pageSize: 10 });
  const [editInvoiceId, setEditInvoiceId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: createInvoice } = useCreateInvoice();
  const { mutateAsync: updateInvoice } = useUpdateInvoice();
  const { data: editInvoiceDetails, isLoading: isEditInvoiceLoading } = useInvoiceById(editInvoiceId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
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
    userId: inv.entityId || '',
    name: inv.entityType || '', 
    serviceType: inv.entityType || '', 
    amount: inv.amount,
    taxAmount: inv.taxAmount,
    bankCharges: 0, 
    totalAmount: inv.totalAmount,
    paymentMethod: inv.paymentMethod || '',
    trialPeriodDays: inv.trialPeriodDays ?? 15,
    transactionId: inv.transactionId || '',
    status: (inv.status === 'Paid' || inv.status === 'Pending' || inv.status === 'Failed') ? inv.status : 'Pending',
  }));

  const handleEdit = (item: Invoice) => {
    saveTableRow('invoice', item);
    router.push(`/setup/invoice?modal=edit&id=${encodeURIComponent(item.id)}`);
  };

  const handleDelete = (id: string) => {
    console.log('Delete Invoice:', id);
    // Handle delete if needed
  };

  const dashIfEmpty = (value: any) =>
    value === null || value === undefined || value === '' ? '-' : value;

  const columns: Column<Invoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice Number', render: dashIfEmpty },
    { key: 'name', header: 'Name', render: dashIfEmpty },
    { key: 'serviceType', header: 'Entity Type', render: dashIfEmpty },
    { key: 'amount', header: 'Amount', render: dashIfEmpty },
    { key: 'taxAmount', header: 'Tax Amount', render: dashIfEmpty },
    { key: 'totalAmount', header: 'Total Amount', render: dashIfEmpty },
    { key: 'paymentMethod', header: 'Payment Method', render: dashIfEmpty },
    { key: 'trialPeriodDays', header: 'Trial Period (Days)', render: dashIfEmpty },
    { key: 'transactionId', header: 'Transaction ID', render: dashIfEmpty },
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
    <>
      <DataTable<Invoice>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={columns}
        data={invoices}
        loading={isLoading}
        showAddButton={true}
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
          />
        )}
      </FormModal>
    </>
  );
}
