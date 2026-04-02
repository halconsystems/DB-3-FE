'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserById } from '../../../hooks/user/useUserById';
import { useUpdateUser } from '../../../hooks/user/useUpdateUser';
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

const toIsoDate = (value?: string | null) => {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

const toUserTypeValue = (value?: string | null) => {
  if (value === 'admin') {
    return 1;
  }

  if (value === 'user') {
    return 2;
  }

  return 2;
};

const toCardStatusValue = (value?: string | number | boolean | null) => {
  if (value === null || value === undefined) {
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

export default function EditUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');
  const updateUserMutation = useUpdateUser();

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

  const initialValues = useMemo<ProfileFormData | null>(() => {
    if (!userDetails) {
      return null;
    }

    return {
      name: userDetails.name || '',
      emailAddress: userDetails.email || '',
      cellNumber: userDetails.phoneNumber || '',
      cnic: userDetails.cnic || '',
      userType: userDetails.userType === 1 ? 'admin' : userDetails.userType === 2 ? 'user' : '',
      rfidCardNo: userDetails.rfidCardNumber || '',
      cardIssueDate: toDateInputValue(userDetails.cardIssueDate),
      cardExpiryDate: toDateInputValue(userDetails.cardExpiryDate),
      cardStatus: userDetails.cardStatus === 1,
      status: !!userDetails.isActive,
    };
  }, [userDetails]);

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
        userType: toUserTypeValue(formData.userType),
        rfidCardNumber: formData.rfidCardNo || userDetails.rfidCardNumber || '',
        lastModifiedBy,
        cardIssueDate: toIsoDate(formData.cardIssueDate || userDetails.cardIssueDate),
        cardExpiryDate: toIsoDate(formData.cardExpiryDate || userDetails.cardExpiryDate),
        cardStatus: toCardStatusValue(formData.cardStatus),
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
            fields={userFields}
            initialValues={initialValues || undefined}
            saveButtonText="Edit"
            loading={isLoading || updateUserMutation.isPending}
            showStatusToggle={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
