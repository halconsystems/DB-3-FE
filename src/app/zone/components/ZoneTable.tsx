'use client';
import { useState } from 'react';
import { useZones } from '../../../hooks/useZones';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import type { Zone } from '../../../services/zone.service';
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
    <img src="/icons/delete Button.svg" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
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
  const router = useRouter();
  const { data, isLoading, error } = useZones();

  const handleEdit = (item: Zone) => {
    router.push('/zone/edit-zone');
  };
  const handleDelete = (item: Zone) => {
  
  };
  const zoneColumns: Column<Zone & { phaseName?: string; status: 'Active' | 'Inactive' }>[]= [
    { key: 'name', header: 'Zone' },
    { key: 'phaseId', header: 'Phase ID' },
    {
      key: 'status',
      header: 'Status',
      render: (_: any, row) => <StatusBadge status={row.isActive ? 'Active' : 'Inactive'} />
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/Delete Button.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];
  let zones: (Zone & { phaseName?: string; status: 'Active' | 'Inactive' })[] = [];
  if (data?.data) {
    zones = data.data.map((z) => ({
      ...z,
      phaseName: z.phaseId, 
      status: z.isActive ? 'Active' : 'Inactive',
    }));
  }
  return (
    <DataTable<Zone & { phaseName?: string; status: 'Active' | 'Inactive' }>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={zoneColumns}
      data={zones}
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
      loading={isLoading}
    />
  );
}
