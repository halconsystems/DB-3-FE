
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';


const vehicleFields: ProfileField[] = [
  { name: 'vehicleNo', label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' },
  { name: 'vehicleNo2', label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' },
  { name: 'licensePlate', label: 'License Plate', type: 'text', required: true, placeholder: 'ABC-123' },
  { name: 'make', label: 'Make', type: 'text', required: true, placeholder: 'Manufacturer' },
  { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'Model Name' },
  { name: 'color', label: 'Color', type: 'text', required: true, placeholder: 'White' },
  { name: 'year', label: 'Year', type: 'text', required: true, placeholder: '2001' },
  { name: 'eTagId', label: 'Vehicle E-Tag ID', type: 'text', required: true, placeholder: '996952346550' },
  { name: 'eTagType', label: 'E-Tag Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'type1', label: 'Type 1' }, { value: 'type2', label: 'Type 2' } ] },
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'tagStatus', label: 'Tag Status', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  { name: 'attachment', label: 'Attachment', type: 'file', required: false },
];


export default function AddNewVehicle() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Vehicle">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={vehicleFields}
        />
      </div>
    </DashboardLayout>
  );
}


