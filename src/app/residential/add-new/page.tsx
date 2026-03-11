
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

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

export default function AddNewResidential() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Residential/Commercial">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={residentialFields}
        />
      </div>
    </DashboardLayout>
  );
}


