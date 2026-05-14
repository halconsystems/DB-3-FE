'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSignalR } from 'hooks/useSignalR';
import { useGetTagApprovalRequests } from '../../../../hooks/tag-approval/useGetTagApprovalRequests';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import ApprovalModal from '../../../../components/popup/ApprovalModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { useRejectTagApprovalRequest } from '../../../../hooks/tag-approval/useRejectTagApprovalRequest';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import { useCancelTagApprovalRequest } from '../../../../hooks/tag-approval/useCancelTagApprovalRequest';
import { useCreateTagApprovalRequest } from '../../../../hooks/tag-approval/useCreateTagApprovalRequest';
import { useGetTagApprovalRequestById } from '../../../../hooks/tag-approval/useGetTagApprovalRequestById';
import { TagApprovalRequest } from '../../../../types/tag-approval.types';
import { useGetAllTagTypes } from '@/hooks/tagtype/useGetAllTagTypes';
import { formatDateDisplay } from '../../../../lib/dateUtils';
import { resolveTableTotalPages } from '../../../../lib/unwrapApiList';
import { tagApprovalFields } from '../../../../app/setup/tag-log/fields';

interface TagTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}

export default function TagApprovalTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams
}: TagTableProps) {
  useSignalR();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetTagApprovalRequests(currentPage, pageSize);
  const totalListPages = resolveTableTotalPages(data, pageSize);
  const tags = data?.items ?? [];
  const rejectMutation = useRejectTagApprovalRequest();
  const cancelMutation = useCancelTagApprovalRequest();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState<TagApprovalRequest | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagApprovalRequest | null>(null);
  const { data: tagTypesData, isLoading: tagLoading } = useGetAllTagTypes();
  const router = useRouter();
  const [editTagApprovalId, setEditTagApprovalId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: createTagApprovalRequest } = useCreateTagApprovalRequest();
  const { data: editTagApprovalDetails, isLoading: isEditTagApprovalLoading } = useGetTagApprovalRequestById(editTagApprovalId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditTagApprovalId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('tag-approval');
        if (selected?.id) {
          setEditTagApprovalId(String(selected.id));
          clearTableRow('tag-approval');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditTagApprovalId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/tag-approval');
  };

  const handleAddTagApproval = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createTagApprovalRequest({
        tagNumber: data.tagNumber || '',
        requestedBy: data.requestedBy || '',
        requestDate: data.requestDate || '',
        status: data.status || 'Pending',
      } as any);
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create tag approval request';
      setFormError(message);
    }
  };

  const initialTagApprovalValues = useMemo<ProfileFormData | null>(() => {
    if (!editTagApprovalDetails?.data) return null;
    return {
      tagNumber: editTagApprovalDetails.data.tagNumber || '',
      requestedBy: editTagApprovalDetails.data.parentUserName || '',
      requestDate: editTagApprovalDetails.data.validFrom || '',
      status: editTagApprovalDetails.data.status || 'Pending',
    };
  }, [editTagApprovalDetails]);

  const getTagTypeLabel = (tagTypeValue?: string | null): string => {
    if (!tagTypeValue || tagTypeValue.trim() === '') return '-';
    if (!tagTypesData?.data) return tagTypeValue;
    const normalized = tagTypeValue.trim().toLowerCase();
    const foundById = tagTypesData.data.find(
      (t) => t.id.toLowerCase() === normalized
    );
    if (foundById) return foundById.name;
    const foundByName = tagTypesData.data.find(
      (t) => t.name.toLowerCase() === normalized
    );
    return foundByName?.name || tagTypeValue;
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
    { key: 'hierarchicalId', header: 'User Id', render: (_: any, row) => row.hierarchicalId || '-' },
     { key: 'parentUserName', header: 'Username' },
    { key: 'subjectName', header: 'Entity Name' },
    { key: 'entityTypeDisplay', header: 'Entity Type', render: (_: any, row) => row.subjectType || '-' },
    {
      key: 'tagType',
      header: 'Tag Type',
      render: (value: string) => getTagTypeLabel(value),
    },
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'feeScale', header: 'Fee Scale' },
    { key: 'planType', header: 'Plan Type' },
    { key: 'category', header: 'Category', render: (_: any, row) => row.category || '-' },
    { key: 'subCategory', header: 'Sub Category', render: (_: any, row) => row.subCategory || '-' },
    { key: 'validFrom', header: 'Valid From', render: (value: string) => formatDateDisplay(value) },
    { key: 'validTo', header: 'Valid To', render: (value: string) => formatDateDisplay(value) },
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
            onClick={() => {
              setSelectedApprovalRequest(row);
              setApproveModalOpen(true);
            }}
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
        data={tags}
        loading={isLoading}
        showAddButton={false}
        addButtonLabel={addButtonLabel}
        currentPage={currentPage}
        totalPages={totalListPages}
        onPageChange={setCurrentPage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        serverSidePagination
        columnFilterKeys={[
    'tagType',
    'category',
    'subCategory',
    'entityType',
  ]}
        getRowStatus={(row) => row.status as 'Active' | 'Inactive' | 'Pending' | undefined}
        enableSorting={true}
        headerContent={
          <div style={{height:'40px'}}></div>
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
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Tag Approval"
        message="Are you sure you want to cancel this tag approval request?"
      />
      <ApprovalModal
        isOpen={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedApprovalRequest(null);
        }}
        data={selectedApprovalRequest}
      />
    </>
  );
}
