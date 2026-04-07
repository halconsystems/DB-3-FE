'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import { saveTableRow } from '../../../../lib/tableRowStorage';
import { useGetAllTagTypes } from '../../../../hooks/tagtype/useGetAllTagTypes';

export interface TableTagType {
  id: string;
  tagTypeName: string;
  description: string;
  created?: string;
  status: 'Active' | 'Inactive';
}

interface TagTypeTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function TagTypeTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: TagTypeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTagType, setSelectedTagType] = useState<TableTagType | null>(null);
  const router = useRouter();

  // Fetch TagTypes from API
  const { data, isLoading } = useGetAllTagTypes();

  // Map API data to table format
  const tagTypes: TableTagType[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      id: item.id,
      tagTypeName: item.name,
      description: item.description,
      status: item.isActive ? 'Active' : 'Inactive',
    }));
  }, [data]);

  const handleEdit = (item: TableTagType) => {
    saveTableRow('tag-type', item);
    router.push('/setup/tag-type/edit-tagtype');
  };

  const handleDelete = (item: TableTagType) => {
    setSelectedTagType(item);
    setDeleteModalOpen(true);
  };

  // Note: Actual delete should call API and refetch, this only closes modal for now
  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
    setSelectedTagType(null);
  };

  const tagTypeColumns: Column<TableTagType>[] = [
    { key: 'id', header: 'Tag ID' },
    { key: 'tagTypeName', header: 'Tag Type' },
    { key: 'description', header: 'Description' },
    { key: 'created', header: 'Created On' },
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
      <DataTable<TableTagType>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={tagTypeColumns}
        data={tagTypes}
        loading={isLoading}
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={onAddNew}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
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
