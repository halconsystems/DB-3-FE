
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { workerFields } from '../fields';
import { useCreateWorker } from '../../../hooks/workers/useCreateWorker';

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

const toJobType = (value?: string): number => {
  switch (value) {
    case 'driver':
      return 0;
    case 'cook':
      return 1;
    case 'guard':
      return 2;
    case 'peon':
      return 3;
    case 'gardener':
      return 4;
    default:
      return 0;
  }
};

const toCardStatus = (value?: string): number => {
  if (value === 'active') {
    return 1;
  }
  if (value === 'inactive') {
    return 0;
  }
  return 0;
};

const toWorkerCardDeliveryType = (value?: string): number => {
  if (value === 'owner') {
    return 0;
  }
  if (value === 'self') {
    return 1;
  }
  return 0;
};

const toPoliceVerification = (value?: string): boolean => {
  return value === 'yes';
};

const toAttachmentString = (value?: File | null): string => {
  if (!value) {
    return '';
  }
  return value.name;
};

export default function AddNewWorker() {
  const { mutateAsync: createWorker, isPending } = useCreateWorker();
  const [formError, setFormError] = React.useState('');

  const handleSave = async (data: ProfileFormData) => {
    setFormError('');

    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let createdBy = 'system';
    let externalUserId = 'system';

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        createdBy = user?.fullName || user?.name || user?.email || 'system';
        externalUserId = user?.id || user?.userId || user?.email || 'system';
      } catch {
        createdBy = 'system';
        externalUserId = 'system';
      }
    }

    try {
      await createWorker({
        ser: 0,
        jobType: toJobType(data.jobType),
        name: data.fullName || '',
        fatherOrHusbandName: data.fatherOrHusband || '',
        phoneNumber: data.cellNumber || '',
        cnic: data.cnic || '',
        dateOfBirth: toIsoDate(data.dob),
        cnicFront: toAttachmentString(data.cnicFront),
        cnicBack: toAttachmentString(data.cnicBack),
        profilePicture: toAttachmentString(data.profilePicture),
        policeVerification: toPoliceVerification(data.policeVerification),
        policeVerificationAttachment: toAttachmentString(data.policeVerificationFile),
        workerCardNumber: data.cardNo || '',
        cardStatus: toCardStatus(data.cardStatus),
        workerCardDeliveryType: toWorkerCardDeliveryType(data.cardDelivery),
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        createdBy,
        externalUserId,
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create worker';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Worker">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={workerFields}
          loading={isPending}
        />
      </div>
    </DashboardLayout>
  );
}


