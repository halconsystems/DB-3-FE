"use client";
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm from '../../../../components/forms/CommonEntityForm';
import { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { employeeFields } from '../fields';
import { getRoles } from '../../../../services/role.service';
import React from 'react';
import { useRegister } from '../../../../hooks/auth/useRegister';
export default function AddNewEmployee() {
  const { mutate: registerEmployee, status } = useRegister();
  const [roleOptions, setRoleOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [defaultValues, setDefaultValues] = React.useState<Partial<ProfileFormData>>({});

  React.useEffect(() => {
    getRoles().then(res => {
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        const options = res.data.map(role => ({ value: role.id, label: role.name }));
        setRoleOptions(options);
        if (options.length > 0) {
          setDefaultValues((prev) => ({ ...prev, role: options[0].value }));
        }
      }
    });
  }, []);

  const handleSave = (data: ProfileFormData) => {
    const body = {
      FullName: data.fullName || '',
      Email: data.emailAddress || '',
      Password: data.tempPassword || '',
      PhoneNumber: data.cellNumber || '',
      CNIC: data.cnic || '',
      RoleId: data.role || '', 
      ProfilePicture: data.profilePicture || undefined,
      CNICFrontImage: data.cnicFront || undefined,
      CNICBackImage: data.cnicBack || undefined,
    };
    registerEmployee(body);
  };

  const fieldsWithRoles = React.useMemo(() => {
    return employeeFields.map(field =>
      field.name === 'role' ? { ...field, options: roleOptions } : field
    );
  }, [roleOptions]);

  return (
    <DashboardLayout pageTitle="Add New Employee">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={fieldsWithRoles}
          initialValues={defaultValues}
          loading={status === 'pending'}
        />
      </div>
    </DashboardLayout>
  );
}
