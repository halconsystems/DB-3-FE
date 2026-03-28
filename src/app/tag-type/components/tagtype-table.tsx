'use client';
import { useState } from 'react';
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

export const sampleTags: Tag[] = [
  { tagId: '87253e23-B4df', name: 'Shahid Husain', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Active' },
  { tagId: '87253e23-B4df', name: 'Ahmed Faraz', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Inactive' },
  { tagId: '87253e23-B4df', name: 'Mustafa Javaid', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Active' },
  { tagId: '87253e23-B4df', name: 'Arsalan Khan', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Inactive' },
  { tagId: '87253e23-B4df', name: 'Shahid Husain', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Active' },
  { tagId: '87253e23-B4df', name: 'Ahmed Faraz', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Inactive' },
  { tagId: '87253e23-B4df', name: 'Mustafa Javaid', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Active' },
  { tagId: '87253e23-B4df', name: 'Arsalan Khan', description: 'Lorem Ipsum', createdOn: '12-Jun-2026', status: 'Inactive' },
];

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
  const [Tags, setTags] = useState(sampleTags);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const router = useRouter();

  const handleEdit = (item: Tag) => {
    saveTableRow('tagtype', item);
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

    setTags((prev) => prev.filter((Tag) => Tag.tagId !== selectedTag.tagId));
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
