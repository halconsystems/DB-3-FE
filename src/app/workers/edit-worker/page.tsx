'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { workerFields } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useWorkerById } from '../../../hooks/workers/useWorkerById';
import { useUpdateWorker } from '../../../hooks/workers/useUpdateWorker';

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

const toJobTypeFormValue = (value?: number): string => {
  switch (value) {
    case 0:
      return 'driver';
    case 1:
      return 'cook';
    case 2:
      return 'guard';
    case 3:
      return 'peon';
    case 4:
      return 'gardener';
    default:
      return '';
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

const toCardStatusFormValue = (value?: number): string => {
  if (value === 1) {
    return 'active';
  }
  return 'inactive';
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

const toWorkerCardDeliveryTypeFormValue = (value?: number): string => {
  if (value === 0) {
    return 'owner';
  }
  if (value === 1) {
    return 'self';
  }
  return '';
};

const toPoliceVerification = (value?: string): boolean => {
  return value === 'yes';
};

const toPoliceVerificationFormValue = (value?: boolean): string => {
  return value ? 'yes' : 'no';
};

const toAttachmentString = (value?: File | null, fallback?: string | null): string => {
  if (value) {
    return value.name;
  }
  return fallback || '';
};

export default function EditWorker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workerId, setWorkerId] = useState<string | undefined>();
  const [formError, setFormError] = useState('');
  const updateWorkerMutation = useUpdateWorker();

  const { data, isLoading, isError } = useWorkerById(workerId);

  const initialValues: ProfileFormData | null = data?.data
    ? {
        jobType: toJobTypeFormValue(data.data.jobType),
        fullName: data.data.name,
        fatherOrHusband: data.data.fatherOrHusbandName,
        dob: toDateInputValue(data.data.dateOfBirth),
        cellNumber: data.data.phoneNumber,
        cnic: data.data.cnic,
        policeVerification: toPoliceVerificationFormValue(data.data.policeVerification),
        cardDelivery: toWorkerCardDeliveryTypeFormValue(data.data.workerCardDeliveryType),
        cardNo: data.data.workerCardNumber,
        issueDate: toDateInputValue(data.data.validFrom),
        expiryDate: toDateInputValue(data.data.validTo),
        cardStatus: toCardStatusFormValue(data.data.cardStatus),
      }
    : null;

  useEffect(() => {
    const selected = getTableRow<{ id?: string }>('workers');
    if (selected?.id) {
      setWorkerId(selected.id);
      clearTableRow('workers');
      return;
    }

    const urlId = searchParams?.get('id');
    if (urlId) {
      setWorkerId(urlId);
    }
  }, [searchParams]);

  const handleSave = async (formData: ProfileFormData) => {
    if (!workerId || !data?.data) {
      return;
    }

    setFormError('');

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

    try {
      await updateWorkerMutation.mutateAsync({
        id: workerId,
        ser: data.data.ser,
        jobType: toJobType(formData.jobType),
        name: formData.fullName || data.data.name || '',
        fatherOrHusbandName: formData.fatherOrHusband || data.data.fatherOrHusbandName || '',
        phoneNumber: formData.cellNumber || data.data.phoneNumber || '',
        cnic: formData.cnic || data.data.cnic || '',
        dateOfBirth: toIsoDate(formData.dob),
        cnicFront: toAttachmentString(formData.cnicFront, data.data.cnicFront),
        cnicBack: toAttachmentString(formData.cnicBack, data.data.cnicBack),
        profilePicture: toAttachmentString(formData.profilePicture, data.data.profilePicture),
        policeVerification: toPoliceVerification(formData.policeVerification),
        policeVerificationAttachment: toAttachmentString(formData.policeVerificationFile, data.data.policeVerificationAttachment),
        workerCardNumber: formData.cardNo || data.data.workerCardNumber || '',
        lastModifiedBy,
        cardStatus: toCardStatus(formData.cardStatus),
        workerCardDeliveryType: toWorkerCardDeliveryType(formData.cardDelivery),
        validFrom: toIsoDate(formData.issueDate),
        validTo: toIsoDate(formData.expiryDate),
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update worker';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Edit Worker">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {!workerId && <div style={{ color: 'red', marginBottom: 12 }}>No worker id found for editing.</div>}
        {isError && <div style={{ color: 'red', marginBottom: 12 }}>Failed to load worker details.</div>}
        {(isLoading || initialValues) && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleSave}
            onCancel={() => router.back()}
            saveButtonText="Edit"
            fields={workerFields}
            initialValues={initialValues || undefined}
            loading={isLoading || updateWorkerMutation.isPending}
            showStatusToggle={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
