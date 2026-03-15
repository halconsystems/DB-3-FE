'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

const phaseFields: ProfileField[] = [
  { name: 'phaseName', label: 'Phase Name', type: 'text', required: true, placeholder: 'Phase Name here' },
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Description here' },
];


const mockPhaseData: ProfileFormData = {
  phaseName: 'Phase 1',
  description: 'Main residential phase',
};

export default function EditPhase() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('phase');
    setInitialValues({ ...mockPhaseData, ...(selected ?? {}) });
    clearTableRow('phase');
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Phase">
      <div style={{ margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={phaseFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



