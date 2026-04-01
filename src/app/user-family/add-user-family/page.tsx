"use client";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm from '../../../components/forms/CommonEntityForm';
import { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { userFamilyFields } from '../fields';

export default function AddNewUserFamily() {
  const handleSave = (data: ProfileFormData) => {
    const body = {
      Name: data.name || '',
      Email: data.emailAddress || '',
      Phone: data.cellNumber || '',
      CNIC: data.cnic || '',
      Relation: data.relation || '',
      FatherHusbandName: data.fatherHusbandName || '',
      ResidentCardNo: data.residentCardNo || '',
      DOB: data.dob || null,
      ValidFrom: data.validFrom || null,
      ValidTo: data.validTo || null,
    };
    console.log('Save User Family:', body);
    // TODO: Call API to save user family
    window.history.back();
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
          loading={false}
          showStatusToggle={false}
        />
    </DashboardLayout>
  );
}
