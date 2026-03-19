'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { visitorFields } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useVisitorById } from '../../../hooks/visitors/useVisitorById';
import { useUpdateVisitor } from '../../../hooks/visitors/useUpdateVisitor';

const toDateInputValue = (value?: string) => {
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

const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
  const firstPart = (vehicleNo ?? '').trim();
  const secondPart = (vehicleNo2 ?? '').trim();

  if (!firstPart && !secondPart) {
    return '';
  }
  return `${firstPart}-${secondPart}`;
};

const toVisitorPassType = (quickPick?: string): number | null => {
  if (quickPick === 'long') {
    return 1;
  }

  if (quickPick === 'day') {
    return 0;
  }

  return null;
};

export default function EditVisitor() {
  const router = useRouter();
  const [visitorId, setVisitorId] = useState<string | undefined>();
  const [formError, setFormError] = useState('');
  const updateVisitorMutation = useUpdateVisitor();

  const { data, isLoading, isError } = useVisitorById(visitorId);

  const initialValues: ProfileFormData | null = data?.data
    ? {
        fullName: data.data.name,
        cnic: data.data.cnic,
        vehicleNo: data.data.vehicleLicensePlate,
        vehicleNo2: String(data.data.vehicleLicenseNo || ''),
        licensePlate: data.data.vehicleLicensePlate,
        qrReference: data.data.qrCode,
        quickPick: data.data.visitorPassType === 1 ? 'long' : 'day',
        fromDate: toDateInputValue(data.data.validFrom),
        toDate: toDateInputValue(data.data.validTo),
        isActive: data.data.isActive,
      }
    : null;

  useEffect(() => {
    const selected = getTableRow<{ id?: string }>('visitors');
    if (selected?.id) {
      setVisitorId(selected.id);
    }
    clearTableRow('visitors');
  }, []);

  const handleSave = async (formData: ProfileFormData) => {
    if (!visitorId || !data?.data) {
      return;
    }

    setFormError('');
    const visitorPassType = toVisitorPassType(formData.quickPick);

    if (visitorPassType === null) {
      const message = 'Please select a Quick Pick option.';
      setFormError(message);
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
      await updateVisitorMutation.mutateAsync({
        id: visitorId,
        name: formData.fullName || '',
        cnic: formData.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(formData.vehicleNo, formData.vehicleNo2),
        vehicleLicenseNo: Number(formData.vehicleNo2 || 0),
        visitorPassType,
        validFrom: toIsoDate(formData.fromDate),
        validTo: toIsoDate(formData.toDate),
        isActive,
        isDeleted: !isActive,
        lastModifiedBy,
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update visitor';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Edit Visitor">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {!visitorId && <div style={{ color: 'red', marginBottom: 12 }}>No visitor id found for editing.</div>}
        {isError && <div style={{ color: 'red', marginBottom: 12 }}>Failed to load visitor details.</div>}
        {(isLoading || initialValues) && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleSave}
            onCancel={() => router.back()}
            saveButtonText='Edit'
            fields={visitorFields}
            initialValues={initialValues || undefined}
            loading={isLoading || updateVisitorMutation.isPending}
            showStatusToggle
          />
        )}
      </div>
    </DashboardLayout>
  );
}


