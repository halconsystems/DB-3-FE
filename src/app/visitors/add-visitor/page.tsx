'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { visitorFields } from '../fields';
import { useCreateVisitor } from '../../../hooks/visitors/useCreateVisitor';

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

    const externalUserId = getExternalUserId();
    const payload = {
      name: data.fullName || '',
      cnic: data.cnic || '',
      vehicleLicensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
      vehicleLicenseNo: Number(data.vehicleNo2 || 0),
      description: data.description || '',
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

  // Show live payload preview (updates after form submit)
  return (
    <DashboardLayout pageTitle="Add New Visitor">
      <div style={{ margin: '0 auto' }}>
        <div style={{ background: '#f4f4f4', border: '1px solid #ddd', borderRadius: 6, padding: 16, marginBottom: 20, fontFamily: 'monospace', fontSize: 13 }}>
          <strong>Last payload sent to Create Visitor API:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: 8 }}>
{lastPayload ? JSON.stringify(lastPayload, null, 2) : 'Submit the form to see the exact payload.'}
          </pre>
          <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
            <b>externalUserId</b> is dynamically set from the user's <code>id</code>, <code>userId</code>, or <code>email</code> in <code>localStorage.getItem('user')</code>, or <code>system</code> if not available.
          </div>
        </div>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={visitorFields}
          loading={isPending}
        />
      </div>
    </DashboardLayout>
  );
}

function getExternalUserId() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let externalUserId = 'system';
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      externalUserId = user?.id || user?.userId || user?.email || 'system';
    } catch {
      externalUserId = 'system';
    }
  }

  return externalUserId;
}


