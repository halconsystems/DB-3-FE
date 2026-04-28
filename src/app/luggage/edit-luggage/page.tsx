'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { luggageFields } from '../fields';
import { useLuggageById } from '../../../hooks/luggage/useLuggageById';
import { useUpdateLuggage } from '../../../hooks/luggage/useUpdateLuggage';

// Extract YYYY-MM-DD from any date format without timezone conversion
const toDateInputValue = (value?: string) => {
  if (!value) {
    return '';
  }

  // Simply extract the date part (YYYY-MM-DD) from the string
  const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return dateMatch ? dateMatch[0] : '';
};

// Return YYYY-MM-DD as-is without conversion
const toIsoDate = (value?: string) => {
  if (!value) {
    return '';
  }

  // Simply extract the date part (YYYY-MM-DD) from the string
  const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return dateMatch ? dateMatch[0] : '';
};

const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
  const firstPart = (vehicleNo ?? '').trim();
  const secondPart = (vehicleNo2 ?? '').trim();

  if (!firstPart && !secondPart) {
    return '';
  }
  return `${firstPart}-${secondPart}`;
};

const toLuggagePassType = (quickPick?: string): number | null => {
  if (quickPick === 'LongStay') {
    return 2;
  }

  if (quickPick === 'DayPass') {
    return 1;
  }

  return null;
};


export default function EditLuggage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [luggageId, setLuggageId] = useState<string | undefined>();
  const updateLuggageMutation = useUpdateLuggage();

  const { data, isLoading, isError } = useLuggageById(luggageId);

  const initialValues: ProfileFormData | null = data?.data
    ? {
        fullName: data.data.name,
        cnic: data.data.cnic,
        vehicleNo: data.data.vehicleLicensePlate?.split('-')[0] || '',
        vehicleNo2: data.data.vehicleLicensePlate?.split('-')[1] || '',
        licensePlate: data.data.vehicleLicensePlate,
        qrReference: data.data.qrCode,
        status: data.data.isActive ? 'active' : 'inactive',
        quickPick: data.data.luggagePassType === 'LongDay' ? 'LongStay' : 'DayPass',
        fromDate: toDateInputValue(data.data.validFrom),
        toDate: toDateInputValue(data.data.validTo),
        description: data.data.description,
        isActive: data.data.isActive,
      }
    : null;

  useEffect(() => {
    const selected = getTableRow<{ id?: string }>('luggage');
    if (selected?.id) {
      setLuggageId(selected.id);
      clearTableRow('luggage');
      return;
    }
    // Fallback: try to get id from URL query string
    const urlId = searchParams?.get('id');
    if (urlId) {
      setLuggageId(urlId);
    }
  }, [searchParams]);

  const handleSave = async (formData: ProfileFormData) => {
    if (!luggageId || !data?.data) {
      return;
    }

    const luggagePassType = toLuggagePassType(formData.quickPick);

    if (luggagePassType === null) {
      const message = 'Please select a Quick Pick option.';
      throw new Error(message);
    }

    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let lastModifiedBy = 'system';
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        lastModifiedBy = user?.fullName || user?.name || user?.email || 'system';
      } catch {
        lastModifiedBy = 'system';
      }
    }

    const isActive = formData.isActive ?? data.data.isActive;

    try {
      await updateLuggageMutation.mutateAsync({
        id: luggageId,
        name: formData.fullName || '',
        cnic: formData.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(formData.vehicleNo, formData.vehicleNo2),
        vehicleLicenseNo: Number(formData.vehicleNo2 || 0),
        description: formData.description || data.data.description || '',
        luggagePassType: luggagePassType || 1,
        validFrom: toIsoDate(formData.fromDate),
        validTo: toIsoDate(formData.toDate),
        lastModifiedBy,
        isActive,
        isDeleted: !isActive,
        externalUserId: data.data.externalUserId || '',
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update luggage';
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Edit Luggage">
      <div style={{ margin: '0 auto' }}>
        {!luggageId && <div style={{ color: 'red', marginBottom: 12 }}>No luggage id found for editing.</div>}
        {isError && <div style={{ color: 'red', marginBottom: 12 }}>Failed to load luggage details.</div>}
        {(isLoading || initialValues) && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleSave}
            onCancel={() => router.back()}
            fields={luggageFields}
            initialValues={initialValues || undefined}
            loading={isLoading || updateLuggageMutation.isPending}
            showStatusToggle
            saveButtonText='Edit'
            cancelButtonText="Cancel"
          />
        )}
      </div>
    </DashboardLayout>
  );
}


