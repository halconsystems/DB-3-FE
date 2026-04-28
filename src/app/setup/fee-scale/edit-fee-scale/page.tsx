'use client';
import React, { useEffect, useState } from 'react';
import { useFeeScaleById } from '../../../../hooks/fees/useFeeScaleById';
import { useUpdateFeeScale } from '../../../../hooks/fees/useUpdateFeeScale';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { feeScaleFields } from '../fields';

export default function EditFeeScale() {

  const [feeScaleId, setFeeScaleId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialValues, setInitialValues] = useState<ProfileFormData | undefined>(undefined);
  const updateFeeScaleMutation = useUpdateFeeScale();

  // On mount, get the ID from table row storage
  useEffect(() => {
    const selected = getTableRow<any>('fee-scale');
    if (selected && selected.id) {
      setFeeScaleId(selected.id);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('fee-scale');
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch fee scale by id
  const { data, isLoading } = useFeeScaleById(feeScaleId ?? '', { enabled: !!feeScaleId });

  useEffect(() => {
    if (data?.data) {
      const feeScale = data.data;
      setInitialValues({
        name: feeScale.name ?? "",
        feeCategory: feeScale.feeCategory ?? "",
        amount: feeScale.amount !== undefined && feeScale.amount !== null ? String(feeScale.amount) : "",
        description: feeScale.description ?? "",
        applicableUserTypes: feeScale.applicableUserTypes ?? "",
        applicableVehicleCategory: feeScale.applicableVehicleCategory ?? "",
        isTaxApplicable: !!feeScale.isTaxApplicable,
        taxPercentage: feeScale.taxPercentage !== undefined && feeScale.taxPercentage !== null ? String(feeScale.taxPercentage) : "",
        currency: feeScale.currency ?? "",
        status: !!feeScale.isActive,
      });
    }
  }, [data]);

  const handleUpdate = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    if (!feeScaleId) {
      throw new Error('Fee Scale ID not found');
    }

    const payload = {
      id: feeScaleId,
      name: String(formData.name ?? ""),
      feeCategory: String(formData.feeCategory ?? ""),
      amount: Number(formData.amount ?? 0),
      description: String(formData.description ?? ""),
      isActive: !!formData.status,
      applicableUserTypes: String(formData.applicableUserTypes ?? ""),
      applicableVehicleCategory: String(formData.applicableVehicleCategory ?? ""),
      isTaxApplicable: !!formData.isTaxApplicable,
      taxPercentage: Number(formData.taxPercentage ?? 0),
      currency: String(formData.currency ?? ""),
      lastModifiedBy: String(formData.lastModifiedBy ?? ""),
    };

    updateFeeScaleMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg('Fee Scale updated successfully!');
        setTimeout(() => {
          setSuccessMsg("");
        }, 2000);
      },
      onError: (error: any) => {
        throw new Error(error?.message || 'Failed to update Fee Scale');
      }
    });
  };


  if (isLoading) {
    return <DashboardLayout pageTitle="Edit Fee Scale"><Loader variant="full" /></DashboardLayout>;
  }

  if (!feeScaleId) {
    return <DashboardLayout pageTitle="Edit Fee Scale">Fee Scale not found</DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Edit Fee Scale">
      <CommonEntityForm
        initialValues={initialValues}
        fields={feeScaleFields}
        onSave={handleUpdate}
        title="Edit Fee Scale"
        saveButtonText="Update Fee Scale"
        successTitle="Success"
        successMessage={successMsg}
      />
    </DashboardLayout>
  );
}
