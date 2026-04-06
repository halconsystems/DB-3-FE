'use client';
import { useState, useEffect } from 'react';
import { useSignalR } from 'hooks/useSignalR';
import { useGetAllRequestedTags } from '../../../../hooks/approval/useGetAllRequestedTags';
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
  const { data, isLoading, isError } = useGetAllRequestedTags(currentPage, 10); // 10 is page size, adjust as needed
  const [Tags, setTags] = useState<TagApprovalRequest[]>([]);
  const rejectMutation = useRejectTagApprovalRequest();
  const cancelMutation = useCancelTagApprovalRequest();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagApprovalRequest | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data.items)) {
      setTags(data.data.items);
    } else {
      setTags([]);
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
    { key: 'subjectType', header: 'Subject Type' },
    { key: 'subjectId', header: 'User ID' },
    { key: 'subjectName', header: 'User Name' },
    { key: 'tagType', header: 'Tag Type' },
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'feeScale', header: 'FeeScale' },
    { key: 'planType', header: 'Plan Type' },
    { key: 'notes', header: 'Description' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTo', header: 'Valid To' },
    { key: 'trialPeriod', header: 'Trial Period' },
      { key: 'status', header: 'Status', render: (value: string) => (<StatusBadge status={value} />) },
    // ...approval actions column removed...
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
        headerContent={null}
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
