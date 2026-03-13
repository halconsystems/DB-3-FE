'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';


const luggageFields: ProfileField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'vehicleNo', label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' },
  { name: 'vehicleNo2', label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' },
  { name: 'licensePlate', label: 'License Plate', type: 'text', required: false, placeholder: 'ABC-123' },
  { name: 'qrReference', label: 'QR Reference', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'status', label: 'Status', type: 'select', required: false, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  { name: 'quickPick', label: 'Quick Pick', type: 'select', required: true, options: [ { value: 'dayPass', label: 'Day Pass' }, { value: 'longStay', label: 'Long Stay' } ] },
  { name: 'fromDate', label: 'From Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'toDate', label: 'To Date', type: 'date', required: false, placeholder: 'Select Date' },
];


const mockLuggageData: ProfileFormData = {
  fullName: 'John Doe',
  cnic: '12345-1234567-1',
  vehicleNo: 'ABC',
  vehicleNo2: '123',
  licensePlate: 'ABC-123',
  qrReference: 'QR-REF-001',
  status: 'active',
  quickPick: 'dayPass',
  fromDate: '2026-03-09',
  toDate: '2026-03-10',
};

export default function EditLuggage() {
  const router = useRouter();

  const handleSave = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Luggage">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please update details below!"
          onSave={handleSave}
          onCancel={() => router.back()}
          fields={luggageFields}
          initialValues={mockLuggageData}
          saveButtonText='Edit'
          cancelButtonText="Cancel"
        />
      </div>
    </DashboardLayout>
  );
}


