'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useGetTagTypeById } from '../../../hooks/tagtype/useGetTagTypeById';
import { useUpdateTagType } from '../../../hooks/tagtype/useUpdateTagType';

const tagTypeFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Name here' },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: true, placeholder: 'Enter Description here' },
];

export default function EditTagType() {
  const [tagTypeId, setTagTypeId] = useState<string | null>(null);
  const updateTagTypeMutation = useUpdateTagType();

  useEffect(() => {
    const selected = getTableRow<any>('tagtype');
    if (selected && (selected.tagId || selected.id)) {
      setTagTypeId(selected.tagId || selected.id);
    }
    clearTableRow('tagtype');
  }, []);

  const { data, isLoading, error } = useGetTagTypeById(tagTypeId || '');

  let initialValues: ProfileFormData | undefined = undefined;
  if (data) {
    initialValues = {
      name: data.name,
      description: data.description,
    };
  }

  const handleSave = (formData: ProfileFormData) => {
    if (!tagTypeId) return;
    updateTagTypeMutation.mutate({
      id: tagTypeId,
      name: formData.name || '',
      description: formData.description || '',
    });
  };

  return (
    <DashboardLayout pageTitle="Edit Tag Type">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={tagTypeFields}
          saveButtonText="Edit"
          initialValues={initialValues}
          loading={isLoading || updateTagTypeMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}