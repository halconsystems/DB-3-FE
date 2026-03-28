'use client';
import { useState, useEffect } from 'react';
import { useGetTagApprovalRequests } from '../../../hooks/tag-approval/useGetTagApprovalRequests';
import { saveTableRow } from '../../../lib/tableRowStorage';
import WarningModal from '../../../components/popup/WarningModal';
// Tag type for table row (matches mapped API data)
type Tag = {
  tagId: string;
  name: string;
  entityId: string;
  tagType: string;
  tagNumber: string;
  feeScaleId: string;
  planType: string;
  validFrom: string;
  validTo: string;
  zone: string;
  device: string;
  notes: string;
  status: 'Active' | 'Inactive' | string;
};
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
// Removed duplicate top-level logic. All logic is inside TagTable function below.

// Remove stray/invalid code block above

interface TagTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function TagTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: TagTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetTagApprovalRequests();
  const [Tags, setTags] = useState<Tag[]>([]);


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data && data.data) {
      const mapped = data.data.map((item: any) => ({
        tagId: item.id,
        name: item.entityName,
        entityId: item.entityId,
        tagType: item.tagTypeId, // You may want to resolve tagTypeId to a name if available
        tagNumber: item.tagNumber,
        feeScaleId: item.feeScaleId,
        planType: String(item.planType),
        validFrom: item.validFrom,
        validTo: item.validTo,
        zone: item.zoneId ?? '',
        device: item.deviceId ?? '',
        notes: item.notes,
        status: item.status === 1 ? 'Active' as const : 'Inactive' as const,
      }));
      setTags(mapped);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Failed to load tag approval requests.</div>;
  }

  const handleEdit = (item: Tag) => {
    saveTableRow('tag', item);
    router.push('/tag/edit-tag');
  };
  const handleDelete = (item: Tag) => {
    setSelectedTag(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTag) {
      return;
    }

    setTags((prev) => prev.filter((Tag) => Tag.tagId !== selectedTag.tagId));
    setDeleteModalOpen(false);
    setSelectedTag(null);
  };
const TagColumns: Column<Tag>[] = [
  { key: 'name', header: 'Name' },
  { key: 'entityId', header: 'Entity ID' },
  { key: 'tagType', header: 'Tag Type' },
  { key: 'tagNumber', header: 'Tag Number' },
  { key: 'feeScaleId', header: 'Fee Scale ID' },
  { key: 'planType', header: 'Plan Type' },
  { key: 'validFrom', header: 'Valid From' },
  { key: 'validTo', header: 'Valid To' },
  { key: 'zone', header: 'Zone' },
  { key: 'device', header: 'Device' },
  { key: 'notes', header: 'Notes' },
  {
    key: 'status',
    header: 'Status',
    render: (value: 'Active' | 'Inactive') => (
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
          onClick={() => router.push('/tag-approval/approve')}
        >
          Approve
        </button>
        <button style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }} onClick={() => {/* handle reject */}}>Reject</button>
        <button style={{ background: '#9E9E9E', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }} onClick={() => {/* handle cancel */}}>Cancel</button>
      </div>
    ),
  },
  // Removed 'action' column (edit/delete) from the table
];

  return (
    <>
    <DataTable<Tag>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={TagColumns}
      data={Tags}
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
      title="Delete Tag"
      message="Are you sure you want to delete this Tag? This action cannot be undone."
    />
    </>
  );
}
