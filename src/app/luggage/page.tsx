'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import { AddNewButton } from '../../components/ui/ActionButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useLuggage } from '../../hooks/luggage/useLuggage';
import { useDeleteLuggage } from '../../hooks/luggage/useDeleteLuggage';
import type { Luggage } from '../../services/luggage.service';

interface LuggagePass {
  id: string;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

type SelectedLuggageRow = Pick<Luggage, 'id'>;

const formatDate = (value: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

export default function LuggagePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState<SelectedLuggageRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useLuggage();
  const { mutateAsync: deleteLuggage, isPending: isDeleting } = useDeleteLuggage();

  const luggagePasses: LuggagePass[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      vehicleInfo: item.vehicleLicensePlate || '-',
      visitDetail: item.luggagePassType === 1 ? 'Long Stay' : 'Day Pass',
      validity: `${formatDate(item.validFrom)} - ${formatDate(item.validTo)}`,
      cnicNicopNo: item.cnic,
      status: item.isActive && !item.isDeleted ? 'Active' : 'Inactive',
    }));

  const router = useRouter();

  const handleAddNew = () => {
    router.push('/luggage/add-luggage');
  };

  const handleEdit = (luggage: LuggagePass) => {
    saveTableRow('luggage', luggage);
    router.push(`/luggage/edit-luggage?id=${encodeURIComponent(luggage.id)}`);
  };

  const handleDelete = (luggage: SelectedLuggageRow) => {
    setSelectedLuggage(luggage);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLuggage) {
      return;
    }

    try {
      const response = await deleteLuggage({ id: selectedLuggage.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedLuggage.id]);
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

    setDeleteModalOpen(false);
    setSelectedLuggage(null);
  };

  const columns: Column<LuggagePass>[] = [
    { key: 'name', header: 'Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'validity', header: 'Validity' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive' | 'Pending') => <StatusBadge status={value} />
    },
    { 
      key: 'action', 
      header: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];

  return (
    <DashboardLayout pageTitle="Luggage">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<LuggagePass>
        columns={columns}
        data={luggagePasses}
        loading={isLoading}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
        error={isError ? `Failed to load luggage: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Luggage Record"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this luggage record? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}