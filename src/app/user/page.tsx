'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRemoveUser } from '../../hooks/user/useRemoveUser';
import { useExternalUsers } from '../../hooks/user/useUsers';
import { useUserById } from '../../hooks/user/useUserById';
import { useCreateUser } from '../../hooks/user/useCreateUser';
import { useUpdateUser } from '../../hooks/user/useUpdateUser';
import { useEnumMetadata } from '../../hooks/metadata/useEnumMetadata';
import type { EnumMetadata } from '../../services/metadata.service';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';
import { userFields } from './fields';


// Map API user type to display values
const mapUserType = (type: number | string) => {
  if (typeof type === 'string') return type;
  switch (type) {
    case 1: return 'Admin';
    case 2: return 'User';
    default: return 'User';
  }
};



export default function UserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const removeUserMutation = useRemoveUser();
  const { data, isLoading } = useExternalUsers();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: userTypesEnum, isLoading: isUserTypesEnumLoading } = useEnumMetadata('UserType');
  const { data: cardStatusEnum, isLoading: isCardStatusEnumLoading } = useEnumMetadata('CardStatus');

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal state
  const [editUserId, setEditUserId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const { data: editUserDetails, isLoading: isEditUserLoading } = useUserById(editUserId);

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

  // Detect modal state from URL
  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditUserId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('user');
        if (selected?.id) {
          setEditUserId(String(selected.id));
          clearTableRow('user');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleAddNew = () => {
    router.push('/user?modal=add');
  };

  const handleEdit = (user: any) => {
    saveTableRow('user', { id: user.id });
    router.push(`/user?modal=edit&id=${encodeURIComponent(user.id)}`);
  };

  const handleCloseModal = () => {
    setEditUserId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/user');
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return '';
    const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : '';
  };

  const toIsoDate = (value?: string | null) => {
    if (!value) return '';
    const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : '';
  };

  const toUserTypeValue = (value?: string | number | null, enumMetadata?: EnumMetadata | null) => {
    if (value === null || value === undefined || value === '') return '';
    const asString = String(value).trim();

    if (!enumMetadata?.members?.length) {
      return asString;
    }

    const matchedMember = enumMetadata.members.find(
      (member) => String(member.value) === asString || member.name.toLowerCase() === asString.toLowerCase()
    );

    return matchedMember ? String(matchedMember.value) : asString;
  };

  const toUserTypeApiValue = (value?: string | number | null, fallback?: string | number | null, enumMetadata?: EnumMetadata | null) => {
    const resolved = value ?? fallback;
    if (resolved === null || resolved === undefined || resolved === '') return 0;

    const asString = String(resolved).trim();
    const matchedMember = enumMetadata?.members?.find(
      (member) => String(member.value) === asString || member.name.toLowerCase() === asString.toLowerCase()
    );

    if (matchedMember) {
      return matchedMember.value;
    }

    const numeric = Number(asString);
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const toCardStatusValue = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined || value === '') return '';
    return String(value).trim();
  };

  const toCardStatusApiValue = (value?: string | number | boolean | null, fallback?: string | number | boolean | null) => {
    const resolved = value ?? fallback;
    if (resolved === null || resolved === undefined || resolved === '') return 0;
    const numeric = Number(resolved);
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const handleAddUser = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createUser({
        name: data.name || '',
        email: data.emailAddress || '',
        phoneNumber: data.cellNumber || '',
        cnic: data.cnic || '',
        userType: toUserTypeApiValue(data.userType, undefined, userTypesEnum),
        rfidCardNumber: data.rfidCardNo || '',
        cardIssueDate: toIsoDate(data.cardIssueDate),
        cardExpiryDate: toIsoDate(data.cardExpiryDate),
        cardStatus: toCardStatusApiValue(data.cardStatus),
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create user';
      setFormError(message);
    }
  };

  const initialValues = useMemo<ProfileFormData | null>(() => {
    if (!editUserDetails) return null;
    return {
      name: editUserDetails.name || '',
      emailAddress: editUserDetails.email || '',
      cellNumber: editUserDetails.phoneNumber || '',
      cnic: editUserDetails.cnic || '',
      userType: toUserTypeValue(editUserDetails.userType, userTypesEnum),
      rfidCardNo: editUserDetails.rfidCardNumber || '',
      cardIssueDate: toDateInputValue(editUserDetails.cardIssueDate),
      cardExpiryDate: toDateInputValue(editUserDetails.cardExpiryDate),
      cardStatus: toCardStatusValue(editUserDetails.cardStatus),
      status: !!editUserDetails.isActive,
    };
  }, [editUserDetails, userTypesEnum]);

  const handleUpdateUser = async (data: ProfileFormData) => {
    if (!editUserId || !editUserDetails) return;
    setFormError('');
    try {
      await updateUser({
        id: editUserId,
        name: data.name || editUserDetails.name || '',
        email: data.emailAddress || editUserDetails.email || '',
        phoneNumber: data.cellNumber || editUserDetails.phoneNumber || '',
        cnic: data.cnic || editUserDetails.cnic || '',
        userType: toUserTypeApiValue(data.userType, editUserDetails.userType, userTypesEnum),
        rfidCardNumber: data.rfidCardNo || editUserDetails.rfidCardNumber || '',
        cardIssueDate: toIsoDate(data.cardIssueDate || editUserDetails.cardIssueDate),
        cardExpiryDate: toIsoDate(data.cardExpiryDate || editUserDetails.cardExpiryDate),
        cardStatus: toCardStatusApiValue(data.cardStatus, editUserDetails.cardStatus),
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update user';
      setFormError(message);
    }
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) {
      return;
    }
    setIsDeleting(true);
    removeUserMutation.mutate(String(selectedUser.id), {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => {
        console.error('Delete failed:', error);
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    });
  };


  // Map API data to table data
  const filteredData = (data || [])
    .filter(user => !localRemovedIds.includes(String(user.id)) && user.isActive)
    .map((user, idx) => ({
      sno: idx + 1,
      id: String(user.id),
      name: user.name || '',
      emailAddress: user.email || '',
      cellNumber: user.phoneNumber || '',
      cnic: user.cnic || '',
      userType: mapUserType(user.userType),
      rfidCardNo: user.rfidCardNumber || '',
      cardIssueDate: user.cardIssueDate || '',
      cardExpiryDate: user.cardExpiryDate || '',
      cardStatus: user.cardStatus,
      status: user.isActive,
    }));

  const columns: Column<any>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'emailAddress', header: 'Email' },
    { key: 'cellNumber', header: 'Phone' },
    { key: 'cnic', header: 'CNIC No.' },
    { key: 'userType', header: 'User Type' },
    { key: 'rfidCardNo', header: 'RFID Card No.' },
    { key: 'cardIssueDate', header: 'Card Issue Date', render: (value: string) => formatDateDisplay(value) },
    { key: 'cardExpiryDate', header: 'Card Expiry Date', render: (value: string) => formatDateDisplay(value) },
    {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value: number) => <StatusBadge type="cardStatus" value={value} />
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: boolean) => <StatusBadge type="activeInactive" value={value} />
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
            <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
          </div>
        );
      }
    },
  ];

  return (
    <DashboardLayout pageTitle="User">
      <DataTable
        columns={columns}
        data={filteredData}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status ? 'Active' : 'Inactive'}
        loading={isLoading}
        emptyMessage={isLoading ? 'Loading users...' : 'No users found'}
      />

      {/* ADD USER MODAL */}
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New User"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddUser}
          onCancel={handleCloseModal}
          fields={dynamicUserFields}
          saveButtonText="Create"
          loading={isUserTypesEnumLoading || isCardStatusEnumLoading}
          showStatusToggle={false}
        />
      </FormModal>

      {/* EDIT USER MODAL */}
      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit User"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {isEditUserLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialValues ? (
          <CommonEntityForm
            key={editUserId}
            title="Please update details below!"
            onSave={handleUpdateUser}
            onCancel={handleCloseModal}
            fields={dynamicUserFields}
            initialValues={initialValues}
            saveButtonText="Update"
            loading={isEditUserLoading || isUserTypesEnumLoading || isCardStatusEnumLoading}
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading user details</div>
        )}
      </FormModal>

      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this user? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}
