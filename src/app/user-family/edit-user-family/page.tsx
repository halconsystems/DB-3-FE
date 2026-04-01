'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { userFamilyFields } from '../fields';
import { useUserFamilyById } from '../../../hooks/user-family/useUserFamilyById';

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

export default function EditUserFamily() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const selected = getTableRow<{ id: string }>('userFamily');
    if (selected?.id) setUserId(selected.id);
    return () => clearTableRow('userFamily');
  }, []);

  const { data, isLoading } = useUserFamilyById(userId || '', !!userId);

  const initialValues: ProfileFormData = data
    ? {
        name: data.name || '',
        cellNumber: data.phoneNumber || '',
        cnic: data.cnic || '',
        relation: data.relation?.toString() || '',
        fatherHusbandName: data.fatherOrHusbandName || '',
        residentCardNo: data.residentCardNumber || '',
        dob: data.dateOfBirth || '',
        validFrom: data.validFrom || '',
        validTo: data.validTo || '',
      }
    : {
        name: '',
        cellNumber: '',
        cnic: '',
        relation: '',
        fatherHusbandName: '',
        residentCardNo: '',
        dob: '',
        validFrom: '',
        validTo: '',
      };

  return (
    <DashboardLayout pageTitle="Edit User Family">
      <CommonEntityForm
        title="Edit User Family"
        initialValues={initialValues}
        loading={isLoading}
        fields={userFamilyFields}
        onSave={(data) => console.log('Update User Family:', data)}
        onCancel={() => window.history.back()}
        saveButtonText='Edit'
        showStatusToggle={false}
      />
    </DashboardLayout>
  );
}
