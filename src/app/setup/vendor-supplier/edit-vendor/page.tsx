'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { vendorFields } from '../fields';

export default function EditVendor() {
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);

  useEffect(() => {
    const selected = getTableRow<any>('vendor-supplier');
    if (selected && selected.id) {
      setVendorId(selected.id);
      setInitialValues(selected);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('vendor-supplier');
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    if (!vendorId) {
      throw new Error('Vendor ID not found');
    }

    console.log('Vendor updated (Demo):', { id: vendorId, ...formData });
    setSuccessMsg('Vendor updated successfully!');
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Vendor"><Loader variant="full" /></DashboardLayout>;
  }

  if (!vendorId) {
    return <DashboardLayout pageTitle="Edit Vendor">Vendor not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Vendor">
      <CommonEntityForm
        fields={vendorFields}
        initialValues={initialValues}
        onSave={handleUpdate}
        title="Edit Vendor/Supplier"
        saveButtonText="Update Vendor"
        successTitle="Success"
        successMessage={successMsg}
      />
    </DashboardLayout>
  );
}
