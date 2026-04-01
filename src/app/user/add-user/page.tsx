"use client";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm from '../../../components/forms/CommonEntityForm';
import { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { userFields } from '../fields';

export default function AddNewUser() {
  const handleSave = (data: ProfileFormData) => {
    const body = {
      Name: data.name || '',
      Email: data.emailAddress || '',
      Phone: data.cellNumber || '',
      CNIC: data.cnic || '',
      UserType: data.userType || '',
      RFIDCardNo: data.rfidCardNo || '',
      CardIssueDate: data.cardIssueDate || null,
      CardExpiryDate: data.cardExpiryDate || null,
      CardStatus: data.cardStatus || '',
      Status: data.status || '',
    };
    console.log('Save User:', body);
    // TODO: Call API to save user
    window.history.back();
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
            cardStatus: 'active',
            status: 'active',
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
