"use client";

import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm from '../../../components/forms/CommonEntityForm';
import { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { userFamilyFields } from '../fields';
import { useCreateUserFamily } from '../../../hooks/user-family/useCreateUserFamily';


export default function AddNewUserFamily() {
  const createUserFamilyMutation = useCreateUserFamily();

  const handleSave = (data: ProfileFormData) => {
    const body = {
      ser: 0,
      name: data.name || '',
      residentCardNumber: data.residentCardNo || null,
      profilePicture: null, // handle file upload if needed
      cnic: data.cnic || '',
      phoneNumber: data.cellNumber || '',
      fatherOrHusbandName: data.fatherHusbandName || '',
      relation: Number(data.relation) || 0,
      dateOfBirth: data.dob || '',
      validTo: data.validTo || null,
      validFrom: data.validFrom || null,
      cardStatus: null,
      externalUserId: '', // set as needed
      createdBy: '', // set as needed
    };
    createUserFamilyMutation.mutate(body, {
      onError: (error) => {
        // handle error (show toast, etc.)
        console.error(error);
      }
    });
  };

  return (
    <DashboardLayout pageTitle="Add New User Family">
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={userFamilyFields}
          initialValues={{
            name: '',
            emailAddress: '',
            cellNumber: '',
            cnic: '',
            relation: '',
            fatherHusbandName: '',
            residentCardNo: '',
            dob: '',
            validFrom: '',
            validTo: '',
          }}
          loading={createUserFamilyMutation.isPending}
          showStatusToggle={false}
        />
    </DashboardLayout>
  );
}
