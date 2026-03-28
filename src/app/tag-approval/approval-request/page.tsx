
'use client';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

const approvalRequestFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Entity Name', type: 'text', required: true, placeholder: 'Enter Name here' },
  { name: 'entityId' as keyof ProfileFormData, label: 'Entity ID', type: 'text', required: true, placeholder: 'Enter Entity ID here' },
  { name: 'tagType' as keyof ProfileFormData, label: 'Tag Type', type: 'text', required: true, placeholder: 'Enter Tag Type here' },
  { name: 'tagNumber' as keyof ProfileFormData, label: 'Tag Number', type: 'text', required: true, placeholder: 'Enter Tag Number here' },
  { name: 'validFrom' as keyof ProfileFormData, label: 'Valid From', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'validTo' as keyof ProfileFormData, label: 'To Date', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'feeScaleId' as keyof ProfileFormData, label: 'Fee Scale ID', type: 'text', required: true, placeholder: 'Enter Fee Scale ID here' },
  { name: 'planType' as keyof ProfileFormData, label: 'Plan Type', type: 'text', required: true, placeholder: 'Enter Plan Type here' },
  { name: 'zone' as keyof ProfileFormData, label: 'Zone', type: 'text', required: true, placeholder: 'Enter Zone here' },
  { name: 'device' as keyof ProfileFormData, label: 'Device', type: 'text', required: true, placeholder: 'Enter Device here' },
  { name: 'notes' as keyof ProfileFormData, label: 'Notes', type: 'text', required: true, placeholder: 'Enter Notes here' },
];

export default function AddNewTag() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
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
        />
      </div>
    </DashboardLayout>
  );
}


