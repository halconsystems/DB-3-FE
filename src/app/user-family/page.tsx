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
import { useEnumMetadata } from '../../hooks/metadata/useEnumMetadata';
import { resolveTableTotalPages } from '../../lib/unwrapApiList';
import { formatCardNumberDisplay } from '../../lib/formatCardNumber';
import { displayDash, tableCnic, tablePhone, tableCardNumber } from '../../lib/formatDisplayFields';
import { normalizeNumericEnum } from '../../lib/statusMapping';

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

export default function UserFamilyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<UserFamily | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: userFamilyPage, isLoading } = useUserFamily(currentPage, pageSize);
  const userFamilyData = userFamilyPage?.items ?? [];
  const totalListPages = resolveTableTotalPages(userFamilyPage, pageSize);
  const removeUserFamilyMutation = useRemoveUserFamily();
  const { mutateAsync: createUserFamily } = useCreateUserFamily();
  const { mutateAsync: updateUserFamily } = useUpdateUserFamily();
  const { data: relationEnum, isLoading: isRelationEnumLoading } = useEnumMetadata('RelationUserFamily');
  const { data: cardStatusEnum, isLoading: isCardStatusEnumLoading } = useEnumMetadata('CardStatus');

  // Modal state
  const [editFamilyId, setEditFamilyId] = useState<string>('');
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const { data: editFamilyDetails, isLoading: isEditFamilyLoading } = useUserFamilyById(editFamilyId);

  // Detect modal state from URL
  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');
  const isViewMode = modalMode === 'view';

  useEffect(() => {
    if (modalMode === 'edit' || modalMode === 'view') {
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

  const handleView = (family: any) => {
    saveTableRow('userFamily', { id: family.id });
    router.push(`/user-family?modal=view&id=${encodeURIComponent(family.id)}`);
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

  const toRelationValue = (value?: number | string | null) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  const toRelationApiValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === '') return '0';
    return String(value).trim();
  };

  const toCardStatusValue = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined || value === '') return '';
    return String(value).trim();
  };

  const toCardStatusApiValue = (value?: string | number | boolean | null, fallback?: string | number | boolean | null) => {
    const resolved = value ?? fallback;
    if (resolved === null || resolved === undefined || resolved === '') {
      return 0;
    }

    const numeric = Number(resolved);
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const dynamicUserFamilyFields = useMemo(() => {
    const relationOptions = [{ value: '', label: 'Select Relation' }];
    const cardStatusOptions = [{ value: '', label: 'Select Tag Status' }];

    if (relationEnum?.members) {
      relationEnum.members.forEach((member) => {
        relationOptions.push({
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

    return userFamilyFields.map((field) => {
      if (field.name === 'relation') {
        return {
          ...field,
          options: relationOptions,
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
  }, [cardStatusEnum, relationEnum]);

  const modalFields = useMemo(
    () => (isViewMode ? dynamicUserFamilyFields.filter((field) => field.type !== 'statusSwitch') : dynamicUserFamilyFields),
    [dynamicUserFamilyFields, isViewMode]
  );

  const cardStatusFilterOptions = useMemo(
    () =>
      (cardStatusEnum?.members ?? []).map((m) => ({
        value: String(m.value),
        label: m.name,
      })),
    [cardStatusEnum]
  );

  const handleAddFamily = async (data: ProfileFormData) => {
    try {
      const response = await createUserFamily({
        ser: 0,
        name: data.name || '',
        residentCardNumber: data.residentCardNo || null,
        profilePicture: null,
        cnic: data.cnic || '',
        phoneNumber: data.cellNumber || '',
        fatherOrHusbandName: data.fatherHusbandName || '',
        relation: toRelationApiValue(data.relation),
        dateOfBirth: toIsoDate(data.dob),
        validTo: toIsoDate(data.validTo),
        validFrom: toIsoDate(data.validFrom),
        cardStatus: toCardStatusApiValue(data.cardStatus),
        externalUserId: '',
        createdBy: '',
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to create user family');
      }
    } catch (err: any) {
      throw err;
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
      residentCardNo: editFamilyDetails.residentCardNumber
        ? formatCardNumberDisplay(editFamilyDetails.residentCardNumber)
        : '',
      dob: toDateInputValue(editFamilyDetails.dateOfBirth),
      validFrom: toDateInputValue(editFamilyDetails.validFrom),
      validTo: toDateInputValue(editFamilyDetails.validTo),
      cardStatus: toCardStatusValue(editFamilyDetails.cardStatus),
    };
  }, [editFamilyDetails]);

  const handleUpdateFamily = async (data: ProfileFormData) => {
    if (!editFamilyId || !editFamilyDetails) throw new Error('Family ID or details not found');
    try {
      const response = await updateUserFamily({
        id: editFamilyId,
        ser: editFamilyDetails.ser || 0,
        name: data.name || editFamilyDetails.name || '',
        residentCardNumber: data.residentCardNo || editFamilyDetails.residentCardNumber,
        profilePicture: null,
        cnic: data.cnic || editFamilyDetails.cnic || '',
        phoneNumber: data.cellNumber || editFamilyDetails.phoneNumber || '',
        fatherOrHusbandName: data.fatherHusbandName || editFamilyDetails.fatherOrHusbandName || '',
        relation: toRelationApiValue(data.relation ?? editFamilyDetails.relation),
        dateOfBirth: toIsoDate(data.dob || editFamilyDetails.dateOfBirth),
        validTo: toIsoDate(data.validTo || editFamilyDetails.validTo),
        validFrom: toIsoDate(data.validFrom || editFamilyDetails.validFrom),
        cardStatus: toCardStatusApiValue(data.cardStatus, editFamilyDetails.cardStatus),
        lastModifiedBy: 'system',
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to update user family');
      }
    } catch (err: any) {
      throw err;
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
    .map((family) => ({
      ser: family.ser ?? 0,
      id: family.id,
      name: displayDash(family.name),
      externalUserName: displayDash(family.externalUserName),
      phoneNumber: family.phoneNumber ?? '',
      cnic: family.cnic ?? '',
      relation: family.relation || '',
      fatherOrHusbandName: displayDash(family.fatherOrHusbandName),
      residentCardNumber: family.residentCardNumber ?? '',
      dateOfBirth: family.dateOfBirth || '',
      validFrom: family.validFrom || '',
      validTo: family.validTo || '',
      cardStatus: normalizeNumericEnum(family.cardStatus),
      isActive: family.isActive,
    }));

  const columns: Column<any>[] = [
    {
      key: 'ser',
      header: 'Ser',
    },
    { key: 'name', header: 'User Family Name' },
    { key: 'externalUserName', header: 'User Name' },
    { key: 'phoneNumber', header: 'Phone', render: (v: string) => tablePhone(v) },
    { key: 'cnic', header: 'CNIC No', render: (v: string) => tableCnic(v) },
    { key: 'fatherOrHusbandName', header: 'Father/Husband Name' },
    { key: 'relation', header: 'Relation' },
    {
      key: 'residentCardNumber',
      header: 'Resident Card No.',
      render: (value: string) => tableCardNumber(value),
    },
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
      header: 'Tag Status',
      render: (value) => <StatusBadge type="cardStatus" value={value} />,
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
            <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} onClick={() => handleView(row)} />
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
        showAddButton={false}
        currentPage={currentPage}
        totalPages={totalListPages}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        serverSidePagination
        enableFiltering={true}
        columnFilterKeys={['category', 'subCategory', 'cardStatus']}
        columnFilterLabels={{ category: 'Category', subCategory: 'Sub Category', cardStatus: 'Tag Status' }}
        columnFilterStaticOptions={{ cardStatus: cardStatusFilterOptions }}
        loading={isLoading}
        emptyMessage={isLoading ? 'Loading...' : 'No user family data found.'}
        onPageChange={setCurrentPage}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New User Family"
      >
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddFamily}
          onCancel={handleCloseModal}
          fields={dynamicUserFamilyFields}
          saveButtonText="Create"
          loading={isRelationEnumLoading || isCardStatusEnumLoading || isLoading}
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={(modalMode === 'edit' || modalMode === 'view') && hasCheckedId}
        onClose={handleCloseModal}
        title={isViewMode ? 'View User Family' : 'Edit User Family'}
      >
        {isEditFamilyLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialValues ? (
          <CommonEntityForm
            key={editFamilyId}
            title={isViewMode ? 'Please review details below!' : 'Please update details below!'}
            onSave={handleUpdateFamily}
            onCancel={handleCloseModal}
            fields={modalFields}
            initialValues={initialValues}
            saveButtonText="Update"
            isViewMode={isViewMode}
            loading={isEditFamilyLoading || isRelationEnumLoading || isCardStatusEnumLoading}
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
