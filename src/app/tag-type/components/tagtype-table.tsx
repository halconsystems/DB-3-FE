"use client";
import { useRemoveTagType } from '../../../hooks/tagtype/useRemoveTagType';
import { useState, useEffect } from 'react';
import { useGetAllTagTypes } from '../../../hooks/tagtype/useGetAllTagTypes';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';


export interface Tag {
  tagId: string;
  name: string;
  description: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

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
  const removeTagTypeMutation = useRemoveTagType();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetAllTagTypes();
  const [Tags, setTags] = useState<Tag[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data && data.data) {
      const mapped = data.data.map((item: any) => ({
        tagId: item.id,
        name: item.name,
        description: item.description,
        createdOn: item.created,
        status: item.isActive ? 'Active' as const : 'Inactive' as const,
      }));
      setTags(mapped);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Failed to load tag types.</div>;
  }

  const handleEdit = (item: Tag) => {
    // Ensure the saved object has an 'id' property for the edit form
    saveTableRow('tagtype', { ...item, id: item.tagId });
    router.push('/tag-type/edit-tagtype');
  };
  const handleDelete = (item: Tag) => {
    setSelectedTag(item);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (!selectedTag) {
      return;
    }
    removeTagTypeMutation.mutate(selectedTag.tagId);
    setDeleteModalOpen(false);
    setSelectedTag(null);
  };
  const TagColumns: Column<Tag>[] = [
    { key: 'tagId', header: 'Tag ID' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'createdOn', header: 'Created On' },
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
