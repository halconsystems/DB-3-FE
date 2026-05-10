'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { workerFields } from '../fields';
import { useCreateWorker } from '../../../hooks/workers/useCreateWorker';
import { EXTERNAL_USERS_SELECT_PAGE_SIZE, getAllExternalUsers } from 'services/user.service';
import { workerCardDeliveryToApi } from '../../../lib/workerCardDelivery';
import { stripCardNumberFormatting } from '../../../lib/formatCardNumber';

// Return YYYY-MM-DD as-is without conversion
const toIsoDate = (value?: string) => {
  if (!value) {
    return '';
  }

  // Simply extract the date part (YYYY-MM-DD) from the string
  const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return dateMatch ? dateMatch[0] : '';
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

const toCardStatus = (value?: string | number | boolean): number => {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'number') {
    return value === 1 ? 1 : 0;
  }

  if (value === 'active' || value === '1') {
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

  const handleSave = async (data: ProfileFormData) => {

  let externalUserId = 'system';
  let createdBy = 'system';
     try {
       const { items: users } = await getAllExternalUsers({
         pageNumber: 1,
         pageSize: EXTERNAL_USERS_SELECT_PAGE_SIZE,
       });
       const firstValid = users.find(u => u.id);
       if (firstValid && firstValid.id) {
         externalUserId = firstValid.id;
         createdBy = firstValid.name;
       }
     } catch (e) {
       // fallback to 'system' if API fails
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
        workerCardNumber: stripCardNumberFormatting(data.cardNo || ''),
        cardStatus: toCardStatus(data.cardStatus),
        workerCardDeliveryType: workerCardDeliveryToApi(data.cardDelivery),
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        createdBy,
        externalUserId,
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create worker';
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Worker">
      <div style={{ margin: '0 auto' }}>
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


