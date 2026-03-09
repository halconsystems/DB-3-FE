
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';
const packageFields: ProfileField[] = [
  { name: 'packageName', label: 'Package Name', type: 'text', required: true, placeholder: 'Package Name here' },
  { name: 'packageId', label: 'Package ID', type: 'text', required: true, placeholder: 'Package ID here' },
  { name: 'minCharges', label: 'Set Minimum Charges', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'minRenewalCharges', label: 'Set Minimum Renewal Charges', type: 'text', required: true, placeholder: '001' },
];
export default function AddNewPackageType() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };
  return (
    <DashboardLayout pageTitle="Add New Package Type">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={packageFields}
        />
      </div>
    </DashboardLayout>
  );
}
