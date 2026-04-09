'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';

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


  const handleEdit = (family: any) => {
    saveTableRow('userFamily', family);
    console.log('Edit User Family:', family);
    router.push(`/user-family/edit-user-family?id=${encodeURIComponent(family.id)}`);
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

  const filteredData = userFamilyData
    .filter((family: UserFamily) => !localRemovedIds.includes(family.id))
    .map((family, idx) => ({
      sno: idx + 1,
      id: family.id,
      name: family.name || '',
      externalUserName: family.externalUserName || '',
      phoneNumber: family.phoneNumber || '',
      cnic: family.cnic || '',
      relation: family.relation || '',
      fatherOrHusbandName: family.fatherOrHusbandName || '',
      residentCardNumber: family.residentCardNumber || '',
      dateOfBirth: family.dateOfBirth || '',
      validFrom: family.validFrom || '',
      validTo: family.validTo || '',
      cardStatus: family.cardStatus,
      isActive: family.isActive,
    }));

  const columns: Column<any>[] = [
    {
      key: 'sno',
      header: 'S.No',
    },
    { key: 'name', header: 'User Family Name' },
    { key: 'externalUserName', header: 'User Name' },
    { key: 'phoneNumber', header: 'Phone' },
    { key: 'cnic', header: 'CNIC No' },
    { key: 'fatherOrHusbandName', header: 'Father/Husband Name' },
    { key: 'relation', header: 'Relation' },
    { key: 'residentCardNumber', header: 'Resident Card No.' },
    {
      key: 'dateOfBirth',
      header: 'DOB',
      render: (value) => formatDateDisplay(value),
    },
    {
      key: 'validFrom',
      header: 'Valid From',
      render: (value) => formatDateDisplay(value),
    },
    {
      key: 'validTo',
      header: 'Valid To',
      render: (value) => formatDateDisplay(value),
    },
    {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value) => <StatusBadge type="userFamily" value={value} />,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value) => <StatusBadge type="activeInactive" value={value} />,
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
    <DashboardLayout pageTitle="User Family">
      <DataTable
        columns={columns}
        data={filteredData}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
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
