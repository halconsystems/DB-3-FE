'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../profile/components/ProfileForm';
import { residentialFields } from '../../profile/components/ProfileForm';
export default function AddNewBank() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };
  return (
    <DashboardLayout pageTitle="Add New Bank Account">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={residentialFields}
        />
      </div>
    </DashboardLayout>
  );
}
