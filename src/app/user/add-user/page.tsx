"use client";

import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm from '../../../components/forms/CommonEntityForm';
import { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { userFields } from '../fields';
import { useCreateUser } from '../../../hooks/user/useCreateUser';


export default function AddNewUser() {
  const createUserMutation = useCreateUser();

  const handleSave = (data: ProfileFormData) => {
    const cardStatus = typeof data.cardStatus === 'string'
      ? data.cardStatus === 'active'
      : !!data.cardStatus;

    // Map form data to API shape
    const user = {
      name: data.name || '',
      email: data.emailAddress || '',
      phoneNumber: data.cellNumber || '',
      cnic: data.cnic || '',
      userType: data.userType === 'admin' ? 1 : 2, // adjust as needed
      rfidCardNumber: data.rfidCardNo || '',
      createdBy: 'admin', // or get from context/auth
      cardIssueDate: data.cardIssueDate || '',
      cardExpiryDate: data.cardExpiryDate || '',
      cardStatus: cardStatus ? 1 : 0,
    };
    createUserMutation.mutate(user, {
      onSuccess: () => {
        window.history.back();
      },
    });
  };

  const initVal = {
            name: '',
            emailAddress: '',
            cellNumber: '',
            cnic: '',
            userType: '',
            rfidCardNo: '',
            cardIssueDate: '',
            cardExpiryDate: '',
            cardStatus: true,
            status: true,
          }

  return (
    <DashboardLayout pageTitle="Add New User">
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={userFields}
          initialValues={initVal}
          loading={false}
          showStatusToggle={false}
        />
    </DashboardLayout>
  );
}
