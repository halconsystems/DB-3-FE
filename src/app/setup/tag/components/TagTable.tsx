'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { useGetAllTags } from '../../../../hooks/tag/useGetAllTags';
import { useRemoveTag } from '../../../../hooks/tag/useRemoveTag';
import { useCreateTag } from '../../../../hooks/tag/useCreateTag';
import { useUpdateTag } from '../../../../hooks/tag/useUpdateTag';
import { useGetTagById } from '../../../../hooks/tag/useGetTagById';
import { formatDateDisplay } from '../../../../lib/dateUtils';
import { tagFields } from '../fields';

type Tag = {
  id: string;
  tagNumber: string;
  tagType: string;
  validFrom: string;
  validTo: string;
  entityType: string;
  entityId: string;
  vendorId: string;
  status: 'Active' | 'Inactive';
  parentUserName?: string;
};

interface TagTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: ReadonlyURLSearchParams | null;
}

export default function TagTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams
}: TagTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetAllTags();
  const [Tags, setTags] = useState<Tag[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const router = useRouter();
  const removeTagMutation = useRemoveTag();
  const [editTagId, setEditTagId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: createTag } = useCreateTag();
  const { mutateAsync: updateTag } = useUpdateTag();
  const { data: editTagDetails, isLoading: isEditTagLoading } = useGetTagById(editTagId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditTagId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('tag');
        if (selected?.id) {
          setEditTagId(String(selected.id));
          clearTableRow('tag');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditTagId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/tag');
  };

  const handleAddTag = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createTag({
        tagNumber: data.tagNumber || '',
        tagType: data.tagType || '',
        validFrom: data.validFrom || '',
        validTo: data.validTo || '',
        entityType: data.entityType || '',
        entityId: data.entityId || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create tag';
      setFormError(message);
    }
  };

  const initialTagValues = useMemo<ProfileFormData | null>(() => {
    if (!editTagDetails?.data) return null;
    return {
      tagNumber: editTagDetails.data.tagNumber || '',
      tagType: editTagDetails.data.tagType || '',
      validFrom: editTagDetails.data.validFrom || '',
      validTo: editTagDetails.data.validTo || '',
      entityType: editTagDetails.data.entityType || '',
      entityId: editTagDetails.data.entityId || '',
    };
  }, [editTagDetails]);

  const handleUpdateTag = async (formData: ProfileFormData) => {
    if (!editTagId || !editTagDetails?.data) return;
    setFormError('');
    try {
      await updateTag({
        id: editTagId,
        tagNumber: formData.tagNumber || editTagDetails.data.tagNumber || '',
        tagType: formData.tagType || editTagDetails.data.tagType || '',
        validFrom: formData.validFrom || editTagDetails.data.validFrom || '',
        validTo: formData.validTo || editTagDetails.data.validTo || '',
        entityType: formData.entityType || editTagDetails.data.entityType || '',
        entityId: formData.entityId || editTagDetails.data.entityId || '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update tag';
      setFormError(message);
    }
  };

  useEffect(() => {
    if (data && data.data) {
      const mapped = data.data.map((tag: any) => ({
        id: tag.id,
        tagNumber: tag.tagNumber,
        tagType: tag.tagType,
        validFrom: tag.validFrom,
        validTo: tag.validTo,
        entityType: tag.assignedEntityType,
        entityId: tag.assignedEntityId,
        vendorId: '',
        status: tag.isActive ? 'Active' as const : 'Inactive' as const,
        parentUserName: tag.parentUserName || '',
      }));
      setTags(mapped);
    }
  }, [data]);

  const handleEdit = (item: Tag) => {
    saveTableRow('tag', item);
    router.push(`/setup/tag?modal=edit&id=${encodeURIComponent(item.id)}`);
  };

  const handleDelete = (item: Tag) => {
    setSelectedTag(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) {
      return;
    }
    removeTagMutation.mutate(selectedTag.id);
    setDeleteModalOpen(false);
    setSelectedTag(null);
  };

  const TagColumns: Column<Tag>[] = [
    { key: 'parentUserName', header: 'Parent User Name' },
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'tagType', header: 'Tag Type' },
    { key: 'validFrom', header: 'Valid From', render: (value: string) => formatDateDisplay(value) },
    { key: 'validTo', header: 'Valid To', render: (value: string) => formatDateDisplay(value) },
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

  return (
    <>
      <DataTable<Tag>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={TagColumns}
        data={Tags}
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={() => router.push('/setup/tag?modal=add')}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={isLoading}
        error={isError ? 'Failed to load tags.' : undefined}
        getRowStatus={(row) => row.status}
      />
      
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add Tag"
      >
        <CommonEntityForm
          title=""
          fields={tagFields}
          initialValues={{
            tagNumber: '',
            tagType: '',
            validFrom: '',
            validTo: '',
            entityType: '',
            entityId: '',
          }}
          onSave={handleAddTag}
          onCancel={handleCloseModal}
          loading={false}
          error={formError}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Tag"
      >
        {isEditTagLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={tagFields}
            initialValues={initialTagValues || { tagNumber: '', tagType: '', validFrom: '', validTo: '', entityType: '', entityId: '' }}
            onSave={handleUpdateTag}
            onCancel={handleCloseModal}
            loading={false}
            error={formError}
          />
        )}
      </FormModal>
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Tag"
        message="Are you sure you want to delete this tag? This action cannot be undone."
      />
    </>
  );
}
