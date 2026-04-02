'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { feeScaleFields } from '../fields';

export default function AddFeeScale() {
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    try {
      // Demo mode - just log the data
      console.log('Fee Scale submitted (Demo):', formData);
      setSuccessMsg('Fee Scale added successfully!');
      // Reset after 2 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to add Fee Scale');
    }
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
