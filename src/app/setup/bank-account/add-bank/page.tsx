'use client';
import React from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { bankAccountFields } from '../fields';

export default function AddNewBank() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };
  return (
    <DashboardLayout pageTitle="Add New Bank Account">
      <div style={{ margin: '0 auto' }}>
        {}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={bankAccountFields}
        />
      </div>
    </DashboardLayout>
  );
}
