'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { useRouter } from 'next/navigation';
import { residentialFields, mockResidentialData } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

export default function EditResidential() {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ProfileFormData>(mockResidentialData);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('residential');
    setInitialValues({ ...mockResidentialData, ...(selected ?? {}) });
    clearTableRow('residential');
  }, []);

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
          initialValues={initialValues}
          saveButtonText='Edit'
        />
      </div>
    </DashboardLayout>
  );
}


