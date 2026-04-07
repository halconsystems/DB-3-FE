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
  // Add S.No to each row
  const filteredData = userFamilyData
    .filter((family: UserFamily) => !localRemovedIds.includes(family.id))
    .map((row, idx) => ({ ...row, sno: idx + 1 }));

  const columns: Column<UserFamily>[] = [
    {
      key: 'sno',
      header: 'S.No',
    },
    { key: 'name', header: 'User Family Name' },
    { key: 'externalUserName', header: 'User Name' },
    { key: 'phoneNumber', header: 'Phone' },
    { key: 'cnic', header: 'CNIC No' },
    { key: 'relation', header: 'Relation' },
    { key: 'fatherOrHusbandName', header: 'Father/Husband Name' },
    { key: 'residentCardNumber', header: 'Resident Card No.' },
    { key: 'dateOfBirth', header: 'DOB' },
    { key: 'validFrom', header: 'Valid From' },
    {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value) => {
        // CardStatus enum mapping
        const statusMap: Record<number, { label: string; color: string; bg: string }> = {
          0: { label: 'Draft', color: '#666', bg: '#eee' },
          1: { label: 'Encoded', color: '#1976d2', bg: '#e3f2fd' },
          2: { label: 'Active', color: '#388e3c', bg: '#e8f5e9' },
          3: { label: 'Suspended', color: '#f9a825', bg: '#fffde7' },
          4: { label: 'Blacklisted', color: '#d32f2f', bg: '#ffebee' },
          5: { label: 'Replaced', color: '#c62828', bg: '#ffebee' },
          6: { label: 'Expired', color: '#d32f2f', bg: '#ffebee' },
        };
        const status = statusMap[value as number];
        if (!status) return '-';
        return (
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: 14,
            color: status.color,
            background: status.bg,
            minWidth: 70,
            textAlign: 'center',
          }}>{status.label}</span>
        );
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value) => {
        if (value === true || value === 1 || value === '1' || value === 'Active') {
          return (
            <span style={{
              display: 'inline-block',
              padding: '2px 14px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: 14,
              color: '#388e3c',
              background: '#e8f5e9',
              minWidth: 70,
              textAlign: 'center',
            }}>Active</span>
          );
        }
        return (
          <span style={{
            display: 'inline-block',
            padding: '2px 14px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: 14,
            color: '#d32f2f',
            background: '#ffebee',
            minWidth: 70,
            textAlign: 'center',
          }}>Inactive</span>
        );
      },
    },
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
