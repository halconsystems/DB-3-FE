
'use client';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { workerFields } from '../fields';

export default function AddNewWorker() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New Worker">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={workerFields}
        />
      </div>
    </DashboardLayout>
  );
}


