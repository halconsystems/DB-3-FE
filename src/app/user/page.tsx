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
import { resolveTableTotalPages } from '../../lib/unwrapApiList';
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

const isApiSuccess = (response: any) => {
  const statusCode = response?.statusCode;
  if (typeof statusCode === 'number') {
    return [0, 200, 201, 204].includes(statusCode);
  }

  if (typeof response?.success === 'boolean') {
    return response.success;
  }

  if (typeof response?.status === 'number') {
    return response.status >= 200 && response.status < 300;
  }

  return true;
};



export default function UserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const removeUserMutation = useRemoveUser();
  const { data, isLoading } = useExternalUsers(currentPage, pageSize);
  const totalListPages = resolveTableTotalPages(data, pageSize);
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: userTypesEnum, isLoading: isUserTypesEnumLoading } = useEnumMetadata('UserType');
  const { data: cardStatusEnum, isLoading: isCardStatusEnumLoading } = useEnumMetadata('CardStatus');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal state
  const [editUserId, setEditUserId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const { data: editUserDetails, isLoading: isEditUserLoading } = useUserById(editUserId);

  // Detect modal state from URL
  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');
  const isViewMode = modalMode === 'view';

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
      if (modalMode === 'edit' && ['name', 'emailAddress', 'cnic', 'cellNumber'].includes(String(field.name))) {
        return {
          ...field,
          readOnly: true,
        };
      }

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
  }, [cardStatusEnum, modalMode, userTypesEnum]);

  useEffect(() => {
    if (modalMode === 'edit' || modalMode === 'view') {
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

  const handleView = (user: any) => {
    saveTableRow('user', { id: user.id });
    router.push(`/user?modal=view&id=${encodeURIComponent(user.id)}`);
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
    try {
      const response = await createUser({
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

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to create user');
      }
    } catch (err: any) {
      throw err;
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
    };
  }, [editUserDetails, userTypesEnum]);

  const handleUpdateUser = async (data: ProfileFormData) => {
    if (!editUserId || !editUserDetails) throw new Error('User ID or details not found');
    try {
      const response = await updateUser({
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

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to update user');
      }
    } catch (err: any) {
      throw err;
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


  // Map API data to table data (server-paginated list)
  const filteredData = Array.isArray(data?.items)
    ? data.items.filter(user => !localRemovedIds.includes(String(user.id)))
        .map((user, idx) => ({
          sno: (currentPage - 1) * pageSize + idx + 1,
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
        }))
    : [];

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
      key: 'action',
      header: 'Action',
      render: (_, row) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} onClick={() => handleView(row)} />
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
        showAddButton={false}
        currentPage={currentPage}
        totalPages={totalListPages}
        onPageChange={setCurrentPage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        serverSidePagination
        loading={isLoading}
        emptyMessage={isLoading ? 'Loading users...' : 'No users found'}
      />

      {/* ADD USER MODAL */}
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New User"
      >
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
        isOpen={(modalMode === 'edit' || modalMode === 'view') && hasCheckedId}
        onClose={handleCloseModal}
        title={isViewMode ? 'View User' : 'Edit User'}
      >
        {isEditUserLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialValues ? (
          <CommonEntityForm
            key={editUserId}
            title={isViewMode ? 'Please review details below!' : 'Please update details below!'}
            onSave={handleUpdateUser}
            onCancel={handleCloseModal}
            fields={dynamicUserFields}
            initialValues={initialValues}
            saveButtonText="Update"
            isViewMode={isViewMode}
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
