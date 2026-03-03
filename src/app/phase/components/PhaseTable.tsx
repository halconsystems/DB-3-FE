'use client';
import { useState } from 'react';
import DataTable, { Column, Tab } from '../../../components/tables/DataTable';
import { AddNewButton } from '../../../components/ui/ActionButton';
import { statusColumn, actionColumn } from '../../../components/tables/TableColumns';

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
    <img src="/icons/delete Button.png" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
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

  const handleEdit = (item: Phase) => {
    
  };
  const handleDelete = (item: Phase) => {
    
  };
  const phaseColumns: Column<Phase>[] = [
    { key: 'phaseName', header: 'Phase Name' },
    { key: 'description', header: 'Description' },
    statusColumn,
    actionColumn(handleEdit, handleDelete),
  ];

  return (
    <DataTable<Phase>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={phaseColumns}
      data={samplePhases}
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
  );
}
