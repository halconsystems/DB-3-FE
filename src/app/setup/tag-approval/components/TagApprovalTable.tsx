'use client';
import { useState, useEffect } from 'react';
import { useSignalR } from 'hooks/useSignalR';
import { useGetTagApprovalRequests } from '../../../../hooks/tag-approval/useGetTagApprovalRequests';
import { saveTableRow } from '../../../../lib/tableRowStorage';
import WarningModal from '../../../../components/popup/WarningModal';
import { useRejectTagApprovalRequest } from '../../../../hooks/tag-approval/useRejectTagApprovalRequest';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import { useCancelTagApprovalRequest } from '../../../../hooks/tag-approval/useCancelTagApprovalRequest';
import { TagApprovalRequest } from '../../../../types/tag-approval.types';

interface TagTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function TagApprovalTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: TagTableProps) {
  useSignalR(); // Enable SignalR real-time updates for tag approval
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetTagApprovalRequests();
  const [Tags, setTags] = useState<TagApprovalRequest[]>([]);
  const rejectMutation = useRejectTagApprovalRequest();
  const cancelMutation = useCancelTagApprovalRequest();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagApprovalRequest | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data && data.data) {
      setTags(data.data);
    }
  }, [data]);

  const handleEdit = (item: TagApprovalRequest) => {
    saveTableRow('tag-approval', item);
    router.push('/setup/tag-approval/edit-approval');
  };
  const handleDelete = (item: TagApprovalRequest) => {
    setSelectedTag(item);
    setDeleteModalOpen(true);
  };
  const handleReject = (item: TagApprovalRequest) => {
    setSelectedTag(item);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (!selectedTag) {
      return;
    }
    rejectMutation.mutate(selectedTag.id);
    setDeleteModalOpen(false);
    setSelectedTag(null);
  };
  const handleCancel = (item: TagApprovalRequest) => {
    setSelectedTag(item);
    setCancelModalOpen(true);
  };
  const handleConfirmCancel = () => {
    if (!selectedTag) {
      return;
    }
    cancelMutation.mutate(selectedTag.id);
    setCancelModalOpen(false);
    setSelectedTag(null);
  };

  const TagColumns: Column<TagApprovalRequest>[] = [
    { key: 'subjectName', header: 'Subject Name' },
    { key: 'subjectType', header: 'Subject Type' },
    { key: 'tagType', header: 'Tag Type' },
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'feeScale', header: 'Fee Scale' },
    { key: 'planType', header: 'Plan Type' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTo', header: 'Valid To' },
    { key: 'notes', header: 'Notes' },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <StatusBadge status={value} />
      ),
    },
    {
      key: 'approvalActions',
      header: 'Approval Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
            onClick={() => router.push(`/tag-approval/approve?id=${row.id}`)}
          >
            Approve
          </button>
          <button
            style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
            onClick={() => handleReject(row)}
            disabled={rejectMutation.isPending}
          >
            {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
          </button>
          <button
            style={{ background: '#9E9E9E', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
            onClick={() => handleCancel(row)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable<TagApprovalRequest>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={TagColumns}
        data={Tags}
        loading={isLoading}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status as 'Active' | 'Inactive' | 'Pending' | undefined}
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
        title="Reject Tag Approval"
        message="Are you sure you want to reject this tag approval request?"
      />
      <WarningModal
        isOpen={cancelModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Tag Approval"
        message="Are you sure you want to cancel this tag approval request?"
      />
    </>
  );
}
