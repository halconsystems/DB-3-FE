'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { phaseFields } from '../fields';

export default function EditPhase() {
  const [phaseId, setPhaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('phase');
    if (selected && selected.id) {
      setPhaseId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('phase');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    if (!phaseId) {
      throw new Error('Phase ID not found');
    }

    console.log('Phase updated (Demo):', { id: phaseId, ...formData });
    setSuccessMsg('Phase updated successfully!');
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Phase"><Loader variant="full" /></DashboardLayout>;
  }

  if (!phaseId) {
    return <DashboardLayout pageTitle="Edit Phase">Phase not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Phase">
      <CommonEntityForm
        fields={phaseFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Phase"
        saveButtonText="Update Phase"
        successTitle="Success"
        successMessage={successMsg}
      />
    </DashboardLayout>
  );
}
