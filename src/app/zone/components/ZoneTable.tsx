'use client';
import { useState } from 'react';
import DataTable, { Column, Tab } from '../../../components/tables/DataTable';
import { AddNewButton } from '../../../components/ui/ActionButton';
import { statusColumn, actionColumn } from '../../../components/tables/TableColumns';
export interface Zone {
  id: number;
  zone: string;
  phaseName: string;
  status: 'Active' | 'Inactive';
}
export const sampleZones: Zone[] = [
  { id: 1, zone: 'Zone 01', phaseName: 'Phase VI', status: 'Active' },
  { id: 2, zone: 'Zone 02', phaseName: 'Phase V', status: 'Inactive' },
  { id: 3, zone: 'Zone 03', phaseName: 'Phase VII', status: 'Active' },
  { id: 4, zone: 'Zone 04', phaseName: 'Phase VII', status: 'Inactive' },
  { id: 5, zone: 'Zone 01', phaseName: 'Phase VI', status: 'Active' },
  { id: 6, zone: 'Zone 02', phaseName: 'Phase V', status: 'Inactive' },
  { id: 7, zone: 'Zone 03', phaseName: 'Phase VII', status: 'Active' },
  { id: 8, zone: 'Zone 04', phaseName: 'Phase VII', status: 'Inactive' },
  { id: 9, zone: 'Zone 01', phaseName: 'Phase VI', status: 'Active' },
  { id: 10, zone: 'Zone 02', phaseName: 'Phase V', status: 'Inactive' },
  { id: 11, zone: 'Zone 03', phaseName: 'Phase VII', status: 'Active' },
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
  const handleEdit = (item: Zone) => {
    
  };
  const handleDelete = (item: Zone) => {
    
  };
  const zoneColumns: Column<Zone>[] = [
    { key: 'zone', header: 'Zone' },
    { key: 'phaseName', header: 'Phase Name' },
    statusColumn,
    actionColumn(handleEdit, handleDelete),
  ];
  return (
    <DataTable<Zone>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={zoneColumns}
      data={sampleZones}
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
