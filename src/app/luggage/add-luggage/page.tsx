'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { luggageFields } from '../fields';

import { useCreateLuggage } from '../../../hooks/luggage/useCreateLuggage';
import { getAllExternalUsers } from '../../../services/user.service';

const toIsoDate = (value?: string) => {
  if (!value) return new Date().toISOString();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();

  return date.toISOString();
};

const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
  const firstPart = (vehicleNo ?? '').trim();
  const secondPart = (vehicleNo2 ?? '').trim();

  if (!firstPart && !secondPart) return '';
  return `${firstPart}-${secondPart}`;
};

const toLuggagePassType = (quickPick?: string): number | null => {
  if (quickPick === 'longStay') return 1;
  if (quickPick === 'dayPass') return 0;
  return null;
};

export default function AddNewLuggage() {
  const { mutateAsync: createLuggage, isPending } = useCreateLuggage();

  const [formError, setFormError] = React.useState('');
  // Removed modal state

  const handleSave = async (data: ProfileFormData) => {
    setFormError('');

    const luggagePassType = toLuggagePassType(data.quickPick);

    if (luggagePassType === null) {
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

    const finalPayload = {
      name: data.fullName || '',
      cnic: data.cnic || '',
      vehicleLicensePlate: toVehicleLicensePlate(
        data.vehicleNo,
        data.vehicleNo2
      ),
      vehicleLicenseNo: Number(data.vehicleNo2 || 0),
      description: data.description || '',
      luggagePassType,
      validFrom: toIsoDate(data.fromDate),
      validTo: toIsoDate(data.toDate),
      externalUserId,
    };

    try {
      await createLuggage(finalPayload);
    } catch (err: any) {
      const message =
        err?.response?.data?.errorMessage ||
        err?.message ||
        'Failed to create luggage';
      setFormError(message);
      throw new Error(message);
    }
  };

  // Removed handleConfirm and modal logic

  return (
    <DashboardLayout pageTitle="Add New Luggage">
      <div style={{ margin: '0 auto' }}>
        {formError && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            {formError}
          </div>
        )}

        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={luggageFields}
          loading={isPending}
          saveButtonText="Add"
          cancelButtonText="Cancel"
        />
      </div>

      {/* Modal removed */}
    </DashboardLayout>
  );
}

/* ✅ Simple inline styles */
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 8,
  width: '500px',
  maxHeight: '80vh',
  overflow: 'auto',
};

const preStyle: React.CSSProperties = {
  background: '#f4f4f4',
  padding: 10,
  borderRadius: 4,
  fontSize: 12,
};

const btn: React.CSSProperties = {
  padding: '8px 12px',
  marginRight: 10,
  cursor: 'pointer',
};