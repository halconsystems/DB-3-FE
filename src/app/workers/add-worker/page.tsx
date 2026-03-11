
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

// Fields for Add New Worker matching the screenshot order
const workerFields: ProfileField[] = [
  // 1. Search (If already registered)
  { name: 'search', label: 'Search (If already registered)', type: 'text', required: false, placeholder: 'Type Membership No. / CNIC / Reg. Cell No.' },
  // 2. Select Job Type
  { name: 'jobType', label: 'Select Job Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'driver', label: 'Driver' }, { value: 'cook', label: 'Cook' }, { value: 'guard', label: 'Guard' }, { value: 'peon', label: 'Peon' }, { value: 'gardener', label: 'Gardener' } ] },
  // 3. Full Name
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  // 4. Father / Husband Name
  { name: 'fatherOrHusband', label: 'Father / Husband Name', type: 'text', required: true, placeholder: 'Full Name here' },
  // 5. Date of Birth (DOB)
  { name: 'dob', label: 'Date of Birth (DOB)', type: 'date', required: true, placeholder: 'Select Date' },
  // 6. Add Cell Number
  { name: 'cellNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  // 7. CNIC / NICOP No.
  { name: 'cnic', label: 'CNIC / NICOP No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  // 8. Police Verification
  { name: 'policeVerification', label: 'Police Verification', type: 'select', required: true, options: [ { value: '', label: 'Select (Yes/No)' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' } ] },
  // 9. Select Worker's Card Delivery
  { name: 'cardDelivery', label: `Select Worker's Card Delivery`, type: 'select', required: false, options: [ { value: '', label: 'Select here' }, { value: 'owner', label: 'Owner/Employer Address' }, { value: 'self', label: 'Self Pick Up' } ] },
  // 10. Select Address / Location
  { name: 'address', label: 'Select Address / Location', type: 'text', required: false, placeholder: 'Select here' },
  // 11. Card No. / ID
  { name: 'cardNo', label: 'Card No. / ID', type: 'text', required: false, placeholder: 'Type here' },
  // 12. Issue Date
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  // 13. Expiry Date
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true, placeholder: 'Select Date' },
  // 14. Card Status
  { name: 'cardStatus', label: 'Card Status', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  // 15. Profile Picture
  { name: 'profilePicture', label: 'Profile Picture', type: 'file', required: true },
  // 16. Police Verification+
  { name: 'policeVerificationFile', label: 'Police Verification+', type: 'file', required: false, placeholder: 'If Yes Add Picture' },
  // 17. CNIC Front
  { name: 'cnicFront', label: 'CNIC Front', type: 'file', required: true },
  // 18. CNIC Back
  { name: 'cnicBack', label: 'CNIC Back', type: 'file', required: true },
];


export default function AddNewWorker() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Worker">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={workerFields}
        />
      </div>
    </DashboardLayout>
  );
}


