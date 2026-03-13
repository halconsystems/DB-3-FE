'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { visitorFields, mockVisitorData } from '../fields';

export default function EditVisitor() {
  const router = useRouter();

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
          initialValues={mockVisitorData}
        />
      </div>
    </DashboardLayout>
  );
}


