'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';
import { useAuthUserProfileById } from '../../hooks/user/useAuthUserProfileById';
import { getUserIdFromToken } from '../../lib/authToken';
import { updateAuthUserProfile } from '../../services/auth.service';

const getCurrentUserId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const savedId = localStorage.getItem('currentUserId') || sessionStorage.getItem('currentUserId');
  if (savedId) return savedId;

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const idFromToken = getUserIdFromToken(token);
  return idFromToken || undefined;
};

export default function ProfilePage() {
  const pageTitle = 'Profile';
  const router = useRouter();
  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const { data: profileData, isLoading, isError } = useAuthUserProfileById(currentUserId);
  
  const profileFields: ProfileField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
    { name: 'cellNumber', label: 'Phone Number', type: 'text', required: true, placeholder: '0301-2345650' },
    { name: 'cnic', label: 'CNIC', type: 'text', required: true, placeholder: '12345-1234567-1' },
    { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'Role here' },
    { name: 'emailAddress', label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
    { name: 'cnicFront', label: 'CNIC Front', type: 'file', required: true },
  ];

  const initialValues = profileData
    ? {
        fullName: profileData.fullName || '',
        cellNumber: profileData.phoneNumber || '',
        cnic: profileData.cnic || '',
        role: String(profileData.userRole ?? ''),
        emailAddress: profileData.email || '',
        cnicFront: profileData.cnicFrontImageUrl || '',
      }
    : {};

  const isUuid = (value?: string) =>
    !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  const handleUpdateProfile = async (formData: ProfileFormData) => {
    if (!currentUserId) {
      throw new Error('User id not found.');
    }

    await updateAuthUserProfile({
      Id: String(currentUserId),
      FullName: formData.fullName || undefined,
      PhoneNumber: formData.cellNumber || formData.phoneNumber || undefined,
      CNIC: formData.cnic || undefined,
      Email: formData.emailAddress || undefined,
      // Send role only when it is an id (UUID); if role is label text, skip it.
      RoleId: isUuid(formData.role) ? String(formData.role) : undefined,
      CNICFrontImage: formData.cnicFront instanceof File ? formData.cnicFront : undefined,
    });

    const updatedName = String(formData.fullName || '').trim();
    if (updatedName) {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      if (rememberMe) {
        localStorage.setItem('fullName', updatedName);
      } else {
        sessionStorage.setItem('fullName', updatedName);
      }
    }
  };

  return (
    <DashboardLayout pageTitle={pageTitle} showBackButton={true}>
      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>
      ) : isError ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
          Failed to load profile details.
        </div>
      ) : !currentUserId ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
          Unable to identify logged-in user from auth token.
        </div>
      ) : (
        <CommonEntityForm
          fields={profileFields}
          initialValues={initialValues}
          onSave={handleUpdateProfile}
          onCancel={() => router.back()}
          saveButtonText="Update"
          cancelButtonText="Cancel"
        />
      )}
    </DashboardLayout>
  );
}

