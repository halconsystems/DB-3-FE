'use client';
import { useState } from 'react';
import { usePhases } from '../../../../hooks/phase/usePhases';
import { useRemovePhase } from '../../../../hooks/phase/useRemovePhase';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import WarningModal from '../../../../components/popup/WarningModal';
import { saveTableRow } from '../../../../lib/tableRowStorage';

export interface Phase {
  id: string;
  phaseName: string;
  description: string;
  status: string;
}

interface PhaseTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function PhaseTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: PhaseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: phases = [], isLoading, isError } = usePhases();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const { mutateAsync: removePhase, status: removeStatus } = useRemovePhase();
  const isDeleting = removeStatus === 'pending';

  const router = useRouter();

  const handleEdit = (item: Phase) => {
    saveTableRow('phase', item);
    router.push('/setup/phase/edit-phase');
  };

  const handleDelete = (item: Phase) => {
    setSelectedPhase(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPhase) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      await removePhase({ id: selectedPhase.id, token });
    } catch (err) {
      // Optionally handle error
    }
    setDeleteModalOpen(false);
    setSelectedPhase(null);
  };

  const phaseColumns: Column<Phase>[] = [
    { key: 'phaseName', header: 'Phase Name' },
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
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];

  return (
    <>
      <DataTable<Phase>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={phaseColumns}
        data={phases}
        loading={isLoading}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        error={isError ? 'Failed to load phases.' : undefined}
        getRowStatus={(row) => {
          if (row.status === 'Active' || row.status === 'Inactive' || row.status === 'Pending') {
            return row.status;
          }
          return undefined;
        }}
        headerContent={
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
            <AddNewButton onClick={onAddNew} label={addButtonLabel} />
          </div>
        }
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Phase"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this phase? This action cannot be undone.'}
      />
    </>
  );
}
