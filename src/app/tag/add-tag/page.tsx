'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { tagFields as baseTagFields } from '../fields';
import { useGetAllTags } from '../../../hooks/tag/useGetAllTags';
import { useCreateTag } from '../../../hooks/tag/useCreateTag';
export default function AddNewTag() {
  const { mutateAsync: createTag, isPending } = useCreateTag();
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
  const mapToCreateTagRequest = (data: ProfileFormData) => {
    return {
      tagNumber: data.tagNumber || '',
      tagTypeId: data.tagId || '', 
      status: 1,
      validFrom: data.validFrom || '',
      validTo: data.validTo || '',
      assignedEntityType: data.entityType || '',
      created: new Date().toISOString(),
      createdBy: 'system',
    };
  };
  const handleSave = async (data: ProfileFormData) => {
    const tagRequest = mapToCreateTagRequest(data);
    await createTag(tagRequest);
  };
  return (
    <DashboardLayout pageTitle="Add New Tag">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={tagFields}
          loading={isPending || tagsLoading}
        />
      </div>
    </DashboardLayout>
  );
}


