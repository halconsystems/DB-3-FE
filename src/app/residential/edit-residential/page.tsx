'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { useRouter } from 'next/navigation';
import { residentialFields, mockResidentialData } from '../fields';

export default function EditResidential() {
  const router = useRouter();

  const handleSave = (data: ProfileFormData) => {
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Residential/Commercial">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please update details below!"
          onSave={handleSave}
          onCancel={() => router.back()}
          fields={residentialFields}
          initialValues={mockResidentialData}
          saveButtonText='Edit'
        />
      </div>
    </DashboardLayout>
  );
}


