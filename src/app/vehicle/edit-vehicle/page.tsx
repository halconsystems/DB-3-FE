'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { vehicleFields, mockVehicleData } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

export default function EditVehicle() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('vehicle');
    setInitialValues({ ...mockVehicleData, ...(selected ?? {}) });
    clearTableRow('vehicle');
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Vehicle">
      <div style={{ margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={vehicleFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



