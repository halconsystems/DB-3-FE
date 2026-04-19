'use client';
import { useState, useMemo, useEffect } from 'react';
import { useCpAgents } from '../../../../hooks/cp-agent/useCpAgents';
import { useCpAgentById } from '../../../../hooks/cp-agent/useCpAgentById';
import { useCreateCpAgent } from '../../../../hooks/cp-agent/useCreateCpAgent';
import { useUpdateCpAgent } from '../../../../hooks/cp-agent/useUpdateCpAgent';
import { useRouter } from 'next/navigation';
import { useDeleteCpAgent } from '../../../../hooks/cp-agent/useDeleteCpAgent';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { cpAgentFields } from '../fields';

export interface CpAgentTableRow {
  id: string;
  cpAgentName: string;
  controller: string;
  zone: string;
  interCommName: string;
  laneType: string;
  manufacturer: string;
  status: 'Active' | 'Inactive';
}
interface CpAgentTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}
export default function CpAgentTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams,
}: CpAgentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CpAgentTableRow | null>(null);
  const [editAgentId, setEditAgentId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError, error } = useCpAgents();
  const { mutateAsync: deleteAgent } = useDeleteCpAgent();
  const { mutateAsync: createAgent } = useCreateCpAgent();
  const { mutateAsync: updateAgent } = useUpdateCpAgent();
  const { data: editAgentDetails, isLoading: isEditAgentLoading } = useCpAgentById(editAgentId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  const cpAgents: CpAgentTableRow[] = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      id: item.id,
      cpAgentName: item.name,
      controller: item.controllerId,
      zone: item.zoneId,
      interCommName: item.interCommName,
      laneType: String(item.cpAgentType),
      manufacturer: item.serverIp,
      status: item.isActive && !item.isDeleted ? 'Active' : 'Inactive',
    }));
  }, [data]);

  const router = useRouter();

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditAgentId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('cp-agent');
        if (selected?.id) {
          setEditAgentId(String(selected.id));
          clearTableRow('cp-agent');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditAgentId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/cp-agent');
  };

  const handleAddAgent = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createAgent({
        name: data.name || '',
        controllerId: data.controllerId ? Number(data.controllerId) : 0,
        zoneId: data.zoneId ? Number(data.zoneId) : 0,
        interCommName: data.interCommName || '',
        cpAgentType: data.cpAgentType ? Number(data.cpAgentType) : 0,
        serverIp: data.serverIp || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create CP Agent';
      setFormError(message);
    }
  };

  const initialAgentValues = useMemo<ProfileFormData | null>(() => {
    if (!editAgentDetails?.data) return null;
    return {
      name: editAgentDetails.data.name || '',
      controllerId: String(editAgentDetails.data.controllerId || ''),
      zoneId: String(editAgentDetails.data.zoneId || ''),
      interCommName: editAgentDetails.data.interCommName || '',
      cpAgentType: String(editAgentDetails.data.cpAgentType || ''),
      serverIp: editAgentDetails.data.serverIp || '',
    };
  }, [editAgentDetails]);

  const handleUpdateAgent = async (formData: ProfileFormData) => {
    if (!editAgentId || !editAgentDetails?.data) return;
    setFormError('');
    try {
      await updateAgent({
        id: editAgentId,
        name: formData.name || editAgentDetails.data.name || '',
        controllerId: formData.controllerId ? Number(formData.controllerId) : editAgentDetails.data.controllerId,
        zoneId: formData.zoneId ? Number(formData.zoneId) : editAgentDetails.data.zoneId,
        interCommName: formData.interCommName || editAgentDetails.data.interCommName || '',
        cpAgentType: formData.cpAgentType ? Number(formData.cpAgentType) : editAgentDetails.data.cpAgentType,
        serverIp: formData.serverIp || editAgentDetails.data.serverIp || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update CP Agent';
      setFormError(message);
    }
  };
  const handleDelete = (item: CpAgentTableRow) => {
    setSelectedAgent(item);
    setDeleteModalOpen(true);
  };

  const handleEdit = (item: CpAgentTableRow) => {
    saveTableRow('cp-agent', item);
    router.push(`/setup/cp-agent?modal=edit&id=${encodeURIComponent(item.id)}`);
  };

  const handleConfirmDelete = async () => {
    if (selectedAgent) {
      try {
        await deleteAgent({ id: selectedAgent.id });
      } catch (err) {
        console.error('Failed to delete agent:', err);
      }
    }
    setDeleteModalOpen(false);
    setSelectedAgent(null);
  };

  const cpAgentColumns: Column<CpAgentTableRow>[] = [
    { key: 'cpAgentName', header: 'CP/Agent Name' },
    { key: 'controller', header: 'Controller' },
    { key: 'zone', header: 'Zone' },
    { key: 'interCommName', header: 'Inter Comm Name' },
    { key: 'laneType', header: 'Lane Type' },
    { key: 'manufacturer', header: 'Manufacturer' },
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
      <DataTable<CpAgentTableRow>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={cpAgentColumns}
        data={cpAgents}
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={() => router.push('/setup/cp-agent?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
        loading={isLoading}
        error={isError ? `Failed to load CP Agents: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add CP Agent"
      >
        <CommonEntityForm
          title=""
          fields={cpAgentFields}
          initialValues={{
            name: '',
            controllerId: '',
            zoneId: '',
            interCommName: '',
            cpAgentType: '',
            serverIp: '',
          }}
          onSave={handleAddAgent}
          onCancel={handleCloseModal}
          loading={false}
          error={formError}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit CP Agent"
      >
        {isEditAgentLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={cpAgentFields}
            initialValues={initialAgentValues || { name: '', controllerId: '', zoneId: '', interCommName: '', cpAgentType: '', serverIp: '' }}
            onSave={handleUpdateAgent}
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
        title="Delete CP Agent"
        message="Are you sure you want to delete this CP agent? This action cannot be undone."
      />
    </>
  );
}
