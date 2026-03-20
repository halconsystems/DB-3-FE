import DashboardLayout from '../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField } from '../../components/forms/CommonEntityForm';

export default function ProfilePage() {
  
  const profileFields: ProfileField[] = [
    { name: 'idNumber', label: 'ID Number', type: 'text', required: true, placeholder: 'Type here' },
    { name: 'role', label: 'Role', type: 'select', required: true, options: [ { value: '', label: 'Select Role here' } ] },
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
    { name: 'userName', label: 'User Name', type: 'text', required: true, placeholder: 'User Name here' },
    { name: 'cnic', label: 'CNIC', type: 'text', required: true, placeholder: '(12345-1234567-1)' },
    { name: 'vehicleTagId', label: 'Vehicle Tag ID', type: 'text', required: false, placeholder: 'Vehicle Tag ID here' },
    { name: 'emailAddress', label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
    { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Password here' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true, placeholder: '0301-2345650' },
    { name: 'cnicFront', label: 'CNIC Front', type: 'file', required: true },
    { name: 'cnicBack', label: 'CNIC Back', type: 'file', required: true },
    { name: 'profilePicture', label: 'Profile Picture', type: 'file', required: false },
  ];

  return (
    <DashboardLayout pageTitle="Profile">
      <CommonEntityForm fields={profileFields} />
    </DashboardLayout>
  );
}

