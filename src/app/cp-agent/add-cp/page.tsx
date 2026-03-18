
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { cpAgentFields } from '../fields';
import { useZones } from '../../../hooks/zone/useZones';

export default function AddNewCpAgent() {
  const { data, isLoading } = useZones();
  const fields = React.useMemo(() => {
    const zoneOptions = (data?.data || []).map((zone: any) => ({ value: zone.id, label: zone.name }));
    return cpAgentFields.map(f =>
      (String(f.name) === 'zone') ? { ...f, options: zoneOptions } : f
    );
  }, [data]);

  const handleSave = (formData: ProfileFormData) => {
    console.log('Saved:', formData);
  };

  return (
    <DashboardLayout pageTitle="Add New CP Agent">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={fields}
          loading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}


