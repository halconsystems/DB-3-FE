'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';

const tagTypeFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Tag Type name' },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: false, placeholder: 'Tag Type description' },
];

export default function EditTagType() {
  const [tagTypeId, setTagTypeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('tag-type');
    if (selected && selected.id) {
      setTagTypeId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('tag-type');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    if (!tagTypeId) {
      setFormError('Tag Type ID not found');
      return;
    }

    try {
      console.log('Tag Type updated (Demo):', { id: tagTypeId, ...formData });
      setSuccessMsg('Tag Type updated successfully!');
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to update Tag Type');
    }
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Tag Type"><Loader variant="full" /></DashboardLayout>;
  }

  if (!tagTypeId) {
    return <DashboardLayout pageTitle="Edit Tag Type">Tag Type not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Tag Type">
      <CommonEntityForm
        fields={tagTypeFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Tag Type"
        saveButtonText="Update Tag Type"
        successTitle="Success"
        successMessage={successMsg}
      />
      {formError && <div style={{ color: 'red', padding: '16px' }}>{formError}</div>}
    </DashboardLayout>
  );
}
