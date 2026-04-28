'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { vehicleFields } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useVehicleById } from '../../../hooks/vehicle/useVehicleById';
import { useUpdateVehicle } from '../../../hooks/vehicle/useUpdateVehicle';

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};

const toIsoDate = (value?: string) => {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

const toTagStatus = (value?: string): number => {
  if (value === 'active') {
    return 1;
  }

  if (value === 'inactive') {
    return 0;
  }

  return 0;
};

const toAttachmentString = (value?: File | null, fallback?: string | null): string => {
  if (value) {
    return value.name;
  }

  return fallback || '';
};

const splitLicense = (license?: string | null) => {
  const normalized = (license || '').trim();
  if (!normalized) {
    return { vehicleNo: '', vehicleNo2: '' };
  }

  const [firstPart, secondPart = ''] = normalized.split('-');
  return { vehicleNo: firstPart || '', vehicleNo2: secondPart || '' };
};

export default function EditVehicle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicleId, setVehicleId] = useState<string | undefined>();
  const updateVehicleMutation = useUpdateVehicle();

  const { data, isLoading, isError } = useVehicleById(vehicleId);

  const initialValues: ProfileFormData | null = data?.data
    ? {
        vehicleNo: splitLicense(data.data.license).vehicleNo,
        vehicleNo2: String(data.data.licenseNo ?? ''),
        licensePlate: data.data.licenseNo ? `${data.data.license || ''}-${data.data.licenseNo}` : data.data.license || '',
        make: data.data.make || '',
        model: data.data.model || '',
        color: data.data.color || '',
        year: data.data.year || '',
        eTagId: data.data.eTagId || '',
        issueDate: toDateInputValue(data.data.validFrom),
        expiryDate: toDateInputValue(data.data.validTo),
        tagStatus: data.data.tagStatus === 1 ? 'active' : 'inactive',
        isActive: data.data.isActive,
      }
    : null;

  useEffect(() => {
    const selected = getTableRow<{ id?: string }>('vehicle');
    if (selected?.id) {
      setVehicleId(selected.id);
      clearTableRow('vehicle');
      return;
    }

    const urlId = searchParams?.get('id');
    if (urlId) {
      setVehicleId(urlId);
    }
  }, [searchParams]);

  const handleUpdate = async (formData: ProfileFormData) => {
    if (!vehicleId || !data?.data) {
      throw new Error('Vehicle ID or details not found');
    }

    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let lastModifiedBy = 'system';
    let externalUserId = data.data.externalUserId || 'system';

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        lastModifiedBy = user?.fullName || user?.name || user?.email || 'system';
        externalUserId = user?.id || user?.userId || data.data.externalUserId || 'system';
      } catch {
        lastModifiedBy = 'system';
        externalUserId = data.data.externalUserId || 'system';
      }
    }

    try {
      await updateVehicleMutation.mutateAsync({
        id: vehicleId,
        ser: data.data.ser,
        licenseNo: Number(formData.vehicleNo2 || data.data.licenseNo || 0),
        license: formData.vehicleNo || data.data.license || '',
        year: formData.year || data.data.year || '',
        color: formData.color || data.data.color || '',
        make: formData.make || data.data.make || '',
        model: formData.model || data.data.model || '',
        attachment: toAttachmentString(formData.attachment, data.data.attachment),
        eTagId: formData.eTagId || data.data.eTagId || '',
        validFrom: toIsoDate(formData.issueDate),
        validTo: toIsoDate(formData.expiryDate),
        tagStatus: toTagStatus(formData.tagStatus),
        lastModifiedBy,
        externalUserId,
        isActive: typeof formData.isActive === 'boolean' ? formData.isActive : data.data.isActive,
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update vehicle';
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Edit Vehicle">
      <div style={{ margin: '0 auto' }}>
        {!vehicleId && <div style={{ color: 'red', marginBottom: 12 }}>No vehicle id found for editing.</div>}
        {isError && <div style={{ color: 'red', marginBottom: 12 }}>Failed to load vehicle details.</div>}
        {(isLoading || initialValues) && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => router.back()}
            saveButtonText='Edit'
            fields={vehicleFields}
            initialValues={initialValues || undefined}
            loading={isLoading || updateVehicleMutation.isPending}
            showStatusToggle
          />
        )}
      </div>
    </DashboardLayout>
  );
}



