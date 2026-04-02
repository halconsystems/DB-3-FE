'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { feeScaleFields } from '../fields';

export default function EditFeeScale() {
  const [feeScaleId, setFeeScaleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('fee-scale');
    if (selected && selected.id) {
      setFeeScaleId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('fee-scale');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    if (!feeScaleId) {
      setFormError('Fee Scale ID not found');
      return;
    }

    try {
      // Demo mode - just log the data
      console.log('Fee Scale updated (Demo):', { id: feeScaleId, ...formData });
      setSuccessMsg('Fee Scale updated successfully!');
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to update Fee Scale');
    }
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Fee Scale"><Loader variant="full" /></DashboardLayout>;
  }

  if (!feeScaleId) {
    return <DashboardLayout pageTitle="Edit Fee Scale">Fee Scale not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Fee Scale">
      <CommonEntityForm
        fields={feeScaleFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Fee Scale"
        saveButtonText="Update Fee Scale"
        successTitle="Success"
        successMessage={successMsg}
      />
      {formError && <div style={{ color: 'red', padding: '16px' }}>{formError}</div>}
    </DashboardLayout>
  );
}
