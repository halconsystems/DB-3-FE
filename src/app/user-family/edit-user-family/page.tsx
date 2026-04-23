'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { userFamilyFields } from '../fields';
import { useUserFamilyById } from '../../../hooks/user-family/useUserFamilyById';
import { useUpdateUserFamily } from '../../../hooks/user-family/useUpdateUserFamily';
import { useEnumMetadata } from '../../../hooks/metadata/useEnumMetadata';

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

const toRelationValue = (value?: string | number | null, availableValues: Set<string> = new Set()) => {
  if (value === null || value === undefined) {
    return '';
  }

  const asString = String(value);

  if (availableValues.size === 0 || availableValues.has(asString)) {
    return asString;
  }

  return asString;
};

const toRelationApiValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  return String(value);
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

export default function EditUserFamily() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');
  const updateUserFamilyMutation = useUpdateUserFamily();
  const { data: relationEnum, isLoading: isRelationEnumLoading } = useEnumMetadata('RelationUserFamily');
  const { data: cardStatusEnum, isLoading: isCardStatusEnumLoading } = useEnumMetadata('CardStatus');

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

  const dynamicUserFamilyFields = useMemo(() => {
    const relationOptions = [{ value: '', label: 'Select Relation' }];
    const cardStatusOptions = [{ value: '', label: 'Select Card Status' }];

    if (relationEnum?.members) {
      relationEnum.members.forEach((member) => {
        relationOptions.push({
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

    return userFamilyFields.map((field) => {
      if (field.name === 'relation') {
        return {
          ...field,
          options: relationOptions,
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
  }, [cardStatusEnum, relationEnum]);

  const initialValues = useMemo<ProfileFormData | null>(() => {
    if (!data) {
      return null;
    }

    const relationField = dynamicUserFamilyFields.find((field) => field.name === 'relation');
    const availableRelationValues = new Set((relationField?.options ?? []).map((option) => option.value));

    return {
      name: data.name || '',
      cellNumber: data.phoneNumber || '',
      cnic: data.cnic || '',
      relation: toRelationValue(data.relation, availableRelationValues),
      fatherHusbandName: data.fatherOrHusbandName || '',
      residentCardNo: data.residentCardNumber || '',
      dob: toDateInputValue(data.dateOfBirth),
      validFrom: toDateInputValue(data.validFrom),
      validTo: toDateInputValue(data.validTo),
      status: !!data.isActive,
      cardStatus: toCardStatusValue(data.cardStatus),
    };
  }, [data, dynamicUserFamilyFields]);

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
    const cardStatus = toCardStatusApiValue(formData.cardStatus, data.cardStatus);

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
        relation: toRelationApiValue(relationValue),
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
          loading={isLoading || isRelationEnumLoading || isCardStatusEnumLoading || updateUserFamilyMutation.isPending}
          fields={dynamicUserFamilyFields}
          onSave={handleSave}
          onCancel={() => router.back()}
          saveButtonText='Edit'
          showStatusToggle={false}
        />
      )}
    </DashboardLayout>
  );
}
