'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { phaseFields } from '../fields';
import { useCreatePhase } from '../../../../hooks/phase/useCreatePhase';

export default function AddNewPhase() {
  const { mutateAsync: createPhase, isPending, isSuccess, isError, error } = useCreatePhase();
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (data: ProfileFormData) => {
    setSuccessMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      if (!token) {
        throw new Error('No auth token found. Please sign in.');
      }
      await createPhase({
        phaseName: data.phaseName || '',
        cardNo: '',
        description: data.description || '',
      });
      setSuccessMsg('Phase created successfully!');
    } catch (err: any) {
      throw new Error(err?.response?.data?.errorMessage || err?.message || 'Failed to create phase');
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Phase">
      <div style={{ margin: '0 auto' }}>
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
