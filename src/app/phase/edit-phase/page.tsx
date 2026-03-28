'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { usePhaseById } from '../../../hooks/phase/usePhaseById';
import { useUpdatePhase } from '../../../hooks/phase/useUpdatePhase';

const phaseFields: ProfileField[] = [
  { name: 'phaseName' as keyof ProfileFormData, label: 'Phase Name', type: 'text', required: true, placeholder: 'Phase Name here' },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: true, placeholder: 'Description here' },
];


const mockPhaseData: ProfileFormData = {
  phaseName: 'Phase 1',
  description: 'Main residential phase',
};

export default function EditPhase() {
    const updatePhaseMutation = useUpdatePhase();
  const [phaseId, setPhaseId] = useState<string | null>(null);

  useEffect(() => {
    const selected = getTableRow<any>('phase');
    if (selected && selected.id) {
      setPhaseId(selected.id);
    }
    clearTableRow('phase');
  }, []);

  const { data, isLoading, error } = usePhaseById(phaseId || undefined);

  let initialValues: ProfileFormData | undefined = undefined;
  if (data && data.data) {
    initialValues = {
      phaseName: data.data.name,
      description: data.data.description,
    };
  }

  const handleUpdate = async (formData: ProfileFormData) => {
    if (!phaseId) return;
    await updatePhaseMutation.mutateAsync({
      id: phaseId,
      name: formData.phaseName || '',
      description: formData.description || '',
    });
  };

  return (
    <DashboardLayout pageTitle="Edit Phase">
      <div style={{ margin: '0 auto' }}>
        {isLoading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Failed to load phase data.</div>}
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



