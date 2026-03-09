
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';
const phaseFields: ProfileField[] = [
  { name: 'phaseName', label: 'Phase Name', type: 'text', required: true, placeholder: 'Phase Name here' },
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Description here' },
];
export default function AddNewPhase() {
  const handleSave = (data: ProfileFormData) => { 
    console.log('Saved:', data);
  };
  return (
    <DashboardLayout pageTitle="Add New Phase">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={phaseFields}
        />
      </div>
    </DashboardLayout>
  );
}
