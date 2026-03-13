'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

const employeeFields: ProfileField[] = [
  { name: 'fullName', label: 'Employee Name', type: 'text', required: true, placeholder: 'Employee Name here' },
  { name: 'serviceNo', label: 'Service No.', type: 'text', required: true, placeholder: 'Service here' },
  { name: 'emailAddress', label: 'Email ID', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'cellNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: true, placeholder: '(12345-1234567-1)' },
  { name: 'designation', label: 'Designation', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'nextOfKin', label: 'Next of Kin', type: 'text', required: true, placeholder: 'Name here' },
  { name: 'nextOfKinNumber', label: 'Next of Kin Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'role', label: 'Assign Role', type: 'text', required: true, placeholder: 'Type here or auto select' },
  { name: 'tempPassword', label: 'Temporary Password', type: 'text', required: true, placeholder: 'Temporary Password here' },
];


const mockEmployeeData: ProfileFormData = {
  fullName: 'John Doe',
  serviceNo: 'EMP-001',
  emailAddress: 'john.doe@example.com',
  cellNumber: '0300-1234567',
  cnic: '12345-1234567-1',
  designation: '',
  nextOfKin: 'Jane Doe',
  nextOfKinNumber: '0300-7654321',
  role: 'Manager',
  tempPassword: 'tempPass123',
};

export default function EditEmployee() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    
    setTimeout(() => {
      setInitialValues(mockEmployeeData);
    }, 500);
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Employee">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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



