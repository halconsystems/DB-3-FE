'use client';
import { useEffect, useState, useMemo } from 'react';
import { useZones } from '../../../../hooks/zone/useZones';
import { useZoneById } from '../../../../hooks/zone/useZoneById';
import { useDeleteZone } from '../../../../hooks/zone/useDeleteZone';
import { useCreateZone } from '../../../../hooks/zone/useCreateZone';
import { useUpdateZone } from '../../../../hooks/zone/useUpdateZone';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { zoneFields } from '../fields';
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
  searchParams?: ReadonlyURLSearchParams | null;
}
export default function ZoneTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams,
}: VendorTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, error } = useZones();
  const [zones, setZones] = useState<(Zone & { phaseName?: string; status: 'Active' | 'Inactive' })[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<(Zone & { phaseName?: string; status: 'Active' | 'Inactive' }) | null>(null);
  const [editZoneId, setEditZoneId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: deleteZone, status: deleteStatus } = useDeleteZone();
  const { mutateAsync: createZone } = useCreateZone();
  const { mutateAsync: updateZone } = useUpdateZone();
  const { data: editZoneDetails, isLoading: isEditZoneLoading } = useZoneById(editZoneId);
  const isDeleting = deleteStatus === 'pending';

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

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

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditZoneId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('zone');
        if (selected?.id) {
          setEditZoneId(String(selected.id));
          clearTableRow('zone');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditZoneId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/zone');
  };

  const handleAddZone = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createZone({
        name: data.name || '',
        phaseId: data.phaseId ? Number(data.phaseId) : 0,
        description: data.description || '',
      });
      setZones(prev => [...prev, { id: '', name: data.name, isActive: true, status: 'Active' } as any]);
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create zone';
      setFormError(message);
    }
  };

  const initialZoneValues = useMemo<ProfileFormData | null>(() => {
    if (!editZoneDetails?.data) return null;
    return {
      name: editZoneDetails.data.name || '',
      phaseId: String(editZoneDetails.data.phaseId || ''),
      description: editZoneDetails.data.description || '',
    };
  }, [editZoneDetails]);

  const handleUpdateZone = async (formData: ProfileFormData) => {
    if (!editZoneId || !editZoneDetails?.data) return;
    setFormError('');
    try {
      await updateZone({
        id: editZoneId,
        name: formData.name || editZoneDetails.data.name || '',
        phaseId: formData.phaseId ? Number(formData.phaseId) : editZoneDetails.data.phaseId,
        description: formData.description || editZoneDetails.data.description || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update zone';
      setFormError(message);
    }
  };

  const handleEdit = (item: Zone) => {
    saveTableRow('zone', item);
    router.push(`/setup/zone?modal=edit&id=${encodeURIComponent(item.id)}`);
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
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={() => router.push('/setup/zone?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
        loading={isLoading}
      />
      
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add Zone"
      >
        <CommonEntityForm
          title=""
          fields={zoneFields}
          initialValues={{
            name: '',
            phaseId: '',
            description: '',
          }}
          onSave={handleAddZone}
          onCancel={handleCloseModal}
          loading={false}
          error={formError}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Zone"
      >
        {isEditZoneLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={zoneFields}
            initialValues={initialZoneValues || { name: '', phaseId: '', description: '' }}
            onSave={handleUpdateZone}
            onCancel={handleCloseModal}
            loading={false}
            error={formError}
          />
        )}
      </FormModal>

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
