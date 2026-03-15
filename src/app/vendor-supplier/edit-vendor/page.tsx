'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

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


const mockVendorData: ProfileFormData = {
  businessName: 'ABC Supplies',
  city: '',
  address: '123 Main St',
  emailAddress: 'contact@abc.com',
  contactPerson: 'John Smith',
  cellNumber1: '0300-1234567',
  cellNumber2: '0300-7654321',
  vendorId: '1055',
};

export default function EditVendor() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('vendor-supplier');
    setInitialValues({ ...mockVendorData, ...(selected ?? {}) });
    clearTableRow('vendor-supplier');
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Vendor/Supplier">
      <div style={{ margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={vendorFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



