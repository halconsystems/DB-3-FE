
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';



// Fields for Add New Vendor/Supplier matching the screenshot order
const vendorFields: ProfileField[] = [
  { name: 'businessName', label: 'Business Name', type: 'text', required: true, placeholder: 'Business Name here' },
  { name: 'city', label: 'City', type: 'select', required: true, options: [ { value: '', label: 'Select city' } ] },
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Address here' },
  { name: 'emailAddress', label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, placeholder: 'Contact Person Name here' },
  { name: 'cellNumber1', label: 'Add Cell Number 1', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cellNumber2', label: 'Add Cell Number 2', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'vendorId', label: 'Vender ID', type: 'text', required: true, placeholder: 'Auto generated (1055)' },
];



export default function AddNewVendor() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Vendor/Supplier">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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


