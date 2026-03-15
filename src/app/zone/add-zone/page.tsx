
'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { zoneFields } from '../fields';
import { useAddZone } from '../hooks/useAddZone';


export default function AddNewZone() {
  const { addZone, isPending, isSuccess, isError, error, data } = useAddZone();
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      if (!token) {
        setFormError("No auth token found. Please sign in.");
        return;
      }
      const res = await addZone(formData, token);
      setSuccessMsg("Zone created successfully!");
    } catch (err: any) {
      setFormError(err?.response?.data?.errorMessage || err?.message || "Failed to create zone");
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Zone">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {successMsg && <div style={{ color: 'green', marginBottom: 12 }}>{successMsg}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={zoneFields}
          loading={isPending}
          saveButtonText={isPending ? 'Saving...' : 'Add'}
        />
      </div>
    </DashboardLayout>
  );
}


