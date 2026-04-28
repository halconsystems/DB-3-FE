'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { cpAgentFields } from '../fields';

export default function EditCpAgent() {
  const [cpAgentId, setCpAgentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('cp-agent');
    if (selected && selected.id) {
      setCpAgentId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('cp-agent');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    if (!cpAgentId) {
      throw new Error('CP Agent ID not found');
    }

    console.log('CP Agent updated (Demo):', { id: cpAgentId, ...formData });
    setSuccessMsg('CP Agent updated successfully!');
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit CP Agent"><Loader variant="full" /></DashboardLayout>;
  }

  if (!cpAgentId) {
    return <DashboardLayout pageTitle="Edit CP Agent">CP Agent not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit CP Agent">
      <CommonEntityForm
        fields={cpAgentFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit CP Agent"
        saveButtonText="Update CP Agent"
        successTitle="Success"
        successMessage={successMsg}
      />
    </DashboardLayout>
  );
}
