'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData, ProfileField} from '../../../components/forms/CommonEntityForm';
import { useRouter } from 'next/navigation';

const residentialFields: ProfileField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'emailAddress', label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Password here' },
  { name: 'phoneNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [ { value: 'resident', label: 'Resident' }, { value: 'commercial', label: 'Commercial' } ] },
  { name: 'subCategory', label: 'Sub-Category', type: 'select', required: true, options: [ { value: 'house', label: 'House' }, { value: 'shop', label: 'Shop' } ] },
  { name: 'phase', label: 'Phase', type: 'select', required: true, options: [ { value: 'phase1', label: 'Phase 1' }, { value: 'phase2', label: 'Phase 2' } ] },
  { name: 'zone', label: 'Zone', type: 'select', required: true, options: [ { value: 'zoneA', label: 'Zone A' }, { value: 'zoneB', label: 'Zone B' } ] },
  { name: 'khayaban', label: 'Khayaban', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'floor', label: 'Floor', type: 'text', required: true, placeholder: '2-Digits Only' },
  { name: 'laneStreetNumber', label: 'Lane/Street No.', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'plotNo1', label: 'Plot No.', type: 'text', required: true, placeholder: '123 Only' },
  { name: 'plotNo2', label: 'Plot No.', type: 'text', required: false, placeholder: 'ABC Only' },
  { name: 'plotNo3', label: 'Plot No.', type: 'text', required: false, placeholder: '55-C' },
  { name: 'cardNo', label: 'Card No./ID', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'cardStatus', label: 'Card Status', type: 'select', required: true, options: [ { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  { name: 'profilePicture', label: 'Profile Picture', type: 'file', required: false },
  { name: 'proofOfPossession', label: 'Proof of Possession', type: 'file', required: false },
];

// Mock data for editing a residential/commercial member
const mockResidentialData: ProfileFormData = {
  fullName: 'Shahid Husain',
  emailAddress: 'shahid@gmail.com',
  password: '',
  phoneNumber: '0301-2346550',
  category: 'commercial',
  subCategory: 'shop',
  phase: 'phase2',
  zone: 'zoneA',
  khayaban: 'Khayaban-e-Ittehad',
  floor: '02',
  laneStreetNumber: '12',
  plotNo1: '50',
  plotNo2: 'A',
  plotNo3: '',
  cardNo: '02134',
  issueDate: '2026-03-01',
  expiryDate: '2027-03-01',
  cardStatus: 'active',
  profilePicture: undefined,
  proofOfPossession: undefined,
};

export default function EditResidential() {
  const router = useRouter();

  const handleSave = (data: ProfileFormData) => {
    // Save logic here
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Residential/Commercial">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please update details below!"
          onSave={handleSave}
          onCancel={() => router.back()}
          fields={residentialFields}
          initialValues={mockResidentialData}
        />
      </div>
    </DashboardLayout>
  );
}


