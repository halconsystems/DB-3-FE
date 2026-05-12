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

  const getCreatedBy = () => {
    if (typeof window === 'undefined') return 'system';
    const userRaw = localStorage.getItem('user');
    if (!userRaw) return 'system';
    try {
      const user = JSON.parse(userRaw);
      return user?.fullName || user?.name || user?.email || 'system';
    } catch {
      return 'system';
    }
  };

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
        discountPercentage: feeScale.discountPercentage !== undefined && feeScale.discountPercentage !== null ? String(feeScale.discountPercentage) : "",
        halconPercentage: feeScale.halconPercentage !== undefined && feeScale.halconPercentage !== null ? String(feeScale.halconPercentage) : "",
        dhaPercentage: feeScale.dhaPercentage !== undefined && feeScale.dhaPercentage !== null ? String(feeScale.dhaPercentage) : "",
        mdrPercentage: feeScale.mdrPercentage !== undefined && feeScale.mdrPercentage !== null ? String(feeScale.mdrPercentage) : "",
        fedTaxPercentage: feeScale.fedTaxPercentage !== undefined && feeScale.fedTaxPercentage !== null ? String(feeScale.fedTaxPercentage) : "",
        discountValidFrom: feeScale.discountValidFrom ?? "",
        discountValidTo: feeScale.discountValidTo ?? "",
        currency: feeScale.currency ?? "",
        status: !!feeScale.isActive,
        createdBy: feeScale.createdBy ?? getCreatedBy(),
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
      discountPercentage: formData.discountPercentage !== undefined && formData.discountPercentage !== '' ? Number(formData.discountPercentage) : undefined,
      halconPercentage: formData.halconPercentage !== undefined && formData.halconPercentage !== '' ? Number(formData.halconPercentage) : undefined,
      dhaPercentage: formData.dhaPercentage !== undefined && formData.dhaPercentage !== '' ? Number(formData.dhaPercentage) : undefined,
      mdrPercentage: formData.mdrPercentage !== undefined && formData.mdrPercentage !== '' ? Number(formData.mdrPercentage) : undefined,
      fedTaxPercentage: formData.fedTaxPercentage !== undefined && formData.fedTaxPercentage !== '' ? Number(formData.fedTaxPercentage) : undefined,
      discountValidFrom: String(formData.discountValidFrom ?? ""),
      discountValidTo: String(formData.discountValidTo ?? ""),
      currency: String(formData.currency ?? ""),
      createdBy: String(formData.createdBy ?? getCreatedBy()),
      lastModifiedBy: String(formData.lastModifiedBy ?? getCreatedBy()),
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
