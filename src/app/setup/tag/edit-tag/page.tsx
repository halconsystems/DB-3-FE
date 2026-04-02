'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { tagFields } from '../fields';

export default function EditTag() {
  const [tagId, setTagId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('tag');
    if (selected && selected.id) {
      setTagId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('tag');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    if (!tagId) {
      setFormError('Tag ID not found');
      return;
    }

    try {
      console.log('Tag updated (Demo):', { id: tagId, ...formData });
      setSuccessMsg('Tag updated successfully!');
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to update Tag');
    }
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Tag"><Loader variant="full" /></DashboardLayout>;
  }

  if (!tagId) {
    return <DashboardLayout pageTitle="Edit Tag">Tag not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Tag">
      <CommonEntityForm
        fields={tagFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Tag"
        saveButtonText="Update Tag"
        successTitle="Success"
        successMessage={successMsg}
      />
      {formError && <div style={{ color: 'red', padding: '16px' }}>{formError}</div>}
    </DashboardLayout>
  );
}
