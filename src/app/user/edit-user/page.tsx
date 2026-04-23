'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserById } from '../../../hooks/user/useUserById';
import { useUpdateUser } from '../../../hooks/user/useUpdateUser';
import { useEnumMetadata } from '../../../hooks/metadata/useEnumMetadata';
import type { EnumMetadata } from '../../../services/metadata.service';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { userFields } from '../fields';

interface SelectedUserRow {
  id: number;
  name: string;
  emailAddress: string;
  cellNumber: string;
  cnic: string;
  userType: string;
  rfidCardNo: string;
  cardIssueDate?: string;
  cardExpiryDate?: string;
  cardStatus: 'Active' | 'Inactive';
  status: 'Active' | 'Inactive';
}

// Extract YYYY-MM-DD from any date format without timezone conversion
const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return '';
  }

  // Simply extract the date part (YYYY-MM-DD) from the string
  const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return dateMatch ? dateMatch[0] : '';
};

// Return YYYY-MM-DD as-is without conversion
const toIsoDate = (value?: string | null) => {
  if (!value) {
    return '';
  }

  // Simply extract the date part (YYYY-MM-DD) from the string
  const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return dateMatch ? dateMatch[0] : '';
};

const toUserTypeValue = (value?: string | number | null, enumMetadata?: EnumMetadata | null) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const asString = String(value).trim();

  if (!enumMetadata?.members?.length) {
    return asString;
  }

  const matchedMember = enumMetadata.members.find(
    (member) => String(member.value) === asString || member.name.toLowerCase() === asString.toLowerCase()
  );

  return matchedMember ? String(matchedMember.value) : asString;
};

const toUserTypeApiValue = (value?: string | number | null, fallback?: string | number | null, enumMetadata?: EnumMetadata | null) => {
  const resolved = value ?? fallback;
  if (resolved === null || resolved === undefined || resolved === '') {
    return 0;
  }

  const asString = String(resolved).trim();
  const matchedMember = enumMetadata?.members?.find(
    (member) => String(member.value) === asString || member.name.toLowerCase() === asString.toLowerCase()
  );

  if (matchedMember) {
    return matchedMember.value;
  }

  const numeric = Number(asString);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const toCardStatusValue = (value?: string | number | boolean | null) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return String(value).trim();
};

const toCardStatusApiValue = (value?: string | number | boolean | null, fallback?: string | number | boolean | null) => {
  const resolved = value ?? fallback;
  if (resolved === null || resolved === undefined || resolved === '') {
    return 0;
  }

  const numeric = Number(resolved);
  return Number.isNaN(numeric) ? 0 : numeric;
};

export default function EditUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');
  const updateUserMutation = useUpdateUser();
  const { data: userTypesEnum, isLoading: isUserTypesEnumLoading } = useEnumMetadata('UserType');
  const { data: cardStatusEnum, isLoading: isCardStatusEnumLoading } = useEnumMetadata('CardStatus');

  useEffect(() => {
    const selected = getTableRow<any>('user');
    if (selected && selected.id) {
      setUserId(String(selected.id));
      clearTableRow('user');
      setHasCheckedId(true);
      return;
    }

    const urlId = searchParams?.get('id');
    if (urlId) {
      setUserId(urlId);
      setHasCheckedId(true);
      return;
    }
    clearTableRow('user');
    setHasCheckedId(true);
  }, [searchParams]);

  const { data: userDetails, isLoading } = useUserById(userId || undefined);

  // Build dynamic userType options from enum
  const dynamicUserFields = useMemo(() => {
    const userTypeOptions = [{ value: '', label: 'Select User Type' }];
    const cardStatusOptions = [{ value: '', label: 'Select Card Status' }];
    
    if (userTypesEnum?.members) {
      userTypesEnum.members.forEach((member) => {
        userTypeOptions.push({
          value: String(member.value),
          label: member.name,
        });
      });
    }

    if (cardStatusEnum?.members) {
      cardStatusEnum.members.forEach((member) => {
        cardStatusOptions.push({
          value: String(member.value),
          label: member.name,
        });
      });
    }

    return userFields.map((field) => {
      if (field.name === 'userType') {
        return {
          ...field,
          options: userTypeOptions,
        };
      }
      if (field.name === 'cardStatus') {
        return {
          ...field,
          options: cardStatusOptions,
        };
      }
      return field;
    });
  }, [cardStatusEnum, userTypesEnum]);

  const initialValues = useMemo<ProfileFormData | null>(() => {
    if (!userDetails) {
      return null;
    }

    return {
      name: userDetails.name || '',
      emailAddress: userDetails.email || '',
      cellNumber: userDetails.phoneNumber || '',
      cnic: userDetails.cnic || '',
      userType: toUserTypeValue(userDetails.userType, userTypesEnum),
      rfidCardNo: userDetails.rfidCardNumber || '',
      cardIssueDate: toDateInputValue(userDetails.cardIssueDate),
      cardExpiryDate: toDateInputValue(userDetails.cardExpiryDate),
      cardStatus: toCardStatusValue(userDetails.cardStatus),
      status: !!userDetails.isActive,
    };
  }, [userDetails, userTypesEnum]);

  const handleUpdate = async (formData: ProfileFormData) => {
    if (!userId || !userDetails) {
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
      await updateUserMutation.mutateAsync({
        id: userId,
        name: formData.name || userDetails.name || '',
        email: formData.emailAddress || userDetails.email || '',
        phoneNumber: formData.cellNumber || userDetails.phoneNumber || '',
        cnic: formData.cnic || userDetails.cnic || '',
        userType: toUserTypeApiValue(formData.userType, userDetails.userType, userTypesEnum),
        rfidCardNumber: formData.rfidCardNo || userDetails.rfidCardNumber || '',
        lastModifiedBy,
        cardIssueDate: toIsoDate(formData.cardIssueDate || userDetails.cardIssueDate),
        cardExpiryDate: toIsoDate(formData.cardExpiryDate || userDetails.cardExpiryDate),
        cardStatus: toCardStatusApiValue(formData.cardStatus, userDetails.cardStatus),
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update user';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Edit User">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {hasCheckedId && !userId && <div style={{ color: 'red', marginBottom: 12 }}>No user id found for editing.</div>}
        {(isLoading || initialValues) && (
          <CommonEntityForm
            key={userId || 'new'}
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => router.back()}
            fields={dynamicUserFields}
            initialValues={initialValues || undefined}
            saveButtonText="Edit"
            loading={isLoading || isUserTypesEnumLoading || isCardStatusEnumLoading || updateUserMutation.isPending}
            showStatusToggle={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
