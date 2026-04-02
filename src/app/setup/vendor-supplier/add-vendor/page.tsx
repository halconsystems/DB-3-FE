'use client';
import React from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { vendorFields } from '../fields';

export default function AddNewVendor() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Vendor/Supplier">
      <div style={{ margin: '0 auto' }}>
        {}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={vendorFields}
        />
      </div>
    </DashboardLayout>
  );
}
