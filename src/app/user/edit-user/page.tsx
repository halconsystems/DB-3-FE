'use client';
import React, { useEffect, useState } from 'react';
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
  const [selectedRow, setSelectedRow] = useState<SelectedUserRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<ProfileFormData>({
    name: '',
    emailAddress: '',
    cellNumber: '',
    cnic: '',
    userType: '',
    rfidCardNo: '',
    cardIssueDate: '',
    cardExpiryDate: '',
    cardStatus: 'active',
    status: 'active',
  });

  useEffect(() => {
    const selected = getTableRow<SelectedUserRow>('user');
    if (selected) {
      setSelectedRow(selected);
      setInitialValues({
        name: selected.name || '',
        emailAddress: selected.emailAddress || '',
        cellNumber: selected.cellNumber || '',
        cnic: selected.cnic || '',
        userType: selected.userType?.toLowerCase() || '',
        rfidCardNo: selected.rfidCardNo || '',
        cardIssueDate: selected.cardIssueDate || '',
        cardExpiryDate: selected.cardExpiryDate || '',
        cardStatus: selected.cardStatus?.toLowerCase() || 'active',
        status: selected.status?.toLowerCase() || 'active',
      });
    }
    setIsLoading(false);
    return () => {
      clearTableRow('user');
    };
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    const body = {
      Name: data.name || '',
      Email: data.emailAddress || '',
      Phone: data.cellNumber || '',
      CNIC: data.cnic || '',
      UserType: data.userType || '',
      RFIDCardNo: data.rfidCardNo || '',
      CardIssueDate: data.cardIssueDate || null,
      CardExpiryDate: data.cardExpiryDate || null,
      CardStatus: data.cardStatus || '',
      Status: data.status || '',
    };
    console.log('Update User:', body);
    // TODO: Call API to update user
    window.history.back();
  };

  return (
    <DashboardLayout pageTitle="Edit User">
      <div style={{ margin: '0 auto', maxWidth: '1000px' }}>
        {!isLoading && (
          <CommonEntityForm
            key={selectedRow?.id || 'new'}
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            fields={userFields}
            initialValues={initialValues}
            saveButtonText='Edit'
            loading={false}
            showStatusToggle={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
