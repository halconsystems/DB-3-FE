'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { userFamilyFields } from '../fields';
import { useUserFamilyById } from '../../../hooks/user-family/useUserFamilyById';
import { useUpdateUserFamily } from '../../../hooks/user-family/useUpdateUserFamily';

interface SelectedUserFamilyRow {
  id: number;
  name: string;
  emailAddress: string;
  cellNumber: string;
  cnic: string;
  relation: string;
  fatherHusbandName: string;
  residentCardNo: string;
  dob: string;
  validFrom: string;
  validTo: string;
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

const relationLabelById: Record<number, string> = {
  0: 'spouse',
  1: 'child',
  2: 'parent',
  3: 'sibling',
};

const relationIdByLabel: Record<string, number> = {
  spouse: 0,
  child: 1,
  parent: 2,
  sibling: 3,
};

const toRelationValue = (value?: number | null) => {
  if (value === null || value === undefined) {
    return '';
  }

  const asString = String(value);
  const relationField = userFamilyFields.find((field) => field.name === 'relation');
  const availableValues = new Set((relationField?.options ?? []).map((option) => option.value));

  if (availableValues.has(asString)) {
    return asString;
  }

  return relationLabelById[value] ?? '';
};

const toRelationNumber = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (value in relationIdByLabel) {
    return relationIdByLabel[value];
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const toCardStatusFlag = (value?: string | number | boolean | null) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return value === '1';
};

const toCardStatusValue = (value?: string | number | boolean | null, fallback?: string | null) => {
  if (value === null || value === undefined) {
    return fallback ?? null;
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (typeof value === 'number') {
    return value === 1 ? '1' : '0';
  }

  if (value === 'active' || value === '1') {
    return '1';
  }

  if (value === 'inactive' || value === '0') {
    return '0';
  }

  return fallback ?? null;
};

export default function EditUserFamily() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');
  const updateUserFamilyMutation = useUpdateUserFamily();

  useEffect(() => {
    const selected = getTableRow<{ id?: string }>('userFamily');
    if (selected?.id) {
      setUserId(selected.id);
      clearTableRow('userFamily');
      setHasCheckedId(true);
      return;
    }

    const urlId = searchParams?.get('id');
    if (urlId) {
      setUserId(urlId);
      setHasCheckedId(true);
      return;
    }
    setHasCheckedId(true);
  }, [searchParams]);

  const { data, isLoading, isError } = useUserFamilyById(userId || '', !!userId);

  const initialValues = useMemo<ProfileFormData | null>(() => {
    if (!data) {
      return null;
    }

    return {
      name: data.name || '',
      cellNumber: data.phoneNumber || '',
      cnic: data.cnic || '',
      relation: toRelationValue(data.relation),
      fatherHusbandName: data.fatherOrHusbandName || '',
      residentCardNo: data.residentCardNumber || '',
      dob: toDateInputValue(data.dateOfBirth),
      validFrom: toDateInputValue(data.validFrom),
      validTo: toDateInputValue(data.validTo),
      status: !!data.isActive,
      cardStatus: toCardStatusFlag(data.cardStatus),
    };
  }, [data]);

  const handleSave = async (formData: ProfileFormData) => {
    if (!userId || !data) {
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

    const relationValue = formData.relation ?? data.relation ?? '';
    const cardStatus = toCardStatusValue(formData.cardStatus, data.cardStatus);

    try {
      await updateUserFamilyMutation.mutateAsync({
        id: userId,
        ser: data.ser,
        name: formData.name || data.name || '',
        residentCardNumber: formData.residentCardNo || data.residentCardNumber || null,
        profilePicture: data.profilePicture || null,
        cnic: formData.cnic || data.cnic || '',
        phoneNumber: formData.cellNumber || data.phoneNumber || '',
        fatherOrHusbandName: formData.fatherHusbandName || data.fatherOrHusbandName || null,
        lastModifiedBy,
        relation: toRelationNumber(relationValue),
        dateOfBirth: toIsoDate(formData.dob || data.dateOfBirth),
        validFrom: toIsoDate(formData.validFrom || data.validFrom),
        validTo: toIsoDate(formData.validTo || data.validTo),
        cardStatus,
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update user family';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Edit User Family">
      {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
      {hasCheckedId && !userId && (
        <div style={{ color: 'red', marginBottom: 12 }}>No user family id found for editing.</div>
      )}
      {isError && <div style={{ color: 'red', marginBottom: 12 }}>Failed to load user family details.</div>}
      {(isLoading || initialValues) && (
        <CommonEntityForm
          title="Edit User Family"
          initialValues={initialValues || undefined}
          loading={isLoading || updateUserFamilyMutation.isPending}
          fields={userFamilyFields}
          onSave={handleSave}
          onCancel={() => router.back()}
          saveButtonText='Edit'
          showStatusToggle={false}
        />
      )}
    </DashboardLayout>
  );
}
