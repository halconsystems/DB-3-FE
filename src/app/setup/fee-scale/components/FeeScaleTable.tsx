"use client";
import WarningModal from '../../../../components/popup/WarningModal';
import { useEffect, useState, useMemo } from 'react';
import { useFeeScales } from '../../../../hooks/fees/useFeeScales';
import { useRemoveFeeScale } from '../../../../hooks/fees/useRemoveFeeScale';
import { useCreateFeeScale } from '../../../../hooks/fees/useCreateFeeScale';
import { useUpdateFeeScale } from '../../../../hooks/fees/useUpdateFeeScale';
import { useFeeScaleById } from '../../../../hooks/fees/useFeeScaleById';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { formatDateDisplay } from '../../../../lib/dateUtils';
import { feeScaleFields } from '../fields';

interface FeeScale {
  id: string;
  packageName: string;
  feeCategory: string;
  amount: number;
  description: string;
  applicableUserTypes: string;
  applicableVehicleCategory: string;
  isTaxApplicable: boolean;
  taxPercentage: number;
  discountPercentage: number | null;
  mdrPercentage: number | null;
  fedTaxPercentage: number | null;
  discountValidFrom: string | null;
  discountValidTo: string | null;
  currency: string;
  created: string | null;
  createdBy: string | null;
  status: 'Active' | 'Inactive';
}

interface FeeScaleTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}

export default function FeeScaleTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams
}: FeeScaleTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useFeeScales();
  const removeFeeScaleMutation = useRemoveFeeScale();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeeScale, setSelectedFeeScale] = useState<FeeScale | null>(null);
  const [editFeeScaleId, setEditFeeScaleId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: createFeeScale } = useCreateFeeScale();
  const { mutateAsync: updateFeeScale } = useUpdateFeeScale();
  const { data: editFeeScaleDetails, isLoading: isEditFeeScaleLoading } = useFeeScaleById(editFeeScaleId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditFeeScaleId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('fee-scale');
        if (selected?.id) {
          setEditFeeScaleId(String(selected.id));
          clearTableRow('fee-scale');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditFeeScaleId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/fee-scale');
  };

  const handleAddFeeScale = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createFeeScale({
        name: data.name || '',
        feeCategory: data.feeCategory || '',
        amount: data.amount ? Number(data.amount) : 0,
        taxPercentage: data.taxPercentage ? Number(data.taxPercentage) : 0,
        currency: data.currency || '',
        isTaxApplicable: Boolean(data.isTaxApplicable),
        applicableUserTypes: data.applicableUserTypes || '',
        applicableVehicleCategory: data.applicableVehicleCategory || '',
        description: data.description || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create fee scale';
      setFormError(message);
    }
  };

  const initialFeeScaleValues = useMemo<ProfileFormData | null>(() => {
    if (!editFeeScaleDetails?.data) return null;
    return {
      name: editFeeScaleDetails.data.name || '',
      feeCategory: editFeeScaleDetails.data.feeCategory || '',
      amount: String(editFeeScaleDetails.data.amount || ''),
      taxPercentage: String(editFeeScaleDetails.data.taxPercentage || ''),
      currency: editFeeScaleDetails.data.currency || '',
      isTaxApplicable: editFeeScaleDetails.data.isTaxApplicable,
      applicableUserTypes: editFeeScaleDetails.data.applicableUserTypes || '',
      applicableVehicleCategory: editFeeScaleDetails.data.applicableVehicleCategory || '',
      description: editFeeScaleDetails.data.description || '',
    };
  }, [editFeeScaleDetails]);

  const handleUpdateFeeScale = async (formData: ProfileFormData) => {
    if (!editFeeScaleId || !editFeeScaleDetails?.data) return;
    setFormError('');
    try {
      await updateFeeScale({
        id: editFeeScaleId,
        name: formData.name || editFeeScaleDetails.data.name || '',
        feeCategory: formData.feeCategory || editFeeScaleDetails.data.feeCategory || '',
        amount: formData.amount ? Number(formData.amount) : editFeeScaleDetails.data.amount,
        taxPercentage: formData.taxPercentage ? Number(formData.taxPercentage) : editFeeScaleDetails.data.taxPercentage,
        currency: formData.currency || editFeeScaleDetails.data.currency || '',
        isTaxApplicable: formData.isTaxApplicable !== undefined ? Boolean(formData.isTaxApplicable) : editFeeScaleDetails.data.isTaxApplicable,
        applicableUserTypes: formData.applicableUserTypes || editFeeScaleDetails.data.applicableUserTypes || '',
        applicableVehicleCategory: formData.applicableVehicleCategory || editFeeScaleDetails.data.applicableVehicleCategory || '',
        description: formData.description || editFeeScaleDetails.data.description || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update fee scale';
      setFormError(message);
    }
  };
  const feeScales: FeeScale[] = (data?.data || []).map((item: any) => ({
    id: item.id,
    packageName: item.name || '',
    feeCategory: item.feeCategory || '',
    amount: item.amount ?? 0,
    description: item.description || '',
    applicableUserTypes: item.applicableUserTypes || '',
    applicableVehicleCategory: item.applicableVehicleCategory || '',
    isTaxApplicable: item.isTaxApplicable,
    taxPercentage: item.taxPercentage ?? 0,
    discountPercentage: item.discountPercentage ?? null,
    mdrPercentage: item.mdrPercentage ?? null,
    fedTaxPercentage: item.fedTaxPercentage ?? null,
    discountValidFrom: item.discountValidFrom ?? null,
    discountValidTo: item.discountValidTo ?? null,
    currency: item.currency || '',
    created: item.created ?? null,
    createdBy: item.createdBy ?? null,
    status: item.isActive ? 'Active' : 'Inactive',
  }));

  const handleEdit = (item: FeeScale) => {
    saveTableRow('fee-scale', item);
    router.push(`/setup/fee-scale?modal=edit&id=${encodeURIComponent(item.id)}`);
  };

  const handleDelete = (id: string) => {
    const feeScale = feeScales.find((f) => f.id === id) || null;
    setSelectedFeeScale(feeScale);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFeeScale) {
      removeFeeScaleMutation.mutate({ id: selectedFeeScale.id });
    }
    setDeleteModalOpen(false);
    setSelectedFeeScale(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedFeeScale(null);
  };

  const columns: Column<FeeScale>[] = [
    { key: 'packageName', header: 'Name' },
    { key: 'feeCategory', header: 'Fee Category' },
    { key: 'description', header: 'Description' },
    { key: 'applicableUserTypes', header: 'Applicable User Types' },
    { key: 'applicableVehicleCategory', header: 'Applicable Vehicle Category' },
    { key: 'amount', header: 'Amount' },
    {
      key: 'isTaxApplicable',
      header: 'Tax Applicable',
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    { key: 'taxPercentage', header: 'Tax %' },
    { key: 'discountPercentage', header: 'Discount %', render: (value) => value === null || value === undefined || value === '' ? '-' : value },
    { key: 'mdrPercentage', header: 'MDR %', render: (value) => value === null || value === undefined || value === '' ? '-' : value },
    { key: 'fedTaxPercentage', header: 'FED Tax %', render: (value) => value === null || value === undefined || value === '' ? '-' : value },
    { key: 'discountValidFrom', header: 'Discount Valid From', render: (value) => value ? formatDateDisplay(value) : '-' },
    { key: 'discountValidTo', header: 'Discount Valid To', render: (value) => value ? formatDateDisplay(value) : '-' },
    { key: 'currency', header: 'Currency' },
    { key: 'created', header: 'Created', render: (value) => value ? formatDateDisplay(value) : '-' },
    { key: 'createdBy', header: 'Created By', render: (value) => value === null || value === undefined || value === '' ? '-' : value },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
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
      <DataTable<FeeScale>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={columns}
        data={feeScales}
        loading={isLoading}
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={() => router.push('/setup/fee-scale?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add Fee Scale"
      >
        <CommonEntityForm
          title=""
          fields={feeScaleFields}
          initialValues={{
            name: '',
            feeCategory: '',
            amount: '',
            taxPercentage: '',
            currency: '',
            isTaxApplicable: false,
            applicableUserTypes: '',
            applicableVehicleCategory: '',
            description: '',
          }}
          onSave={handleAddFeeScale}
          onCancel={handleCloseModal}
          loading={false}
          error={formError}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Fee Scale"
      >
        {isEditFeeScaleLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={feeScaleFields}
            initialValues={initialFeeScaleValues || { name: '', feeCategory: '', amount: '', taxPercentage: '', currency: '', isTaxApplicable: false, applicableUserTypes: '', applicableVehicleCategory: '', description: '' }}
            onSave={handleUpdateFeeScale}
            onCancel={handleCloseModal}
            loading={false}
            error={formError}
          />
        )}
      </FormModal>
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Fee Scale"
        message={`Are you sure you want to delete the fee scale "${selectedFeeScale?.packageName ?? ''}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
