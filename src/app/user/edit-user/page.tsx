'use client';
import React, { useEffect, useState } from 'react';
import { useUserById } from '../../../hooks/user/useUserById';
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

export default function EditUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const selected = getTableRow<any>('user');
    if (selected && selected.id) {
      setUserId(String(selected.id));
    }
    clearTableRow('user');
  }, []);

  const { data: userDetails, isLoading } = useUserById(userId || undefined);

  let initialValues: ProfileFormData | undefined = undefined;
  if (userDetails) {
    initialValues = {
      name: userDetails.name || '',
      emailAddress: userDetails.email || '',
      cellNumber: userDetails.phoneNumber || '',
      cnic: userDetails.cnic || '',
      userType: userDetails.userType === 1 ? 'admin' : userDetails.userType === 2 ? 'user' : '',
      rfidCardNo: userDetails.rfidCardNumber || '',
      cardIssueDate: userDetails.cardIssueDate || '',
      cardExpiryDate: userDetails.cardExpiryDate || '',
      cardStatus: userDetails.cardStatus === 1 ? 'active' : 'inactive',
      status: userDetails.isActive ? 'active' : 'inactive',
    };
  }

  const handleUpdate = (data: ProfileFormData) => {
    // ... your update logic here
  };

  return (
    <DashboardLayout pageTitle="Edit User">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          key={userId || 'new'}
          title="Please update details below!"
          onSave={handleUpdate}
          onCancel={() => window.history.back()}
          fields={userFields}
          initialValues={initialValues}
          saveButtonText="Edit"
          loading={isLoading}
          showStatusToggle={false}
        />
      </div>
    </DashboardLayout>
  );
}
