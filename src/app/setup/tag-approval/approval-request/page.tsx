"use client";
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { useCreateTagApprovalRequest } from '../../../../hooks/tag-approval/useCreateTagApprovalRequest';
import { useFeeScales } from '../../../../hooks/fees/useFeeScales';
import type { FeeScale } from '../../../../types/fees.types';
import { useDevices } from '../../../../hooks/device/useDevices';
import { useZones } from '../../../../hooks/zone/useZones';
import { useGetAllTagTypes } from '../../../../hooks/tagtype/useGetAllTagTypes';

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

export default function RequestApproval() {
  const createTagApprovalMutation = useCreateTagApprovalRequest();
  const { data: feeScaleData, isLoading: isFeeScaleLoading } = useFeeScales();
  const { data: deviceData, isLoading: isDeviceLoading } = useDevices();
  const { data: zoneData, isLoading: isZoneLoading } = useZones();
  const { data: tagTypeData, isLoading: isTagTypeLoading } = useGetAllTagTypes();

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

  const approvalRequestFields: ProfileField[] = [
    { name: 'entityName' as keyof ProfileFormData, label: 'Entity Name', type: 'text', required: true, placeholder: 'Enter Name here' },
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
    {
      name: 'feeScaleId' as keyof ProfileFormData,
      label: 'Fee Scale',
      type: 'select',
      required: true,
      placeholder: 'Select Fee Scale',
      options: feeScaleOptions,
    },
    { name: 'planType' as keyof ProfileFormData, label: 'Plan Type', type: 'text', required: true, placeholder: 'Unknown' },
    { name: 'validFrom' as keyof ProfileFormData, label: 'Valid From', type: 'date', required: true, placeholder: 'Select Date' },
    { name: 'validTo' as keyof ProfileFormData, label: 'To Date', type: 'date', required: true, placeholder: 'Select Date' },
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
  ];

  const initialValues: Partial<ProfileFormData> = {
    trialPeriod: '',
  };

  const handleSave = (data: ProfileFormData) => {
    createTagApprovalMutation.mutate({
      entityName: String(data.entityName || ''),
      entityId: String(data.entityId || ''),
      tagTypeId: String(data.tagType || ''),
      tagNumber: String(data.tagNumber || ''),
      feeScaleId: String(data.feeScaleId || ''),
      planType: String(data.planType || 'Unknown'),
      validFrom: toIsoDate(data.validFrom),
      validTo: toIsoDate(data.validTo),
      zoneId: String(data.zone || ''),
      deviceId: String(data.device || ''),
      notes: String(data.notes || ''),
      trialPeriod: String(data.trialPeriod || 'Unknown'),
    });
  };

  return (
    <DashboardLayout pageTitle="Request Approval">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={approvalRequestFields}
          saveButtonText="Request"
          initialValues={initialValues}
          loading={isFeeScaleLoading || isDeviceLoading || isZoneLoading || isTagTypeLoading || createTagApprovalMutation.isPending}
          successTitle="Request Submitted"
          successMessage="The tag approval request has been submitted successfully."
        />
      </div>
    </DashboardLayout>
  );
}
