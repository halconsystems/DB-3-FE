
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { visitorFields } from '../fields';

export default function AddNewVisitor() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Visitor">
      <div style={{ margin: '0 auto' }}>
        {}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={visitorFields}
        />
      </div>
    </DashboardLayout>
  );
}


