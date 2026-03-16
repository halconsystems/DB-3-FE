'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';

const employeeFields: ProfileField[] = [
  { name: 'fullName', label: 'Employee Name', type: 'text', required: true, placeholder: 'Employee Name here' },
  { name: 'emailAddress', label: 'Email ID', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'cellNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: true, placeholder: '(12345-1234567-1)' },
  { name: 'role', label: 'Assign Role', type: 'text', required: true, placeholder: 'Type here or auto select' },
  { name: 'tempPassword', label: 'Temporary Password', type: 'text', required: true, placeholder: 'Temporary Password here' },
];


const mockEmployeeData: ProfileFormData = {
  fullName: 'John Doe',
  emailAddress: 'john.doe@example.com',
  cellNumber: '0300-1234567',
  cnic: '12345-1234567-1',
  role: 'Manager',
  tempPassword: 'tempPass123',
};

export default function EditEmployee() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('employee');
    setInitialValues({ ...mockEmployeeData, ...(selected ?? {}) });
    clearTableRow('employee');
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Employee">
      <div style={{ margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={employeeFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



