'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';

interface UserFamily {
  id: number;
  name: string;
  emailAddress: string;
  cellNumber: string;
  cnic: string;
  relation: string;
  fatherHusbandName: string;
  residentCardNo: string;
  dob: string;
  validFrom: string;
  validTo: string;
}

const sampleData: UserFamily[] = [
  { id: 1, name: 'Fatima Faraz', emailAddress: 'fatima@gmail.com', cellNumber: '0301-2346560', cnic: '12345-1234567-1', relation: 'Spouse', fatherHusbandName: 'Ahmed Faraz', residentCardNo: 'RC001', dob: '1990-05-15', validFrom: '2024-01-01', validTo: '2025-01-01' },
  { id: 2, name: 'Ali Ahmed', emailAddress: 'ali@gmail.com', cellNumber: '0301-2346561', cnic: '23456-2345678-2', relation: 'Child', fatherHusbandName: 'Ahmed Faraz', residentCardNo: 'RC002', dob: '2010-08-20', validFrom: '2024-01-01', validTo: '2025-01-01' },
  { id: 3, name: 'Ayesha Shahid', emailAddress: 'ayesha@gmail.com', cellNumber: '0301-2346580', cnic: '34567-3456789-3', relation: 'Spouse', fatherHusbandName: 'Shahid Husain', residentCardNo: 'RC003', dob: '1992-03-10', validFrom: '2024-06-01', validTo: '2025-06-01' },
];

export default function UserFamilyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<UserFamily | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/user-family/add-user-family');
  };

  const handleEdit = (family: UserFamily) => {
    saveTableRow('userFamily', family);
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
    try {
      // TODO: Call API to delete user family
      console.log('Delete User Family:', selectedFamily);
      setLocalRemovedIds((prev) => [...prev, selectedFamily.id]);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedFamily(null);
    }
  };

  const filteredData = sampleData.filter(family => !localRemovedIds.includes(family.id));

  const columns: Column<UserFamily>[] = [
    { key: 'name', header: 'Name' },
    { key: 'emailAddress', header: 'Email' },
    { key: 'cellNumber', header: 'Phone' },
    { key: 'cnic', header: 'CNIC No' },
    { key: 'relation', header: 'Relation' },
    { key: 'fatherHusbandName', header: 'Father/Husband Name' },
    { key: 'residentCardNo', header: 'Resident Card No.' },
    { key: 'dob', header: 'DOB' },
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
