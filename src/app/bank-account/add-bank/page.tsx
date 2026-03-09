'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';

// Fields for Add New Bank Account matching the screenshot order
const bankAccountFields: ProfileField[] = [
  { name: 'bankName', label: 'Bank Name', type: 'text', required: true, placeholder: 'Bank Name here' },
  { name: 'bankCode', label: 'Bank Code', type: 'text', required: true, placeholder: 'Enter (HABB, etc.)' },
  { name: 'accountNo', label: 'Account No.', type: 'text', required: true, placeholder: 'Account Number here' },
  { name: 'iban', label: 'IBAN', type: 'text', required: true, placeholder: 'IBAN here' },
  { name: 'branchCode', label: 'Branch Code', type: 'text', required: true, placeholder: 'Branch Code here' },
  { name: 'branch', label: 'Branch', type: 'text', required: true, placeholder: 'Branch here' },
];
export default function AddNewBank() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };
  return (
    <DashboardLayout pageTitle="Add New Bank Account">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={bankAccountFields}
        />
      </div>
    </DashboardLayout>
  );
}
