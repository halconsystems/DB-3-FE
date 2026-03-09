
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';


// Custom fields for Add New Luggage
const luggageFields: ProfileField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'vehicleNo', label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' },
  { name: 'vehicleNo2', label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' },
  { name: 'licensePlate', label: 'License Plate', type: 'text', required: false, placeholder: 'ABC-123' },
  { name: 'qrReference', label: 'QR Reference', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'status', label: 'Status', type: 'select', required: false, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  // Quick Pick will be handled as a custom UI below
  { name: 'quickPick', label: 'Quick Pick', type: 'select', required: true, options: [ { value: 'dayPass', label: 'Day Pass' }, { value: 'longStay', label: 'Long Stay' } ] },
  { name: 'fromDate', label: 'From Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'toDate', label: 'To Date', type: 'date', required: false, placeholder: 'Select Date' },
];

export default function AddNewLuggage() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Luggage">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={luggageFields}
          saveButtonText="Add"
          cancelButtonText="Cancel"
        />
      </div>
    </DashboardLayout>
  );
}
