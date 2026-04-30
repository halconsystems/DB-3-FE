'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import Loader from '../../../../components/ui/loader';
import { useEmployeeById } from '../../../../hooks/employee/useEmployeeById';
import { useUpdateEmployee } from '../../../../hooks/employee/useUpdateEmployee';
import { getRoles } from '../../../../services/role.service';

const baseEmployeeFields: ProfileField[] = [
  { name: 'fullName' as keyof ProfileFormData, label: 'Employee Name', type: 'text', required: true, placeholder: 'Employee Name here' },
  { name: 'emailAddress' as keyof ProfileFormData, label: 'Email ID', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'cellNumber' as keyof ProfileFormData, label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic' as keyof ProfileFormData, label: 'CNIC No.', type: 'text', required: true, placeholder: '12345-1234567-1' },
  { name: 'role' as keyof ProfileFormData, label: 'Assign Role', type: 'select', required: true, placeholder: 'Select role', options: [] },
  { name: 'profilePicture' as keyof ProfileFormData, label: 'Profile Picture', type: 'file', required: false },
  { name: 'cnicFront' as keyof ProfileFormData, label: 'CNIC Front Image', type: 'file', required: false },
  { name: 'cnicBack' as keyof ProfileFormData , label: 'CNIC Back Image', type: 'file', required: false }
];

interface SelectedEmployeeRow {
  id: string;
}

export default function EditEmployee() {
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);
  const updateEmployeeMutation = useUpdateEmployee();
  const { data: employeeResponse, isLoading } = useEmployeeById(employeeId);

  useEffect(() => {
    getRoles().then((res) => {
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        setRoleOptions(res.data.map((role) => ({ value: role.id, label: role.name })));
      }
    });
  }, []);

  useEffect(() => {
    const selected = getTableRow<SelectedEmployeeRow>('employee');
    if (selected?.id) {
      setEmployeeId(selected.id);
    }
    const timeoutId = setTimeout(() => {
      clearTableRow('employee');
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const employee = employeeResponse?.data;
    if (!employee) {
      return;
    }

    const matchedRole = roleOptions.find((option) => option.label === (employee.userRole ?? ''));
    const roleId = matchedRole?.value ?? '';
    setSelectedRoleId(roleId);

    setInitialValues({
      fullName: employee.fullName,
      emailAddress: employee.email,
      cellNumber: employee.phoneNumber ?? '',
      cnic: employee.cnic,
      role: roleId,
    });
  }, [employeeResponse, roleOptions]);

  const handleUpdate = async (data: ProfileFormData) => {
    if (!employeeId) {
      return;
    }

    await updateEmployeeMutation.mutateAsync({
      Id: employeeId,
      FullName: data.fullName || '',
      PhoneNumber: data.cellNumber || '',
      RoleId: (data.role as string) || selectedRoleId,
      IsActive: !!data.isActive,
      ProfilePicture: data.profilePicture instanceof File ? data.profilePicture : null,
      CNICFrontImage: data.cnicFront instanceof File ? data.cnicFront : null,
      CNICBackImage: data.cnicBack instanceof File ? data.cnicBack : null,
    });
  };

  const employeeFields = React.useMemo<ProfileField[]>(
    () => baseEmployeeFields.map((field) => (field.name === 'role' ? { ...field, options: roleOptions } : field)),
    [roleOptions]
  );

  return (
    <DashboardLayout pageTitle="Edit Employee">
      <div style={{ margin: '0 auto' }}>
        {(isLoading || updateEmployeeMutation.isPending) && <Loader variant="full" />}
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={employeeFields}
            initialValues={initialValues}
            loading={isLoading || updateEmployeeMutation.isPending}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
