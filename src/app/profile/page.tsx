import DashboardLayout from '../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField } from '../../components/forms/CommonEntityForm';

export default function ProfilePage() {
  
  // Status options for different status type selects
  const cardStatusOptions = [
    { value: '0', label: 'Draft' },
    { value: '1', label: 'Encoded' },
    { value: '2', label: 'Active' },
    { value: '3', label: 'Suspended' },
    { value: '4', label: 'Blacklisted' },
    { value: '5', label: 'Replaced' },
    { value: '6', label: 'Expired' },
  ];

  const tagStatusOptions = [
    { value: '0', label: 'Unknown' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Blocked' },
    { value: '3', label: 'Expired' },
    { value: '4', label: 'Suspended' },
  ];

  const vehicleCategoryOptions = [
    { value: '0', label: 'Private' },
    { value: '1', label: 'Official' },
    { value: '2', label: 'Service' },
    { value: '3', label: 'Commercial' },
  ];

  const activeInactiveOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ];
  
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
    
    // Status Type Fields
    { name: 'cardStatus', label: 'Card Status', type: 'select', required: false, options: cardStatusOptions },
    { name: 'tagStatus', label: 'Tag Status', type: 'select', required: false, options: tagStatusOptions },
    { name: 'vehicleCategory', label: 'Vehicle Category', type: 'select', required: false, options: vehicleCategoryOptions },
    { name: 'activeInactiveStatus', label: 'Active/Inactive Status', type: 'select', required: false, options: activeInactiveOptions },
  ];

  return (
    <DashboardLayout pageTitle="Profile">
      <CommonEntityForm fields={profileFields} />
    </DashboardLayout>
  );
}

