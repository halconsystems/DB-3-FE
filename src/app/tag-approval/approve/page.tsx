
'use client';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { useSearchParams } from 'next/navigation';
import { useGetTagApprovalRequestById } from '../../../hooks/tag-approval/useGetTagApprovalRequestById';

import { useFeeScales } from '../../../hooks/fees/useFeeScales';
import type { FeeScale } from '../../../types/fees.types';

export default function AddNewTag() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || '';
  const { data, isLoading, isError } = useGetTagApprovalRequestById(id, !!id);
  const { data: feeScaleData, isLoading: isFeeScaleLoading } = useFeeScales();

  // Build Fee Scale options for dropdown
  const feeScaleOptions = feeScaleData?.data?.map((fee: FeeScale) => ({ value: fee.id, label: fee.name })) || [];

  const approveFields: ProfileField[] = [
    { name: 'tagApprovalRequestId' as keyof ProfileFormData, label: 'Tag Approval Request ID', type: 'text', required: true, placeholder: 'Tag Approval Request ID here' },
    { name: 'name' as keyof ProfileFormData, label: 'Entity Name', type: 'text', required: true, placeholder: 'Entity Name here' },
    { name: 'entityId' as keyof ProfileFormData, label: 'Entity ID', type: 'text', required: true, placeholder: 'Enter Entity ID here' },
    { name: 'tagType' as keyof ProfileFormData, label: 'Tag Type', type: 'text', required: true, placeholder: 'Enter Tag Type here' },
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
    { name: 'planType' as keyof ProfileFormData, label: 'Plan Type', type: 'text', required: true, placeholder: 'Enter Plan Type here' },
    { name: 'zone' as keyof ProfileFormData, label: 'Zone', type: 'text', required: true, placeholder: 'Enter Zone here' },
    { name: 'device' as keyof ProfileFormData, label: 'Device', type: 'text', required: true, placeholder: 'Enter Device here' },
    { name: 'notes' as keyof ProfileFormData, label: 'Notes', type: 'text', required: true, placeholder: 'Enter Notes here' },
  ];

  const handleSave = (formData: ProfileFormData) => {
    console.log('Saved:', formData);
  };

  // Map fetched data to form fields
  let initialValues: Partial<ProfileFormData> = {};
  if (data && data.data) {
    const tag = data.data;
    initialValues = {
      name: tag.subjectName,
      entityId: tag.subjectId,
      tagType: tag.tagType,
      tagNumber: tag.tagNumber,
      validFrom: tag.validFrom,
      validTo: tag.validTo,
      feeScaleId: tag.feeScale,
      planType: tag.planType,
      zone: '', // Map if available
      device: '', // Map if available
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
          />
        )}
      </div>
    </DashboardLayout>
  );
}