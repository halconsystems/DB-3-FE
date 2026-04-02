'use client';
import { useEffect, useState } from 'react';
import { useZones } from '../../../../hooks/zone/useZones';
import { useDeleteZone } from '../../../../hooks/zone/useDeleteZone';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import WarningModal from '../../../../components/popup/WarningModal';
import { saveTableRow } from '../../../../lib/tableRowStorage';
import type { Zone as BaseZone } from '../../../../services/zone.service';

type Zone = BaseZone & { phaseName?: string; status: 'Active' | 'Inactive' };
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
    <img src="/icons/DeleteButton.svg" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
  </button>
);
interface VendorTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}
export default function ZoneTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: VendorTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, error } = useZones();
  const [zones, setZones] = useState<(Zone & { phaseName?: string; status: 'Active' | 'Inactive' })[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<(Zone & { phaseName?: string; status: 'Active' | 'Inactive' }) | null>(null);
  const { mutateAsync: deleteZone, status: deleteStatus } = useDeleteZone();
  const isDeleting = deleteStatus === 'pending';

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    setZones(
      data.data.map((z) => ({
        ...z,
        phaseName: z.phaseName,
        status: z.isActive ? 'Active' : 'Inactive',
      })),
    );
  }, [data]);

  const handleEdit = (item: Zone) => {
    saveTableRow('zone', item);
    router.push('/setup/zone/edit-zone');
  };
  const handleDelete = (item: Zone) => {
    const zoneItem = item as Zone & { phaseName?: string; status: 'Active' | 'Inactive' };
    setSelectedZone(zoneItem);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedZone) return;
    try {
      await deleteZone({ id: selectedZone.id });
      setZones((prev) => prev.filter((zone) => zone.id !== selectedZone.id));
    } catch (err) {
      // Optionally handle error (toast, etc)
    }
    setDeleteModalOpen(false);
    setSelectedZone(null);
  };
  const zoneColumns: Column<Zone & { phaseName?: string; status: 'Active' | 'Inactive' }>[]= [
    { key: 'name', header: 'Zone' },
    { key: 'phaseName', header: 'Phase Name' },
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
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];
  return (
    <>
    <DataTable<Zone & { phaseName?: string; status: 'Active' | 'Inactive' }>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={zoneColumns}
      data={zones}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      getRowStatus={(row) => row.status}
      headerContent={
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
          <AddNewButton onClick={onAddNew} label={addButtonLabel} />
        </div>
      }
      loading={isLoading}
    />
    <WarningModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Zone"
      message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this zone? This action cannot be undone.'}
    />
    </>
  );
}
