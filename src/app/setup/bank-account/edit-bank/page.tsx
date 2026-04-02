'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { bankAccountFields } from '../fields';

export default function EditBankAccount() {
  const [bankAccountId, setBankAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('bank-account');
    if (selected && selected.id) {
      setBankAccountId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('bank-account');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    if (!bankAccountId) {
      setFormError('Bank Account ID not found');
      return;
    }

    try {
      console.log('Bank Account updated (Demo):', { id: bankAccountId, ...formData });
      setSuccessMsg('Bank Account updated successfully!');
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to update Bank Account');
    }
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Bank Account"><Loader variant="full" /></DashboardLayout>;
  }

  if (!bankAccountId) {
    return <DashboardLayout pageTitle="Edit Bank Account">Bank Account not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Bank Account">
      <CommonEntityForm
        fields={bankAccountFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Bank Account"
        saveButtonText="Update Bank Account"
        successTitle="Success"
        successMessage={successMsg}
      />
      {formError && <div style={{ color: 'red', padding: '16px' }}>{formError}</div>}
    </DashboardLayout>
  );
}
