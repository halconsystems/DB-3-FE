'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useGetTagById } from '../../../hooks/tag/useGetTagById';
import { useUpdateTag } from '../../../hooks/tag/useUpdateTag';
import { tagFields as baseTagFields, mockTagData } from '../fields';
import { useGetAllTags } from '../../../hooks/tag/useGetAllTags';
export default function EditTag() {
  const [tagId, setTagId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);
  const { data: tagsData, isLoading: tagsLoading } = useGetAllTags();
  const tagIdOptions = [
    { value: '', label: 'Select Tag ID' },
    ...(tagsData?.data?.map((tag) => ({ value: tag.id, label: tag.id })) || [])
  ];
  const tagFields = baseTagFields.map((field) =>
    field.name === 'tagId'
      ? { ...field, type: 'select' as const, options: tagIdOptions, placeholder: 'Select Tag ID' }
      : field
  );
  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('tag');
    if (selected && selected.tagId) {
      setTagId(selected.tagId);
    }
    clearTableRow('vendor-supplier');
  }, []);
  const { data: tagData, isLoading } = useGetTagById(tagId ?? '', !!tagId);
  useEffect(() => {
    if (tagData && tagData.data) {
      const toDateInput = (iso: string) => iso ? iso.split('T')[0] : '';
      setInitialValues({
        tagId: tagData.data.id,
        tagNumber: tagData.data.tagNumber,
        tagType: tagData.data.tagTypeId,
        validFrom: toDateInput(tagData.data.validFrom),
        validTo: toDateInput(tagData.data.validTo),
        entityType: tagData.data.assignedEntityType,
        entityId: tagData.data.assignedEntityId,
        status: tagData.data.isActive ? 'Active' : 'Inactive',
      });
    }
  }, [tagData]);
  const updateTagMutation = useUpdateTag();
  const handleUpdate = (data: ProfileFormData) => {
    if (!tagId) return;
    updateTagMutation.mutate({
      id: tagId,
      tagNumber: data.tagNumber || '',
      tagTypeId: data.tagType || '',
      status: data.status === 'Active' ? 1 : 0,
      validFrom: data.validFrom || '',
      validTo: data.validTo || '',
      assignedEntityType: data.entityType || '',
      assignedEntityId: data.entityId || '',
      lastModified: new Date().toISOString(),
      lastModifiedBy: 'system',
    });
  };
  return (
    <DashboardLayout pageTitle="Edit Tag">
      <div style={{ margin: '0 auto' }}>
        {(isLoading || tagsLoading) && <div>Loading...</div>}
        {initialValues && !(isLoading || tagsLoading) && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={tagFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}