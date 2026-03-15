'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';

export interface CpAgent {
  id: number;
  cpAgentName: string;
  controller: string;
  zone: string;
  interCommName: string;
  laneType: string;
  manufacturer: string;
  status: 'Active' | 'Inactive';
}

export const sampleCpAgents: CpAgent[] = [
  { id: 1, cpAgentName: 'Agent One', controller: '5595541230892', zone: 'Zone A', interCommName: '5595541230892', laneType: 'DHA Phase I', manufacturer: 'DHA Phase I', status: 'Active' },
  { id: 2, cpAgentName: 'Agent Two', controller: '5595541230900', zone: 'Zone B', interCommName: '5595541230900', laneType: 'DHA Phase II', manufacturer: 'DHA Phase II', status: 'Inactive' },
  { id: 3, cpAgentName: 'Agent Three', controller: '5595541230901', zone: 'Zone A', interCommName: '5595541230901', laneType: 'DHA Phase I', manufacturer: 'DHA Phase I', status: 'Active' },
  { id: 4, cpAgentName: 'Agent Four', controller: '5595541230902', zone: 'Zone B', interCommName: '5595541230902', laneType: 'DHA Phase II', manufacturer: 'DHA Phase II', status: 'Inactive' },
  { id: 5, cpAgentName: 'Agent Five', controller: '5595541230903', zone: 'Zone A', interCommName: '5595541230903', laneType: 'DHA Phase I', manufacturer: 'DHA Phase I', status: 'Active' },
  { id: 6, cpAgentName: 'Agent Six', controller: '5595541230904', zone: 'Zone B', interCommName: '5595541230904', laneType: 'DHA Phase II', manufacturer: 'DHA Phase II', status: 'Inactive' },
  { id: 7, cpAgentName: 'Agent Seven', controller: '5595541230905', zone: 'Zone A', interCommName: '5595541230905', laneType: 'DHA Phase I', manufacturer: 'DHA Phase I', status: 'Active' },
  { id: 8, cpAgentName: 'Agent Eight', controller: '5595541230906', zone: 'Zone B', interCommName: '5595541230906', laneType: 'DHA Phase II', manufacturer: 'DHA Phase II', status: 'Inactive' },
  { id: 9, cpAgentName: 'Agent Nine', controller: '5595541230907', zone: 'Zone A', interCommName: '5595541230907', laneType: 'DHA Phase I', manufacturer: 'DHA Phase I', status: 'Active' },
  { id: 10, cpAgentName: 'Agent Ten', controller: '5595541230908', zone: 'Zone B', interCommName: '5595541230908', laneType: 'DHA Phase II', manufacturer: 'DHA Phase II', status: 'Inactive' },
  { id: 11, cpAgentName: 'Agent Eleven', controller: '5595541230909', zone: 'Zone A', interCommName: '5595541230909', laneType: 'DHA Phase I', manufacturer: 'DHA Phase I', status: 'Active' },
];

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
  const [cpAgents, setCpAgents] = useState(sampleCpAgents);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CpAgent | null>(null);
  const router = useRouter();

  const handleEdit = (item: CpAgent) => {
    saveTableRow('cp-agent', item);
    router.push('/cp-agent/edit-cp');
  };

  const handleDelete = (item: CpAgent) => {
    setSelectedAgent(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedAgent) {
      return;
    }

    setCpAgents((prev) => prev.filter((agent) => agent.id !== selectedAgent.id));
    setDeleteModalOpen(false);
    setSelectedAgent(null);
  };

  const cpAgentColumns: Column<CpAgent>[] = [
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
          <CircularButton imagePath="/icons/Delete Button.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];

  return (
    <>
    <DataTable<CpAgent>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={cpAgentColumns}
      data={cpAgents}
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
      title="Delete CP Agent"
      message="Are you sure you want to delete this CP agent? This action cannot be undone."
    />
    </>
  );
}
