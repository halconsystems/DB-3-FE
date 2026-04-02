'use client';
import React from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { tagFields as baseTagFields } from '../fields';
import { useGetAllTags } from '../../../../hooks/tag/useGetAllTags';
import { useCreateTag } from '../../../../hooks/tag/useCreateTag';
import { useGetAllTagTypes } from '../../../../hooks/tagtype/useGetAllTagTypes';
export default function AddNewTag() {
  const { mutateAsync: createTag, isPending } = useCreateTag();
  const { data: tagTypesData, isLoading: tagTypesLoading } = useGetAllTagTypes();
  const tagTypeOptions = [
    { value: '', label: 'Select Tag Type' },
    ...(tagTypesData?.data?.map((type) => ({ value: type.id, label: type.name })) || [])
  ];

  // Replace the tagType field with a select using tagTypeOptions
  const tagFields = baseTagFields.map((field) =>
    field.name === 'tagType'
      ? { ...field, type: 'select' as const, options: tagTypeOptions, placeholder: 'Select Tag Type' }
      : field
  );

  const mapToCreateTagRequest = (data: ProfileFormData) => {
    return {
      tagNumber: data.tagNumber || '',
      tagTypeId: data.tagType || '', // Now tagType is the id from dropdown
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
          loading={isPending || tagTypesLoading}
        />
      </div>
    </DashboardLayout>
  );
}
