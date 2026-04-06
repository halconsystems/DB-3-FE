
'use client';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { useSearchParams } from 'next/navigation';
import { useGetTagApprovalRequestById } from '../../../hooks/tag-approval/useGetTagApprovalRequestById';

import { useFeeScales } from '../../../hooks/fees/useFeeScales';
import type { FeeScale } from '../../../types/fees.types';
import { useDevices } from '../../../hooks/device/useDevices';
import { useZones } from '../../../hooks/zone/useZones';
import { useGetAllTagTypes } from '../../../hooks/tagtype/useGetAllTagTypes';
import { useApproveTagApprovalRequest } from '../../../hooks/tag-approval/useApproveTagApprovalRequest';

export default function AddNewTag() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || '';
  const { data, isLoading, isError } = useGetTagApprovalRequestById(id, !!id);
  const { data: feeScaleData, isLoading: isFeeScaleLoading } = useFeeScales();
  const { data: deviceData, isLoading: isDeviceLoading } = useDevices();
  const { data: zoneData, isLoading: isZoneLoading } = useZones();
  const { data: tagTypeData, isLoading: isTagTypeLoading } = useGetAllTagTypes();
  const approveTagMutation = useApproveTagApprovalRequest();

  const toDateInputValue = (value?: string | null) => {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    if (date.getFullYear() <= 1) {
      return '';
    }

    return date.toISOString().split('T')[0];
  };

  const toIsoDate = (value?: string | null) => {
    if (!value) {
      return new Date().toISOString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return new Date().toISOString();
    }

    return date.toISOString();
  };

  const toStatusValue = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined) {
      return 0;
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return 0;
    }

    return parsed;
  };

  const toStatusFlag = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    const normalized = value.toLowerCase();
    return normalized === '1' || normalized === 'active' || normalized === 'true';
  };

  // Build Fee Scale options for dropdown
  const feeScaleOptions = feeScaleData?.data?.map((fee: FeeScale) => ({ value: fee.id, label: fee.name })) || [];
  const deviceOptions = [
    { value: '', label: 'Select Device' },
    ...(deviceData?.data?.map((device) => ({ value: device.id, label: device.name })) || []),
  ];
  const zoneOptions = [
    { value: '', label: 'Select Zone' },
    ...(zoneData?.data?.map((zone) => ({ value: zone.id, label: zone.name })) || []),
  ];
  const tagTypeOptions = [
    { value: '', label: 'Select Tag Type' },
    ...(tagTypeData?.data?.map((tagType) => ({ value: tagType.id, label: tagType.name })) || []),
  ];

  const approveFields: ProfileField[] = [
    { name: 'tagApprovalRequestId' as keyof ProfileFormData, label: 'Tag Approval Request ID', type: 'text', required: true, placeholder: 'Tag Approval Request ID here' },
    { name: 'name' as keyof ProfileFormData, label: 'Entity Name', type: 'text', required: true, placeholder: 'Entity Name here' },
    { name: 'entityId' as keyof ProfileFormData, label: 'Entity ID', type: 'text', required: true, placeholder: 'Enter Entity ID here' },
    {
      name: 'tagType' as keyof ProfileFormData,
      label: 'Tag Type',
      type: 'select',
      required: true,
      placeholder: 'Select Tag Type',
      options: tagTypeOptions,
    },
    { name: 'tagNumber' as keyof ProfileFormData, label: 'Tag Number', type: 'text', required: true, placeholder: 'Enter Tag Number here' },
    { name: 'validFrom' as keyof ProfileFormData, label: 'Valid From', type: 'date', required: true, placeholder: 'Select Date' },
    { name: 'validTo' as keyof ProfileFormData, label: 'Valid To', type: 'date', required: true, placeholder: 'Select Date' },
    {
      name: 'feeScaleId' as keyof ProfileFormData,
      label: 'Fee Scale',
      type: 'select',
      required: true,
      placeholder: 'Select Fee Scale',
      options: feeScaleOptions,
    },
    {
      name: 'planType' as keyof ProfileFormData,
      label: 'Plan Type',
      type: 'select',
      required: true,
      placeholder: 'Select Plan Type',
      options: [
        { value: '', label: 'Select Plan Type' },
        { value: 'Day', label: 'Day' },
        { value: 'Week', label: 'Week' },
        { value: 'Month', label: 'Month' },
        { value: 'Year', label: 'Year' },
      ],
    },
    { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'statusSwitch', required: false, placeholder: 'Status' },
    {
      name: 'trialPeriod' as keyof ProfileFormData,
      label: 'Trial Period (Days)',
      type: 'select',
      required: true,
      placeholder: 'Select Trial Period',
      options: [
        { value: '', label: 'Select Trial Period' },
        { value: '7', label: '7 Days' },
        { value: '15', label: '15 Days' },
        { value: '30', label: '30 Days' },
      ],
    },
    {
      name: 'zone' as keyof ProfileFormData,
      label: 'Zone',
      type: 'select',
      required: true,
      placeholder: 'Select Zone',
      options: zoneOptions,
    },
    {
      name: 'device' as keyof ProfileFormData,
      label: 'Device',
      type: 'select',
      required: true,
      placeholder: 'Select Device',
      options: deviceOptions,
    },
    { name: 'notes' as keyof ProfileFormData, label: 'Notes', type: 'text', required: true, placeholder: 'Enter Notes here' },
  ];

  const handleSave = (formData: ProfileFormData) => {
    if (!data?.data) {
      return;
    }

    const tag = data.data;

    // Map planType string to backend enum (default to 'Unknown' if not matched)
    const allowedPlanTypes = ['Day', 'Week', 'Month', 'Year'];
    const planType = allowedPlanTypes.includes(formData.planType || '') ? formData.planType : 'Unknown';

    const payload = {
      tagApprovalRequestId: String(formData.tagApprovalRequestId || tag.id),
      entityName: String(formData.name || tag.subjectName || ''),
      entityId: String(formData.entityId || tag.subjectId || ''),
      tagNumber: String(formData.tagNumber || tag.tagNumber || ''),
      tagTypeId: String(formData.tagType || ''),
      validFrom: toIsoDate(String(formData.validFrom || tag.validFrom || '')),
      validTo: toIsoDate(String(formData.validTo || tag.validTo || '')),
      status: toStatusValue(formData.status),
      feeScaleId: String(formData.feeScaleId || tag.feeScale || ''),
      planType,
      zoneId: String(formData.zone || ''),
      deviceId: String(formData.device || ''),
      zoneIds: formData.zone ? [String(formData.zone)] : [],
      trialPeriod: Number(formData.trialPeriod || 0),
      notes: String(formData.notes || ''),
      command: 'Approve', // Add required command field
    };

    console.log('approveTagApprovalRequest payload:', payload);

    approveTagMutation.mutate(payload);
  };

  // Map fetched data to form fields
  let initialValues: Partial<ProfileFormData> = {};
  if (data && data.data) {
    const tag = data.data;
    const matchingTagType = tagTypeData?.data?.find(
      (tagType) => tagType.id === tag.tagType || tagType.name === tag.tagType
    );

    initialValues = {
      tagApprovalRequestId: tag.id,
      name: tag.subjectName,
      entityId: tag.subjectId,
      tagType: matchingTagType?.id || '',
      tagNumber: tag.tagNumber,
      validFrom: toDateInputValue(tag.validFrom),
      validTo: toDateInputValue(tag.validTo),
      feeScaleId: tag.feeScale,
      status: true, // status toggle default ON
      planType: '',
      trialPeriod: '',
      zone: '',
      device: '',
      notes: tag.notes,
    };
  }

  return (
    <DashboardLayout pageTitle="Approval">
      <div style={{ margin: '0 auto' }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Failed to load tag approval request.</div>
        ) : (
          <CommonEntityForm
            title="Please provide details below!"
            onSave={handleSave}
            onCancel={() => window.history.back()}
            fields={approveFields}
            saveButtonText="Approve"
            initialValues={initialValues}
            loading={isFeeScaleLoading || isDeviceLoading || isZoneLoading || isTagTypeLoading || approveTagMutation.isPending}
            successTitle="Tag Approved"
            successMessage="The tag approval has been submitted successfully."
          />
        )}
      </div>
    </DashboardLayout>
  );
}