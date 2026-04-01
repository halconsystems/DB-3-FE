'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { visitorFields } from '../fields';
import { useCreateVisitor } from '../../../hooks/visitors/useCreateVisitor';
import { getAllExternalUsers } from '../../../services/externalUser.service';

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

export default function AddNewVisitor() {
  const { mutateAsync: createVisitor, isPending } = useCreateVisitor();
  const [formError, setFormError] = React.useState('');
  const [lastPayload, setLastPayload] = React.useState<any>(null);

  const handleSave = async (data: ProfileFormData) => {
    setFormError('');
    const visitorPassType = toVisitorPassType(data.quickPick);

    if (visitorPassType === null) {
      const message = 'Please select a Quick Pick option.';
      setFormError(message);
      throw new Error(message);
    }

    let externalUserId = 'system';
    try {
      const users = await getAllExternalUsers();
      const firstValid = users.find(u => u.id);
      if (firstValid && firstValid.id) {
        externalUserId = firstValid.id;
      }
    } catch (e) {
      // fallback to 'system' if API fails
    }

    const payload = {
      name: data.fullName || '',
      cnic: data.cnic || '',
      vehicleLicensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
      vehicleLicenseNo: Number(data.vehicleNo2 || 0),
      visitorPassType,
      validFrom: toIsoDate(data.fromDate),
      validTo: toIsoDate(data.toDate),
      externalUserId,
    };
    setLastPayload(payload);
    try {
      await createVisitor(payload);
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create visitor';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    // <DashboardLayout pageTitle="Add New Visitor">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={visitorFields.filter(f => f.name !== 'description')}
          loading={isPending}
        />
      </div>
    // </DashboardLayout>
  );
}

// Removed getExternalUserId, now using API-based logic


