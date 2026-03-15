'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { visitorFields, mockVisitorData } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

export default function EditVisitor() {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ProfileFormData>(mockVisitorData);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('visitors');
    setInitialValues({ ...mockVisitorData, ...(selected ?? {}) });
    clearTableRow('visitors');
  }, []);

  const handleSave = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Visitor">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please update details below!"
          onSave={handleSave}
          onCancel={() => router.back()}
          saveButtonText='Edit'
          fields={visitorFields}
          initialValues={initialValues}
        />
      </div>
    </DashboardLayout>
  );
}


