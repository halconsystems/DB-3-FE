
'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { phaseFields } from '../fields';
import { useCreatePhase } from '../../../hooks/phase/useCreatePhase';

export default function AddNewPhase() {
  const { mutateAsync: createPhase, isPending, isSuccess, isError, error } = useCreatePhase();
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (data: ProfileFormData) => {
    setFormError('');
    setSuccessMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      if (!token) {
        setFormError('No auth token found. Please sign in.');
        return;
      }
      await createPhase({
        data: {
          name: data.phaseName || '',
          description: data.description || '',
        },
        token,
      });
      setSuccessMsg('Phase created successfully!');
    } catch (err: any) {
      setFormError(err?.response?.data?.errorMessage || err?.message || 'Failed to create phase');
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Phase">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {successMsg && <div style={{ color: 'green', marginBottom: 12 }}>{successMsg}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={phaseFields}
          loading={isPending}
          saveButtonText={isPending ? 'Saving...' : 'Add'}
        />
      </div>
    </DashboardLayout>
  );
}


