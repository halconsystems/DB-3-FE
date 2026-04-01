'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';

interface User {
  id: number;
  name: string;
  emailAddress: string;
  cellNumber: string;
  cnic: string;
  userType: string;
  rfidCardNo: string;
  cardIssueDate?: string;
  cardExpiryDate?: string;
  cardStatus: 'Active' | 'Inactive';
  status: 'Active' | 'Inactive';
}

const sampleData: User[] = [
  { id: 1, name: 'Ahmed Faraz', emailAddress: 'ahmed@gmail.com', cellNumber: '0301-2346540', cnic: '12345-1234567-1', userType: 'Admin', rfidCardNo: '001234', cardIssueDate: '2024-01-01', cardExpiryDate: '2025-01-01', cardStatus: 'Active', status: 'Active' },
  { id: 2, name: 'Shahid Husain', emailAddress: 'shahid@gmail.com', cellNumber: '0301-2346550', cnic: '23456-2345678-2', userType: 'User', rfidCardNo: '001235', cardIssueDate: '2023-06-01', cardExpiryDate: '2024-06-01', cardStatus: 'Inactive', status: 'Inactive' },
  { id: 3, name: 'Mustafa Javaid', emailAddress: 'mustafa@gmail.com', cellNumber: '0301-2346530', cnic: '34567-3456789-3', userType: 'User', rfidCardNo: '001236', cardIssueDate: '2024-02-01', cardExpiryDate: '2025-02-01', cardStatus: 'Active', status: 'Active' },
];

export default function UserPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/user/add-user');
  };

  const handleEdit = (user: User) => {
    saveTableRow('user', user);
    router.push('/user/edit-user');
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) {
      return;
    }

    setIsDeleting(true);
    try {
      // TODO: Call API to delete user
      console.log('Delete User:', selectedUser);
      setLocalRemovedIds((prev) => [...prev, selectedUser.id]);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const filteredData = sampleData.filter(user => !localRemovedIds.includes(user.id));

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'emailAddress', header: 'Email' },
    { key: 'cellNumber', header: 'Phone' },
    { key: 'cnic', header: 'CNIC No.' },
    { key: 'userType', header: 'User Type' },
    { key: 'rfidCardNo', header: 'RFID Card No.' },
    { key: 'cardIssueDate', header: 'Card Issue Date' },
    { key: 'cardExpiryDate', header: 'Card Expiry Date' },
    {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<User>
        columns={columns}
        data={filteredData}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
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
