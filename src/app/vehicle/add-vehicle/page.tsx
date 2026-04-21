
'use client';
import React from 'react';
import { getEnumMetadata } from '../../../services/enum.service';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { vehicleFields } from '../fields';
import { useCreateVehicle } from '../../../hooks/vehicle/useCreateVehicle';
import { getAllExternalUsers } from '../../../services/user.service';

const toIsoDate = (value?: string) => {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

const toTagStatus = (value?: string): number => {
  if (value === 'active') {
    return 1;
  }

  if (value === 'inactive') {
    return 0;
  }

  return 0;
};

const toAttachmentString = (value?: File | null): string => {
  if (!value) {
    return '';
  }
  return value.name;
};


export default function AddNewVehicle() {
  const { mutateAsync: createVehicle, isPending } = useCreateVehicle();
  const [formError, setFormError] = React.useState('');
  const [fields, setFields] = React.useState(vehicleFields);
  const [loadingEnums, setLoadingEnums] = React.useState(true);

  React.useEffect(() => {
    async function fetchEnumOptions() {
      try {
        // Fetch both enums in parallel
        const [colorRes, tagStatusRes] = await Promise.all([
          getEnumMetadata({ EnumType: 'VehicleColor' }),
          getEnumMetadata({ EnumType: 'TagStatus' })
        ]);
        const colorEnum = colorRes.data.enums.find(e => e.name === 'VehicleColor');
        const tagStatusEnum = tagStatusRes.data.enums.find(e => e.name === 'TagStatus');
        const colorOptions = colorEnum?.members.map(m => ({ value: m.value.toString(), label: m.name })) || [];
        const tagStatusOptions = tagStatusEnum?.members.map(m => ({ value: m.value.toString(), label: m.name })) || [];
        setFields(prevFields => prevFields.map(f => {
          if (f.name === 'color') {
            return { ...f, type: 'select', options: colorOptions };
          }
          if (f.name === 'eTagStatus') {
            return { ...f, type: 'select', options: tagStatusOptions };
          }
          return f;
        }));
      } catch {
        // fallback: leave as text if API fails
      } finally {
        setLoadingEnums(false);
      }
    }
    fetchEnumOptions();
  }, []);

  const handleSave = async (data: ProfileFormData) => {
    setFormError('');

    // Get createdBy from localStorage as before
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let createdBy = 'system';
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        createdBy = user?.fullName || user?.name || user?.email || 'system';
      } catch {
        createdBy = 'system';
      }
    }

    // Fetch external users and use first valid id, fallback to 'system'
    let externalUserId = 'system';
    try {
      const users = await getAllExternalUsers();
      const firstValid = users.find(u => u.id);
      if (firstValid && firstValid.id) {
        externalUserId = firstValid.id;
      }
    } catch (e) {
      // fallback to 'system' if API fails
    }

    try {
      await createVehicle({
        ser: 0,
        licenseNo: Number(data.vehicleNo2 || 0),
        license: data.vehicleNo || '',
        year: data.year || '',
        color: data.color || '',
        make: data.make || '',
        model: data.model || '',
        attachment: toAttachmentString(data.attachment),
        eTagId: data.eTagId || '',
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        tagStatus: Number(data.eTagStatus) || 0,
        createdBy,
        externalUserId,
        isActive: true,
      });
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create vehicle';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Vehicle">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={fields}
          loading={isPending || loadingEnums}
        />
      </div>
    </DashboardLayout>
  );
}


