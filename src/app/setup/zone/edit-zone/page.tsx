'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { zoneFields } from '../fields';

export default function EditZone() {
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('zone');
    if (selected && selected.id) {
      setZoneId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('zone');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    if (!zoneId) {
      throw new Error('Zone ID not found');
    }

    // Demo mode - just log the data
    console.log('Zone updated (Demo):', { id: zoneId, ...formData });
    setSuccessMsg('Zone updated successfully!');
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Zone"><Loader variant="full" /></DashboardLayout>;
  }

  if (!zoneId) {
    return <DashboardLayout pageTitle="Edit Zone">Zone not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Zone">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          fields={zoneFields}
          initialValues={initialValues}
          onSave={handleUpdate}
          onCancel={() => window.history.back()}
          title="Edit Zone Details"
          loading={false}
        />
        {successMsg && <div style={{ color: 'green', padding: '16px', marginTop: '16px' }}>{successMsg}</div>}
      </div>
    </DashboardLayout>
  );
}
