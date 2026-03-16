'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useZoneById } from '../../../hooks/useZoneById';
import { usePhaseOptions } from '../../../hooks/usePhaseOptions';
import { useUpdateZone } from '../../../hooks/useUpdateZone';

export default function EditZone() {
    const { options: phaseOptions, isLoading: phasesLoading } = usePhaseOptions();
    const updateZoneMutation = useUpdateZone();
  const [zoneId, setZoneId] = useState<string | null>(null);

  useEffect(() => {
    const selected = getTableRow<any>('zone');
    if (selected && selected.id) {
      setZoneId(selected.id);
    }
    clearTableRow('zone');
  }, []);

  const { data, isLoading, error } = useZoneById(zoneId || undefined);

  let initialValues: ProfileFormData | undefined = undefined;
  if (data && data.data) {
    initialValues = {
      zoneName: data.data.name,
      phase: data.data.phaseId,
      // add more mappings if needed
    };
  }

  const handleUpdate = async (formData: ProfileFormData) => {
    if (!zoneId || !data?.data) return;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let lastModifiedBy = 'Unknown';
    if (userData) {
      try {
        const user = JSON.parse(userData);
        lastModifiedBy = user.fullName || user.name || 'Unknown';
      } catch {}
    }
    const isActive = formData.isActive !== undefined ? formData.isActive : data.data.isActive;
    const zoneData = {
      id: zoneId,
      name: formData.zoneName || '',
      phaseId: formData.phase as string,
      isActive,
      isDeleted: !isActive,
      lastModified: new Date().toISOString(),
      lastModifiedBy,
    };
    await updateZoneMutation.mutateAsync(zoneData);
  };

  // Clone and inject dynamic options into zoneFields
  const dynamicZoneFields: ProfileField[] = [
    { name: 'zoneName', label: 'Zone Name', type: 'text', required: true, placeholder: 'Zone Name here' },
    { name: 'phase', label: 'Phase', type: 'select', required: true, options: phaseOptions },
  ];

  return (
    <DashboardLayout pageTitle="Edit Zone">
      <div style={{ margin: '0 auto' }}>
        {(isLoading || phasesLoading) && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Failed to load zone data.</div>}
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={dynamicZoneFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



