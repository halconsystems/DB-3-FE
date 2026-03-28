"use client";
import { useCreateTagType } from '../../../hooks/tagtype/useCreateTagType';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

const tagTypeFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Name here' },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: true, placeholder: 'Enter Description here' },
];


export default function AddNewTag() {
  const createTagTypeMutation = useCreateTagType();

  const handleSave = (data: ProfileFormData) => {
    createTagTypeMutation.mutate({
      name: data.name as string,
      description: data.description as string,
    });
  };

  return (
    <DashboardLayout pageTitle="Create Tag Type">
      <div style={{ margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={tagTypeFields}
          saveButtonText="Create"
        />
      </div>
    </DashboardLayout>
  );
}