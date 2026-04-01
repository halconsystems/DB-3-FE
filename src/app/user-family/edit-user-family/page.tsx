'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { userFamilyFields } from '../fields';

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
  const [selectedRow, setSelectedRow] = useState<SelectedUserFamilyRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<ProfileFormData>({
    name: '',
    emailAddress: '',
    cellNumber: '',
    cnic: '',
    relation: '',
    fatherHusbandName: '',
    residentCardNo: '',
    dob: '',
    validFrom: '',
    validTo: '',
  });

  useEffect(() => {
    const selected = getTableRow<SelectedUserFamilyRow>('userFamily');
    if (selected) {
      setSelectedRow(selected);
      setInitialValues({
        name: selected.name || '',
        emailAddress: selected.emailAddress || '',
        cellNumber: selected.cellNumber || '',
        cnic: selected.cnic || '',
        relation: selected.relation?.toLowerCase() || '',
        fatherHusbandName: selected.fatherHusbandName || '',
        residentCardNo: selected.residentCardNo || '',
        dob: selected.dob || '',
        validFrom: selected.validFrom || '',
        validTo: selected.validTo || '',
      });
    }
    setIsLoading(false);
    return () => {
      clearTableRow('userFamily');
    };
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    const body = {
      Name: data.name || '',
      Email: data.emailAddress || '',
      Phone: data.cellNumber || '',
      CNIC: data.cnic || '',
      Relation: data.relation || '',
      FatherHusbandName: data.fatherHusbandName || '',
      ResidentCardNo: data.residentCardNo || '',
      DOB: data.dob || null,
      ValidFrom: data.validFrom || null,
      ValidTo: data.validTo || null,
    };
    console.log('Update User Family:', body);
    // TODO: Call API to update user family
    window.history.back();
  };

  return (
    <DashboardLayout pageTitle="Edit User Family">
          <CommonEntityForm
            key={selectedRow?.id || 'new'}
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            fields={userFamilyFields}
            initialValues={initialValues}
            saveButtonText='Edit'
            loading={isLoading}
            showStatusToggle={false}
          />
    </DashboardLayout>
  );
}
