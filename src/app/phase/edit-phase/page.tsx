'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';

const phaseFields: ProfileField[] = [
  { name: 'phaseName', label: 'Phase Name', type: 'text', required: true, placeholder: 'Phase Name here' },
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Description here' },
];


const mockPhaseData: ProfileFormData = {
  phaseName: 'Phase 1',
  description: 'Main residential phase',
};

export default function EditPhase() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    
    setTimeout(() => {
      setInitialValues(mockPhaseData);
    }, 500);
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Phase">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {initialValues && (
          <ProfileForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            fields={phaseFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
