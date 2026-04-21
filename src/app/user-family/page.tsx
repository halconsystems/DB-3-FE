'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';
import { userFamilyFields } from './fields';

import { useUserFamily } from '../../hooks/user-family/useUserFamily';
import { useRemoveUserFamily } from '../../hooks/user-family/useRemoveUserFamily';
import { useUserFamilyById } from '../../hooks/user-family/useUserFamilyById';
import { useCreateUserFamily } from '../../hooks/user-family/useCreateUserFamily';
import { useUpdateUserFamily } from '../../hooks/user-family/useUpdateUserFamily';
import type { UserFamily } from '../../services/user-family.service';

export default function UserFamilyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<UserFamily | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: userFamilyData = [], isLoading } = useUserFamily();
  const removeUserFamilyMutation = useRemoveUserFamily();
  const { mutateAsync: createUserFamily } = useCreateUserFamily();
  const { mutateAsync: updateUserFamily } = useUpdateUserFamily();

  // Modal state
  const [editFamilyId, setEditFamilyId] = useState<string>('');
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const { data: editFamilyDetails, isLoading: isEditFamilyLoading } = useUserFamilyById(editFamilyId);

  // Detect modal state from URL
  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditFamilyId(modalId || '');
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('userFamily');
        if (selected?.id) {
          setEditFamilyId(String(selected.id));
          clearTableRow('userFamily');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleAddNew = () => {
    router.push('/user-family?modal=add');
  };

  const handleEdit = (family: any) => {
    saveTableRow('userFamily', { id: family.id });
    router.push(`/user-family?modal=edit&id=${encodeURIComponent(family.id)}`);
  };

  const handleCloseModal = () => {
    setEditFamilyId('');
    setHasCheckedId(false);
    setFormError('');
    router.push('/user-family');
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

  const relationIdByLabel: Record<string, number> = {
    spouse: 0,
    child: 1,
    parent: 2,
    sibling: 3,
  };

  const relationLabelById: Record<number, string> = {
    0: 'spouse',
    1: 'child',
    2: 'parent',
    3: 'sibling',
  };

  const toRelationValue = (value?: number | string | null) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    return relationLabelById[value] ?? '';
  };

  const toRelationNumber = (value?: string | number | null) => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    if (value in relationIdByLabel) return relationIdByLabel[value];
    const numeric = Number(value);
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const handleAddFamily = async (data: ProfileFormData) => {
    setFormError('');
    try {
      await createUserFamily({
        ser: 0,
        name: data.name || '',
        residentCardNumber: data.residentCardNo || null,
        profilePicture: null,
        cnic: data.cnic || '',
        phoneNumber: data.cellNumber || '',
        fatherOrHusbandName: data.fatherHusbandName || '',
        relation: toRelationNumber(data.relation),
        dateOfBirth: toIsoDate(data.dob),
        validTo: toIsoDate(data.validTo),
        validFrom: toIsoDate(data.validFrom),
        cardStatus: null,
        externalUserId: '',
        createdBy: '',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create user family';
      setFormError(message);
    }
  };

  const initialValues = useMemo<ProfileFormData | null>(() => {
    if (!editFamilyDetails) return null;
    return {
      name: editFamilyDetails.name || '',
      cellNumber: editFamilyDetails.phoneNumber || '',
      cnic: editFamilyDetails.cnic || '',
      relation: toRelationValue(editFamilyDetails.relation),
      fatherHusbandName: editFamilyDetails.fatherOrHusbandName || '',
      residentCardNo: editFamilyDetails.residentCardNumber || '',
      dob: toDateInputValue(editFamilyDetails.dateOfBirth),
      validFrom: toDateInputValue(editFamilyDetails.validFrom),
      validTo: toDateInputValue(editFamilyDetails.validTo),
    };
  }, [editFamilyDetails]);

  const handleUpdateFamily = async (data: ProfileFormData) => {
    if (!editFamilyId || !editFamilyDetails) return;
    setFormError('');
    try {
      await updateUserFamily({
        id: editFamilyId,
        ser: editFamilyDetails.ser || 0,
        name: data.name || editFamilyDetails.name || '',
        residentCardNumber: data.residentCardNo || editFamilyDetails.residentCardNumber,
        profilePicture: null,
        cnic: data.cnic || editFamilyDetails.cnic || '',
        phoneNumber: data.cellNumber || editFamilyDetails.phoneNumber || '',
        fatherOrHusbandName: data.fatherHusbandName || editFamilyDetails.fatherOrHusbandName || '',
        relation: toRelationNumber(data.relation) ?? editFamilyDetails.relation,
        dateOfBirth: toIsoDate(data.dob || editFamilyDetails.dateOfBirth),
        validTo: toIsoDate(data.validTo || editFamilyDetails.validTo),
        validFrom: toIsoDate(data.validFrom || editFamilyDetails.validFrom),
        cardStatus: editFamilyDetails.cardStatus,
        lastModifiedBy: 'system',
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update user family';
      setFormError(message);
    }
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

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New User Family"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddFamily}
          onCancel={handleCloseModal}
          fields={userFamilyFields}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit User Family"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {isEditFamilyLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialValues ? (
          <CommonEntityForm
            key={editFamilyId}
            title="Please update details below!"
            onSave={handleUpdateFamily}
            onCancel={handleCloseModal}
            fields={userFamilyFields}
            initialValues={initialValues}
            saveButtonText="Update"
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading user family details</div>
        )}
      </FormModal>

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
