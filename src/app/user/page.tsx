'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRemoveUser } from '../../hooks/user/useRemoveUser';
import { useExternalUsers } from '../../hooks/user/useUsers';
import { useUserById } from '../../hooks/user/useUserById';
import { useCreateUser } from '../../hooks/user/useCreateUser';
import { useUpdateUser } from '../../hooks/user/useUpdateUser';
import { useEnumMetadata } from '../../hooks/metadata/useEnumMetadata';
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
  const { data: userTypesEnum } = useEnumMetadata('UserType');

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
    
    if (userTypesEnum?.members) {
      userTypesEnum.members.forEach((member) => {
        userTypeOptions.push({
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
      return field;
    });
  }, [userTypesEnum]);

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

  const toCardStatusValue = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'number') return value === 1 ? 1 : 0;
    if (value === 'active' || value === '1') return 1;
    return 0;
  };

  const handleAddUser = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createUser({
        name: data.name || '',
        email: data.emailAddress || '',
        phoneNumber: data.cellNumber || '',
        cnic: data.cnic || '',
        userType: Number(data.userType) || 0,
        rfidCardNumber: data.rfidCardNo || '',
        cardIssueDate: toIsoDate(data.cardIssueDate),
        cardExpiryDate: toIsoDate(data.cardExpiryDate),
        cardStatus: toCardStatusValue(data.cardStatus),
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
      userType: editUserDetails.userType !== null && editUserDetails.userType !== undefined ? String(editUserDetails.userType) : '',
      rfidCardNo: editUserDetails.rfidCardNumber || '',
      cardIssueDate: toDateInputValue(editUserDetails.cardIssueDate),
      cardExpiryDate: toDateInputValue(editUserDetails.cardExpiryDate),
      cardStatus: editUserDetails.cardStatus === 1,
      status: !!editUserDetails.isActive,
    };
  }, [editUserDetails]);

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
        userType: Number(data.userType) || editUserDetails.userType,
        rfidCardNumber: data.rfidCardNo || editUserDetails.rfidCardNumber || '',
        cardIssueDate: toIsoDate(data.cardIssueDate || editUserDetails.cardIssueDate),
        cardExpiryDate: toIsoDate(data.cardExpiryDate || editUserDetails.cardExpiryDate),
        cardStatus: toCardStatusValue(data.cardStatus),
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
