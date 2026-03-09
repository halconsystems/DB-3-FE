'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileFormData, residentialFields } from '../../../components/forms/ProfileForm';
import { useRouter } from 'next/navigation';

// Mock data for editing a residential/commercial member
const mockResidentialData: ProfileFormData = {
  fullName: 'Shahid Husain',
  emailAddress: 'shahid@gmail.com',
  password: '',
  phoneNumber: '0301-2346550',
  category: 'commercial',
  subCategory: 'shop',
  phase: 'phase2',
  zone: 'zoneA',
  khayaban: 'Khayaban-e-Ittehad',
  floor: '02',
  laneStreetNumber: '12',
  plotNo1: '50',
  plotNo2: 'A',
  plotNo3: '',
  cardNo: '02134',
  issueDate: '2026-03-01',
  expiryDate: '2027-03-01',
  cardStatus: 'active',
  profilePicture: undefined,
  proofOfPossession: undefined,
};

export default function EditResidential() {
  const router = useRouter();

  const handleSave = (data: ProfileFormData) => {
    // Save logic here
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Residential/Commercial">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <ProfileForm
          title="Please update details below!"
          onSave={handleSave}
          onCancel={() => router.back()}
          fields={residentialFields}
          initialValues={mockResidentialData}
        />
      </div>
    </DashboardLayout>
  );
}
