'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { packageFields } from '../fields';

export default function EditPackageType() {
  const [packageId, setPackageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('package-type');
    if (selected && selected.id) {
      setPackageId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('package-type');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    if (!packageId) {
      throw new Error('Package ID not found');
    }

    console.log('Package Type updated (Demo):', { id: packageId, ...formData });
    setSuccessMsg('Package Type updated successfully!');
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Package Type"><Loader variant="full" /></DashboardLayout>;
  }

  if (!packageId) {
    return <DashboardLayout pageTitle="Edit Package Type">Package Type not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Package Type">
      <CommonEntityForm
        fields={packageFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Package Type"
        saveButtonText="Update Package Type"
        successTitle="Success"
        successMessage={successMsg}
      />
    </DashboardLayout>
  );
}
