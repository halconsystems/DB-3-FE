'use client';
import React, { useState, useEffect } from 'react';
import { useCreateFeeScale } from '../../../../hooks/fees/useCreateFeeScale';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { feeScaleFields } from '../fields';
import { getEnumMetadata } from '../../../../services/enum.service';

export default function AddFeeScale() {
  const [successMsg, setSuccessMsg] = useState("");
  const createFeeScaleMutation = useCreateFeeScale();
  const [fields, setFields] = useState(feeScaleFields);

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

  useEffect(() => {
    let mounted = true;
    async function fetchEnums() {
      try {
        const [feeRes, userRes, vehicleRes] = await Promise.all([
          getEnumMetadata({ EnumType: 'FeeCategory' }),
          getEnumMetadata({ EnumType: 'UserType' }),
          getEnumMetadata({ EnumType: 'VehicleCategory' }),
        ]);

        // DEBUG: log enum responses to help diagnose empty dropdowns
        // eslint-disable-next-line no-console
        console.log('feeRes', feeRes, 'userRes', userRes, 'vehicleRes', vehicleRes);

        // Try to find the enums by name; if not present, fall back to the first returned enum
        const feeEnum = (feeRes?.data?.enums ?? []).find((e: any) => e.name === 'FeeCategory') || (feeRes?.data?.enums ?? [])[0];
        const userEnum = (userRes?.data?.enums ?? []).find((e: any) => e.name === 'UserType') || (userRes?.data?.enums ?? [])[0];
        const vehicleEnum = (vehicleRes?.data?.enums ?? []).find((e: any) => e.name === 'VehicleCategory') || (vehicleRes?.data?.enums ?? [])[0];

        const normalizeMembers = (members: any[] = []) => members.map((m: any) => {
          // members may have shape { name, value } or { Name, Value } or value could already be string
          const name = m?.name ?? m?.Name ?? String(m);
          const value = m?.value ?? m?.Value ?? m ?? '';
          return { value: String(value), label: String(name) };
        });

        const feeCategoryOptions = normalizeMembers(feeEnum?.members ?? []);
        const userTypeOptions = normalizeMembers(userEnum?.members ?? []);
        const vehicleCategoryOptions = normalizeMembers(vehicleEnum?.members ?? []);

        if (!mounted) return;

        setFields((prev) => prev.map((f) => {
          if (f.name === 'feeCategory') {
            return { ...f, type: 'select', options: [{ value: '', label: 'Select Fee Category' }, ...feeCategoryOptions] };
          }
          if (f.name === 'applicableUserTypes') {
            return { ...f, type: 'select', options: [{ value: '', label: 'Select User Type' }, ...userTypeOptions] };
          }
          if (f.name === 'applicableVehicleCategory') {
            return { ...f, type: 'select', options: [{ value: '', label: 'Select Vehicle Category' }, ...vehicleCategoryOptions] };
          }
          return f;
        }));
      } catch (err) {
        // ignore - leave select as placeholder
      }
    }
    fetchEnums();
    return () => { mounted = false; };
  }, []);

  const handleSave = async (formData: ProfileFormData) => {
    setSuccessMsg("");

    const payload = {
      name: String(formData.name ?? ''),
      feeCategory: String(formData.feeCategory ?? ''),
      amount: Number(formData.amount ?? 0),
      description: String(formData.description ?? ''),
      applicableUserTypes: String(formData.applicableUserTypes ?? ''),
      applicableVehicleCategory: String(formData.applicableVehicleCategory ?? ''),
      isTaxApplicable: !!formData.isTaxApplicable,
      taxPercentage: Number(formData.taxPercentage ?? 0),
      discountPercentage: formData.discountPercentage !== undefined && formData.discountPercentage !== '' ? Number(formData.discountPercentage) : undefined,
      halconPercentage: formData.halconPercentage !== undefined && formData.halconPercentage !== '' ? Number(formData.halconPercentage) : undefined,
      dhaPercentage: formData.dhaPercentage !== undefined && formData.dhaPercentage !== '' ? Number(formData.dhaPercentage) : undefined,
      mdrPercentage: formData.mdrPercentage !== undefined && formData.mdrPercentage !== '' ? Number(formData.mdrPercentage) : undefined,
      fedTaxPercentage: formData.fedTaxPercentage !== undefined && formData.fedTaxPercentage !== '' ? Number(formData.fedTaxPercentage) : undefined,
      discountValidFrom: String(formData.discountValidFrom ?? ''),
      discountValidTo: String(formData.discountValidTo ?? ''),
      currency: String(formData.currency ?? ''),
      createdBy: getCreatedBy(),
    };

    createFeeScaleMutation.mutate(payload as any, {
      onSuccess: () => {
        setSuccessMsg('Fee Scale added successfully!');
        setTimeout(() => {
          setSuccessMsg("");
        }, 2000);
      },
      onError: (error: any) => {
        throw new Error(error?.message || 'Failed to add Fee Scale');
      }
    });
  };

  return (
    <DashboardLayout pageTitle="Add Fee Scale">
      <CommonEntityForm
        fields={fields}
        initialValues={{
          name: '',
          feeCategory: '',
          amount: '',
          description: '',
          applicableUserTypes: '',
          applicableVehicleCategory: '',
          isTaxApplicable: false,
          taxPercentage: '0',
          discountPercentage: '0',
          halconPercentage: '0',
          dhaPercentage: '0',
          mdrPercentage: '0',
          fedTaxPercentage: '0',
          discountValidFrom: '',
          discountValidTo: '',
          currency: '',
          createdBy: getCreatedBy(),
        }}
        onSave={handleSave}
        title="Add New Fee Scale"
        saveButtonText="Add Fee Scale"
        successTitle="Success"
        successMessage={successMsg}
      />
    </DashboardLayout>
  );
}
