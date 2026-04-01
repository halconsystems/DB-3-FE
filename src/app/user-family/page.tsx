'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';

import { useUserFamily } from '../../hooks/user-family/useUserFamily';
import { useRemoveUserFamily } from '../../hooks/user-family/useRemoveUserFamily';
import type { UserFamily } from '../../services/user-family.service';

export default function UserFamilyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<UserFamily | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { data: userFamilyData = [], isLoading } = useUserFamily();
  const removeUserFamilyMutation = useRemoveUserFamily();


  const handleAddNew = () => {
    router.push('/user-family/add-user-family');
  };


  const handleEdit = (family: UserFamily) => {
    saveTableRow('userFamily', family);
    console.log('Edit User Family:', family);
    router.push('/user-family/edit-user-family');
  };


  const handleDelete = (family: UserFamily) => {
    setSelectedFamily(family);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFamily) {
      return;
    }
    setIsDeleting(true);
    removeUserFamilyMutation.mutate(selectedFamily.id, {
      onSuccess: () => {
        setLocalRemovedIds((prev) => [...prev, selectedFamily.id]);
      },
      onError: (error) => {
        console.error('Delete failed:', error);
      },
      onSettled: () => {
        setIsDeleting(false);
        setDeleteModalOpen(false);
        setSelectedFamily(null);
      },
    });
  };
  const filteredData = userFamilyData.filter((family: UserFamily) => !localRemovedIds.includes(family.id));

  const columns: Column<UserFamily>[] = [
    { key: 'name', header: 'Name' },
    { key: 'phoneNumber', header: 'Phone' },
    { key: 'cnic', header: 'CNIC No' },
    { key: 'relation', header: 'Relation' },
    { key: 'fatherOrHusbandName', header: 'Father/Husband Name' },
    { key: 'residentCardNumber', header: 'Resident Card No.' },
    { key: 'dateOfBirth', header: 'DOB' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTo', header: 'Valid To' },
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
    <DashboardLayout pageTitle="User Family">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<UserFamily>
        columns={columns}
        data={filteredData}
        showAddButton={false}
        currentPage={currentPage}
        loading={isLoading}
        emptyMessage={isLoading ? 'Loading...' : 'No user family data found.'}
        onPageChange={setCurrentPage}
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User Family"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this user family member? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}
