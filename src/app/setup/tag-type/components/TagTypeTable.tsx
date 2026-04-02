'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import WarningModal from '../../../../components/popup/WarningModal';
import { saveTableRow } from '../../../../lib/tableRowStorage';

export interface TagType {
  id: string;
  tagTypeName: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface TagTypeTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

const sampleTagTypes: TagType[] = [
  {
    id: '1',
    tagTypeName: 'Residential',
    description: 'Tags for residential vehicles',
    status: 'Active'
  },
  {
    id: '2',
    tagTypeName: 'Commercial',
    description: 'Tags for commercial vehicles',
    status: 'Active'
  }
];

export default function TagTypeTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: TagTypeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tagTypes, setTagTypes] = useState<TagType[]>(sampleTagTypes);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTagType, setSelectedTagType] = useState<TagType | null>(null);
  const router = useRouter();

  const handleEdit = (item: TagType) => {
    saveTableRow('tag-type', item);
    router.push('/setup/tag-type/edit-tagtype');
  };

  const handleDelete = (item: TagType) => {
    setSelectedTagType(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTagType) {
      return;
    }
    setTagTypes((prev) => prev.filter((tagType) => tagType.id !== selectedTagType.id));
    setDeleteModalOpen(false);
    setSelectedTagType(null);
  };

  const tagTypeColumns: Column<TagType>[] = [
    { key: 'tagTypeName', header: 'Tag Type Name' },
    { key: 'description', header: 'Description' },
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
      <DataTable<TagType>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={tagTypeColumns}
        data={tagTypes}
        loading={false}
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
        title="Delete Tag Type"
        message="Are you sure you want to delete this tag type? This action cannot be undone."
      />
    </>
  );
}
