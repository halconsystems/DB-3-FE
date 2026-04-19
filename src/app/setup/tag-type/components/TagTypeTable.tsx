'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { useGetAllTagTypes } from '../../../../hooks/tagtype/useGetAllTagTypes';
import { useCreateTagType } from '../../../../hooks/tagtype/useCreateTagType';
import { useUpdateTagType } from '../../../../hooks/tagtype/useUpdateTagType';
import { useGetTagTypeById } from '../../../../hooks/tagtype/useGetTagTypeById';
import { tagTypeFields } from '../fields';

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
  searchParams?: any | null;
}

export default function TagTypeTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams
}: TagTypeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTagType, setSelectedTagType] = useState<TableTagType | null>(null);
  const router = useRouter();
  const [editTagTypeId, setEditTagTypeId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch TagTypes from API
  const { data, isLoading } = useGetAllTagTypes();
  const { mutateAsync: createTagType } = useCreateTagType();
  const { mutateAsync: updateTagType } = useUpdateTagType();
  const { data: editTagTypeDetails, isLoading: isEditTagTypeLoading } = useGetTagTypeById(editTagTypeId || '');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditTagTypeId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('tag-type');
        if (selected?.id) {
          setEditTagTypeId(String(selected.id));
          clearTableRow('tag-type');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditTagTypeId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/tag-type');
  };

  const handleAddTagType = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createTagType({
        name: data.tagTypeName || '',
        description: data.description || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create tag type';
      setFormError(message);
    }
  };

  const initialTagTypeValues = useMemo<ProfileFormData | null>(() => {
    if (!editTagTypeDetails) return null;
    return {
      tagTypeName: editTagTypeDetails.name || '',
      description: editTagTypeDetails.description || '',
    };
  }, [editTagTypeDetails]);

  const handleUpdateTagType = async (formData: ProfileFormData) => {
    if (!editTagTypeId || !editTagTypeDetails) return;
    setFormError('');
    try {
      await updateTagType({
        id: editTagTypeId,
        name: formData.tagTypeName || editTagTypeDetails.name || '',
        description: formData.description || editTagTypeDetails.description || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update tag type';
      setFormError(message);
    }
  };

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
    router.push(`/setup/tag-type?modal=edit&id=${encodeURIComponent(item.id)}`);
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
        onAddClick={() => router.push('/setup/tag-type?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
      
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add Tag Type"
      >
        <CommonEntityForm
          title=""
          fields={tagTypeFields}
          initialValues={{
            tagTypeName: '',
            description: '',
          }}
          onSave={handleAddTagType}
          onCancel={handleCloseModal}
          loading={false}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Tag Type"
      >
        {isEditTagTypeLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={tagTypeFields}
            initialValues={initialTagTypeValues || { tagTypeName: '', description: '' }}
            onSave={handleUpdateTagType}
            onCancel={handleCloseModal}
            loading={false}
          />
        )}
      </FormModal>
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
