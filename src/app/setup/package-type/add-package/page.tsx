'use client';
import React from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { packageFields } from '../fields';

export default function AddNewPackageType() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };
  return (
    <DashboardLayout pageTitle="Add New Package Type">
      <div style={{ margin: '0 auto' }}>
        {}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={packageFields}
        />
      </div>
    </DashboardLayout>
  );
}
