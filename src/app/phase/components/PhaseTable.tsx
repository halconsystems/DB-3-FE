'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';

export interface Phase {
  id: number;
  phaseName: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export const samplePhases: Phase[] = [
  { id: 1, phaseName: 'Phase VII', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Active' },
  { id: 2, phaseName: 'Phase VI', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Inactive' },
  { id: 3, phaseName: 'Phase V', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Active' },
  { id: 4, phaseName: 'Phase VI', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Inactive' },
  { id: 5, phaseName: 'Phase VII', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Active' },
  { id: 6, phaseName: 'Phase V', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Inactive' },
  { id: 7, phaseName: 'Phase VII', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Active' },
  { id: 8, phaseName: 'Phase VI', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Inactive' },
  { id: 9, phaseName: 'Phase V', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Active' },
  { id: 10, phaseName: 'Phase VII', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Inactive' },
  { id: 11, phaseName: 'Phase VI', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.', status: 'Active' },
];

const DeleteIcon = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    style={{ 
      width: 32, 
      height: 32, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }}
  >
    <img src="/icons/delete-button.svg" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
  </button>
);

interface VendorTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function VendorTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: VendorTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [phases, setPhases] = useState(samplePhases);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const router = useRouter();

  const handleEdit = (item: Phase) => {
    saveTableRow('phase', item);
    router.push('/phase/edit-phase');
  };
  const handleDelete = (item: Phase) => {
    setSelectedPhase(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedPhase) {
      return;
    }

    setPhases((prev) => prev.filter((phase) => phase.id !== selectedPhase.id));
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
          <CircularButton imagePath="/icons/delete-button.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
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
      showAddButton={false}
      currentPage={currentPage}
      totalPages={3}
      onPageChange={setCurrentPage}
      getRowStatus={(row) => row.status}
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
      message="Are you sure you want to delete this phase? This action cannot be undone."
    />
    </>
  );
}
