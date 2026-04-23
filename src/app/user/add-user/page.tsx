"use client";

import { useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm from '../../../components/forms/CommonEntityForm';
import { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { userFields } from '../fields';
import { useCreateUser } from '../../../hooks/user/useCreateUser';
import { useEnumMetadata } from '../../../hooks/metadata/useEnumMetadata';


export default function AddNewUser() {
  const createUserMutation = useCreateUser();
  const { data: userTypesEnum, isLoading: isUserTypesEnumLoading } = useEnumMetadata('UserType');
  const { data: cardStatusEnum, isLoading: isCardStatusEnumLoading } = useEnumMetadata('CardStatus');

  // Build dynamic userType options from enum
  const dynamicUserFields = useMemo(() => {
    const userTypeOptions = [{ value: '', label: 'Select User Type' }];
    const cardStatusOptions = [{ value: '', label: 'Select Card Status' }];
    
    if (userTypesEnum?.members) {
      userTypesEnum.members.forEach((member) => {
        userTypeOptions.push({
          value: String(member.value),
          label: member.name,
        });
      });
    }

    if (cardStatusEnum?.members) {
      cardStatusEnum.members.forEach((member) => {
        cardStatusOptions.push({
          value: String(member.value),
          label: member.name,
        });
      });
    }

    return userFields.map((field) => {
      if (field.name === 'userType') {
        return {
          ...field,
          options: userTypeOptions,
        };
      }
      if (field.name === 'cardStatus') {
        return {
          ...field,
          options: cardStatusOptions,
        };
      }
      return field;
    });
  }, [cardStatusEnum, userTypesEnum]);

  const handleSave = (data: ProfileFormData) => {
    // Map form data to API shape
    const user = {
      name: data.name || '',
      email: data.emailAddress || '',
      phoneNumber: data.cellNumber || '',
      cnic: data.cnic || '',
      userType: Number(data.userType) || 0,
      rfidCardNumber: data.rfidCardNo || '',
      createdBy: 'admin', // or get from context/auth
      cardIssueDate: data.cardIssueDate || '',
      cardExpiryDate: data.cardExpiryDate || '',
      cardStatus: Number(data.cardStatus) || 0,
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
            cardStatus: '',
            status: true,
          }

  return (
    <DashboardLayout pageTitle="Add New User">
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={dynamicUserFields}
          initialValues={initVal}
          loading={isUserTypesEnumLoading || isCardStatusEnumLoading || createUserMutation.isPending}
          showStatusToggle={false}
        />
    </DashboardLayout>
  );
}
