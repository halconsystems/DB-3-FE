
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';






// Fields for Add New Zone matching the screenshot order
const zoneFields: ProfileField[] = [
  { name: 'zoneName', label: 'Zone Name', type: 'text', required: true, placeholder: 'Zone Name here' },
  { name: 'phase', label: 'Phase', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
];



export default function AddNewZone() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Zone">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={zoneFields}
        />
      </div>
    </DashboardLayout>
  );
}
