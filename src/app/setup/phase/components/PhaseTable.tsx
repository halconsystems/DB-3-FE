'use client';
import { useEffect, useState, useMemo } from 'react';
import { usePhases } from '../../../../hooks/phase/usePhases';
import { useRemovePhase } from '../../../../hooks/phase/useRemovePhase';
import { useCreatePhase } from '../../../../hooks/phase/useCreatePhase';
import { useUpdatePhase } from '../../../../hooks/phase/useUpdatePhase';
import { usePhaseById } from '../../../../hooks/phase/usePhaseById';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { phaseFields } from '../fields';

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
  searchParams?: ReadonlyURLSearchParams | null;
}

export default function PhaseTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams
}: PhaseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: phases = [], isLoading, isError } = usePhases();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const { mutateAsync: removePhase, status: removeStatus } = useRemovePhase();
  const isDeleting = removeStatus === 'pending';
  const [editPhaseId, setEditPhaseId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: createPhase } = useCreatePhase();
  const { mutateAsync: updatePhase } = useUpdatePhase();
  const { data: editPhaseDetails, isLoading: isEditPhaseLoading } = usePhaseById(editPhaseId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  const router = useRouter();

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditPhaseId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('phase');
        if (selected?.id) {
          setEditPhaseId(String(selected.id));
          clearTableRow('phase');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditPhaseId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/phase');
  };

  const handleAddPhase = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createPhase({
        phaseName: data.phaseName || '',
        description: data.description || '',
        cardNo: data.cardNo || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create phase';
      setFormError(message);
    }
  };

  const initialPhaseValues = useMemo<ProfileFormData | null>(() => {
    if (!editPhaseDetails?.data) return null;
    return {
      phaseName: editPhaseDetails.data.phaseName || '',
      description: editPhaseDetails.data.description || '',
      cardNo: editPhaseDetails.data.cardNo || '',
    };
  }, [editPhaseDetails]);

  const handleUpdatePhase = async (formData: ProfileFormData) => {
    if (!editPhaseId || !editPhaseDetails?.data) return;
    setFormError('');
    try {
      await updatePhase({
        id: editPhaseId,
        phaseName: formData.phaseName || editPhaseDetails.data.phaseName || '',
        description: formData.description || editPhaseDetails.data.description || '',
        cardNo: formData.cardNo || editPhaseDetails.data.cardNo || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update phase';
      setFormError(message);
    }
  };

  const handleEdit = (item: Phase) => {
    saveTableRow('phase', item);
    router.push(`/setup/phase?modal=edit&id=${encodeURIComponent(item.id)}`);
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
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={() => router.push('/setup/phase?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        error={isError ? 'Failed to load phases.' : undefined}
        getRowStatus={(row) => {
          if (row.status === 'Active' || row.status === 'Inactive' || row.status === 'Pending') {
            return row.status;
          }
          return undefined;
        }}
      />
      
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add Phase"
      >
        <CommonEntityForm
          title=""
          fields={phaseFields}
          initialValues={{
            phaseName: '',
            description: '',
            cardNo: '',
          }}
          onSave={handleAddPhase}
          onCancel={handleCloseModal}
          loading={false}
          error={formError}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Phase"
      >
        {isEditPhaseLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={phaseFields}
            initialValues={initialPhaseValues || { phaseName: '', description: '', cardNo: '' }}
            onSave={handleUpdatePhase}
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
        title="Delete Phase"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this phase? This action cannot be undone.'}
      />
    </>
  );
}
