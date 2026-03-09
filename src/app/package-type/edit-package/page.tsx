'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';

const packageFields: ProfileField[] = [
  { name: 'packageName', label: 'Package Name', type: 'text', required: true, placeholder: 'Package Name here' },
  { name: 'packageId', label: 'Package ID', type: 'text', required: true, placeholder: 'Package ID here' },
  { name: 'minCharges', label: 'Set Minimum Charges', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'minRenewalCharges', label: 'Set Minimum Renewal Charges', type: 'text', required: true, placeholder: '001' },
];


const mockPackageData: ProfileFormData = {
  packageName: 'Standard',
  packageId: 'PKG-001',
  minCharges: '500',
  minRenewalCharges: '100',
};

export default function EditPackageType() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    
    setTimeout(() => {
      setInitialValues(mockPackageData);
    }, 500);
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Package Type">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {initialValues && (
          <ProfileForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            fields={packageFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
