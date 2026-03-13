'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

const zoneFields: ProfileField[] = [
  { name: 'zoneName', label: 'Zone Name', type: 'text', required: true, placeholder: 'Zone Name here' },
  { name: 'phase', label: 'Phase', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
];

// Simulate fetching existing Zone data (replace with real API call)
const mockZoneData: ProfileFormData = {
  zoneName: 'Zone A',
  phase: '',
};

export default function EditZone() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    // Replace this with real API call to fetch Zone data by ID
    setTimeout(() => {
      setInitialValues(mockZoneData);
    }, 500);
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    // Replace with real update logic
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Zone">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={zoneFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



