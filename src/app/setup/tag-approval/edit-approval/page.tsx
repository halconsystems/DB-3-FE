'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { tagApprovalFields } from '../fields';

const fields = tagApprovalFields;

export default function EditTagApproval() {
  const [tagApprovalId, setTagApprovalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('tag-approval');
    if (selected && selected.id) {
      setTagApprovalId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('tag-approval');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    if (!tagApprovalId) {
      setFormError('Tag Approval ID not found');
      return;
    }

    try {
      console.log('Tag Approval updated (Demo):', { id: tagApprovalId, ...formData });
      setSuccessMsg('Tag Approval updated successfully!');
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to update Tag Approval');
    }
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Tag Approval"><Loader variant="full" /></DashboardLayout>;
  }

  if (!tagApprovalId) {
    return <DashboardLayout pageTitle="Edit Tag Approval">Tag Approval not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Tag Approval">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          fields={fields}
          initialValues={initialValues}
          onSave={handleUpdate}
          onCancel={() => window.history.back()}
          title="Edit Tag Approval Details"
          loading={false}
        />
        {formError && <div style={{ color: 'red', padding: '16px', marginTop: '16px' }}>{formError}</div>}
        {successMsg && <div style={{ color: 'green', padding: '16px', marginTop: '16px' }}>{successMsg}</div>}
      </div>
    </DashboardLayout>
  );
}
