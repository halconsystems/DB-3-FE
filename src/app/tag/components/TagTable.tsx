'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';


import { useGetAllTags } from '../../../hooks/tag/useGetAllTags';


// Tag type for table row (matches mapped API data)
type Tag = {
  tagId: string;
  tagNumber: string;
  tagType: string;
  validFrom: string;
  validTo: string;
  entityType: string;
  entityId: string;
  vendorId: string;
  status: 'Active' | 'Inactive';
};


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
  const { data, isLoading, isError } = useGetAllTags();
  const [Tags, setTags] = useState<Tag[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const router = useRouter();
  const removeTagMutation = useRemoveTag();
  useEffect(() => {
    if (data && data.data) {
      const mapped = data.data.map((tag: any) => ({
        tagId: tag.id,
        tagNumber: tag.tagNumber,
        tagType: tag.tagTypeId,
        validFrom: tag.validFrom,
        validTo: tag.validTo,
        entityType: tag.assignedEntityType,
        entityId: tag.assignedEntityId,
        vendorId: '',
        status: tag.isActive ? 'Active' as const : 'Inactive' as const,
      }));
      setTags(mapped);
    }
  }, [data]);



  const handleEdit = (item: Tag) => {
    saveTableRow('tag', item);
    router.push('/tag/edit-tag');
  };
  const handleDelete = (item: Tag) => {
    setSelectedTag(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) {
      return;
    }
    removeTagMutation.mutate(selectedTag.tagId);
    setDeleteModalOpen(false);
    setSelectedTag(null);
  };
  const TagColumns: Column<Tag>[] = [
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'tagType', header: 'Tag Type' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTo', header: 'Valid To' },
    { key: 'entityType', header: 'Assigned Entity Type' },
    { key: 'entityId', header: 'Assigned Entity ID' },
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


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Failed to load tags.</div>;
  }

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
        title="Delete Tag"
        message="Are you sure you want to delete this Tag? This action cannot be undone."
      />
    </>
  );
}
import { useRemoveTag } from '../../../hooks/tag/useRemoveTag';
