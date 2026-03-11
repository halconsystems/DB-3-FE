'use client';
import React, { useEffect, useState } from 'react';
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


const mockVehicleData: ProfileFormData = {
  vehicleNo: 'ABC123',
  vehicleNo2: '123456',
  licensePlate: 'ABC-123',
  make: 'Toyota',
  model: 'Corolla',
  color: 'White',
  year: '2020',
  eTagId: '996952346550',
  eTagType: 'type1',
  issueDate: '2024-01-01',
  expiryDate: '2026-01-01',
  tagStatus: 'active',
  attachment: null,
};

export default function EditVehicle() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    
    setTimeout(() => {
      setInitialValues(mockVehicleData);
    }, 500);
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Vehicle">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            fields={vehicleFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



