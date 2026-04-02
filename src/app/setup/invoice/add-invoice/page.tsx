'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { invoiceFields } from '../fields';

export default function AddInvoice() {
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    try {
      // Demo mode - just log the data
      console.log('Invoice submitted (Demo):', formData);
      setSuccessMsg('Invoice added successfully!');
      // Reset after 2 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to add Invoice');
    }
  };

  return (
    <DashboardLayout pageTitle="Add Invoice">
      <CommonEntityForm
        fields={invoiceFields}
        onSave={handleSave}
        title="Add New Invoice"
        saveButtonText="Add Invoice"
        successTitle="Success"
        successMessage={successMsg}
      />
      {formError && <div style={{ color: 'red', padding: '16px' }}>{formError}</div>}
    </DashboardLayout>
  );
}
