'use client';
import React, { useState } from 'react';
import { useCreateFeeScale } from '../../../../hooks/fees/useCreateFeeScale';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { feeScaleFields } from '../fields';

export default function AddFeeScale() {
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const createFeeScaleMutation = useCreateFeeScale();

  const handleSave = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    createFeeScaleMutation.mutate(formData as any, {
      onSuccess: () => {
        setSuccessMsg('Fee Scale added successfully!');
        setTimeout(() => {
          setSuccessMsg("");
        }, 2000);
      },
      onError: (error: any) => {
        setFormError(error?.message || 'Failed to add Fee Scale');
      }
    });
  };

  return (
    <DashboardLayout pageTitle="Add Fee Scale">
      <CommonEntityForm
        fields={feeScaleFields}
        onSave={handleSave}
        title="Add New Fee Scale"
        saveButtonText="Add Fee Scale"
        successTitle="Success"
        successMessage={successMsg}
      />
      {formError && <div style={{ color: 'red', padding: '16px' }}>{formError}</div>}
    </DashboardLayout>
  );
}
