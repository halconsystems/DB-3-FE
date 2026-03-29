'use client';
import { useState, useMemo } from 'react';
import { useCpAgents } from '../../../hooks/cp-agent/useCpAgents';
import { useRouter } from 'next/navigation';
import { useDeleteCpAgent } from '../../../hooks/cp-agent/useDeleteCpAgent';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';

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
}

export default function CpAgentTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: CpAgentTableProps) {

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CpAgentTableRow | null>(null);
  const { data, isLoading, isError, error } = useCpAgents();
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
  const deleteMutation = useDeleteCpAgent();

  const handleEdit = (item: CpAgentTableRow) => {
    saveTableRow('cp-agent', item);
    router.push('/cp-agent/edit-cp');
  };

  const handleDelete = (item: CpAgentTableRow) => {
    setSelectedAgent(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAgent) {
      deleteMutation.mutate({ id: selectedAgent.id });
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
    {isError && (
      <div style={{ color: 'red', marginBottom: 12 }}>
        Failed to load CP Agents: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )}
    <DataTable<CpAgentTableRow>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={cpAgentColumns}
      data={cpAgents}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      getRowStatus={(row) => row.status}
      loading={isLoading}
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
      title="Delete CP Agent"
      message="Are you sure you want to delete this CP agent? This action cannot be undone."
    />
    </>
  );
}
