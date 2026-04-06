"use client";
import WarningModal from '../../../../components/popup/WarningModal';
import { useState } from 'react';
import { useFeeScales } from '../../../../hooks/fees/useFeeScales';
import { useRemoveFeeScale } from '../../../../hooks/fees/useRemoveFeeScale';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import { saveTableRow } from '../../../../lib/tableRowStorage';

interface FeeScale {
  id: string;
  packageName: string;
  feeCategory: string;
  amount: number;
  taxPercentage: number;
  currency: string;
  isTaxApplicable: boolean;
  userCategory: string;
  vehicleCategory: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface FeeScaleTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}



export default function FeeScaleTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: FeeScaleTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useFeeScales();
  const removeFeeScaleMutation = useRemoveFeeScale();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeeScale, setSelectedFeeScale] = useState<FeeScale | null>(null);
  const feeScales: FeeScale[] = (data?.data || []).map((item: any) => ({
    id: item.id,
    packageName: item.name, // Assuming API 'name' maps to 'packageName'
    feeCategory: item.feeCategory,
    amount: item.amount,
    taxPercentage: item.taxPercentage,
    currency: item.currency,
    isTaxApplicable: item.isTaxApplicable,
    userCategory: item.applicableUserTypes || '',
    vehicleCategory: item.applicableVehicleCategory || '',
    description: item.description,
    status: item.isActive ? 'Active' : 'Inactive',
  }));

  const handleEdit = (item: FeeScale) => {
    saveTableRow('fee-scale', item);
    router.push('/setup/fee-scale/edit-fee-scale');
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
    { key: 'amount', header: 'Amount' },
    { key: 'taxPercentage', header: 'Tax %' },
    { key: 'currency', header: 'Currency' },
    {
      key: 'isTaxApplicable',
      header: 'Tax Applicable',
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    { key: 'userCategory', header: 'User Category' },
    { key: 'vehicleCategory', header: 'Vehicle Category' },
    { key: 'description', header: 'Description' },
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
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        headerContent={
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
            <AddNewButton onClick={onAddNew} label={addButtonLabel} />
          </div>
        }
      />
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
