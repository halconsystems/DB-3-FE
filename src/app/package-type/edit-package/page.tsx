'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

const packageFields: ProfileField[] = [
  { name: 'packageName' as keyof ProfileFormData, label: 'Package Name', type: 'text', required: true, placeholder: 'Package Name here' },
  { name: 'packageId' as keyof ProfileFormData, label: 'Package ID', type: 'text', required: true, placeholder: 'Package ID here' },
  { name: 'minCharges' as keyof ProfileFormData, label: 'Set Minimum Charges', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'minRenewalCharges' as keyof ProfileFormData, label: 'Set Minimum Renewal Charges', type: 'text', required: true, placeholder: '001' },
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
    const selected = getTableRow<ProfileFormData>('package-type');
    setInitialValues({ ...mockPackageData, ...(selected ?? {}) });
    clearTableRow('package-type');
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Package Type">
      <div style={{ margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={packageFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



