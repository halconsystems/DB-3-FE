'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

// Fields for Edit Worker (same as Add Worker)
const workerFields: ProfileField[] = [
  { name: 'search', label: 'Search (If already registered)', type: 'text', required: false, placeholder: 'Type Membership No. / CNIC / Reg. Cell No.' },
  { name: 'jobType', label: 'Select Job Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'driver', label: 'Driver' }, { value: 'cook', label: 'Cook' }, { value: 'guard', label: 'Guard' }, { value: 'peon', label: 'Peon' }, { value: 'gardener', label: 'Gardener' } ] },
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'fatherOrHusband', label: 'Father / Husband Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'dob', label: 'Date of Birth (DOB)', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'cellNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic', label: 'CNIC / NICOP No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'policeVerification', label: 'Police Verification', type: 'select', required: true, options: [ { value: '', label: 'Select (Yes/No)' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' } ] },
  { name: 'cardDelivery', label: `Select Worker's Card Delivery`, type: 'select', required: false, options: [ { value: '', label: 'Select here' }, { value: 'owner', label: 'Owner/Employer Address' }, { value: 'self', label: 'Self Pick Up' } ] },
  { name: 'address', label: 'Select Address / Location', type: 'text', required: false, placeholder: 'Select here' },
  { name: 'cardNo', label: 'Card No. / ID', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'cardStatus', label: 'Card Status', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  { name: 'profilePicture', label: 'Profile Picture', type: 'file', required: true },
  { name: 'policeVerificationFile', label: 'Police Verification+', type: 'file', required: false, placeholder: 'If Yes Add Picture' },
  { name: 'cnicFront', label: 'CNIC Front', type: 'file', required: true },
  { name: 'cnicBack', label: 'CNIC Back', type: 'file', required: true },
];

// Mock data for editing a worker
const mockWorkerData: ProfileFormData = {
  search: '',
  jobType: 'driver',
  fullName: 'Ali Raza',
  fatherOrHusband: 'Raza Hussain',
  dob: '1990-01-01',
  cellNumber: '0300-1234567',
  cnic: '12345-1234567-1',
  policeVerification: 'yes',
  cardDelivery: 'owner',
  address: '123 Main St',
  cardNo: 'W-001',
  issueDate: '2026-03-01',
  expiryDate: '2027-03-01',
  cardStatus: 'active',
  profilePicture: undefined,
  policeVerificationFile: undefined,
  cnicFront: undefined,
  cnicBack: undefined,
};

export default function EditWorker() {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ProfileFormData>(mockWorkerData);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('workers');
    setInitialValues({ ...mockWorkerData, ...(selected ?? {}) });
    clearTableRow('workers');
  }, []);

  const handleSave = (data: ProfileFormData) => {
    // Save logic here
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Worker">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please update details below!"
          onSave={handleSave}
          onCancel={() => router.back()}
          saveButtonText='Edit'
          fields={workerFields}
          initialValues={initialValues}
        />
      </div>
    </DashboardLayout>
  );
}


