'use client';
import { useState } from 'react';
import { useRemoveUser } from '../../hooks/user/useRemoveUser';
import { useExternalUsers } from '../../hooks/user/useUsers';
import { useUserById } from '../../hooks/user/useUserById';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';


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
  const removeUserMutation = useRemoveUser();
  const { data, isLoading } = useExternalUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  // Fetch full user details by ID when a user is selected (for details, edit, etc.)
  const { data: selectedUserDetails, isLoading: isUserDetailsLoading } = useUserById(selectedUser ? String(selectedUser.id) : undefined);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/user/add-user');
  };

  const handleEdit = (user: any) => {
    // Optionally, you can use selectedUserDetails here for more complete info
    saveTableRow('user', user);
    router.push(`/user/edit-user?id=${encodeURIComponent(user.id)}`);
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

      {/* Example usage of useUserById hook for selected user */}
      {selectedUser && (
        <div style={{ marginTop: 24 }}>
          <h4>User Details (from useUserById):</h4>
          {isUserDetailsLoading ? (
            <div>Loading user details...</div>
          ) : selectedUserDetails ? (
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>{JSON.stringify(selectedUserDetails, null, 2)}</pre>
          ) : (
            <div>No details found.</div>
          )}
        </div>
      )}

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
