'use client';

// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column, StatusBadge } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { useLuggage } from '../../hooks/luggage/useLuggage';
import { useLuggageById } from '../../hooks/luggage/useLuggageById';
import { useCreateLuggage } from '../../hooks/luggage/useCreateLuggage';
import { useUpdateLuggage } from '../../hooks/luggage/useUpdateLuggage';
import { useDeleteLuggage } from '../../hooks/luggage/useDeleteLuggage';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';
import { luggageFields } from './fields';
import { getAllExternalUsers } from '../../services/user.service';
import type { Luggage } from '../../services/luggage.service';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface LuggagePass {
  id: string;
  name: string;
  userName?: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  status: boolean;
  sno?: number;
}

type SelectedLuggageRow = Pick<Luggage, 'id'>;

// ============================================================================
// UTILITIES
// ============================================================================
/**
 * Convert pass type to display label
 */
const toLuggagePassTypeLabel = (passType?: string | number): string => {
  if (passType === 'DayPass' || passType === 1) return 'Day Pass';
  if (passType === 'LongDay' || passType === 2) return 'Long Stay';
  return '-';
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

// ============================================================================
// COMPONENT
// ============================================================================
export default function LuggagePage() {
  // -----------------------------------------------------------------------
  // Hooks
  // -----------------------------------------------------------------------
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState<SelectedLuggageRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError, error } = useLuggage();
  const { mutateAsync: deleteLuggage, isPending: isDeleting } = useDeleteLuggage();
  const { mutateAsync: createLuggage } = useCreateLuggage();
  const { mutateAsync: updateLuggage } = useUpdateLuggage();

  // Modal state
  const [editLuggageId, setEditLuggageId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const { data: editLuggageDetails, isLoading: isEditLuggageLoading } = useLuggageById(editLuggageId);

  // Detect modal state from URL
  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');
  const isViewMode = modalMode === 'view';

  useEffect(() => {
    if (modalMode === 'edit' || modalMode === 'view') {
      if (modalId) {
        setEditLuggageId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('luggage');
        if (selected?.id) {
          setEditLuggageId(String(selected.id));
          clearTableRow('luggage');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  // -----------------------------------------------------------------------
  // Data Transformation Utilities
  // -----------------------------------------------------------------------
  const toDateInputValue = (value?: string) => {
    if (!value) return '';
    const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : '';
  };

  const toIsoDate = (value?: string) => {
    if (!value) return '';
    const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : '';
  };

  const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
    const firstPart = (vehicleNo ?? '').trim();
    const secondPart = (vehicleNo2 ?? '').trim();
    if (!firstPart && !secondPart) return '';
    return `${firstPart}-${secondPart}`;
  };

  const toLuggagePassType = (quickPick?: string): number | null => {
    if (quickPick === 'LongStay') return 2;
    if (quickPick === 'DayPass') return 1;
    return null;
  };

  const toQuickPick = (passType?: string | number): string => {
    if (passType === 2) return 'LongStay';
    if (passType === 1) return 'DayPass';
    return 'DayPass';
  };

  const handleCloseModal = () => {
    setEditLuggageId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/luggage');
  };

  // -----------------------------------------------------------------------
  // Form Handlers
  // -----------------------------------------------------------------------
  const handleAddLuggage = async (data: ProfileFormData) => {
    try {
      const luggagePassType = toLuggagePassType(data.quickPick);
      if (luggagePassType === null) {
        throw new Error('Please select a Quick Pick option.');
      }

      let externalUserId = 'system';
      try {
        const users = await getAllExternalUsers();
        const firstValid = users.find((u: any) => u.id);
        if (firstValid && firstValid.id) {
          externalUserId = firstValid.id;
        }
      } catch {
        externalUserId = 'system';
      }

      const response = await createLuggage({
        name: data.fullName || '',
        cnic: data.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
        vehicleLicenseNo: Number(data.vehicleNo2 || 0),
        luggagePassType: luggagePassType || 1,
        validFrom: toIsoDate(data.fromDate),
        validTo: toIsoDate(data.toDate),
        description: data.description || '',
        externalUserId,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.message || 'Failed to create luggage');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const initialLuggageValues = useMemo<ProfileFormData | null>(() => {
    if (!editLuggageDetails?.data) return null;
    const data = editLuggageDetails.data;
    return {
      fullName: data.name || '',
      cnic: data.cnic || '',
      vehicleNo: data.vehicleLicensePlate?.split('-')[0] || '',
      vehicleNo2: data.vehicleLicensePlate?.split('-')[1] || '',
      licensePlate: data.vehicleLicensePlate || '',
      qrReference: data.qrCode || '',
      status: data.isActive ? 'active' : 'inactive',
      quickPick: toQuickPick(data.luggagePassType),
      fromDate: toDateInputValue(data.validFrom),
      toDate: toDateInputValue(data.validTo),
      description: data.description || '',
      isActive: data.isActive,
    };
  }, [editLuggageDetails]);

  const handleUpdateLuggage = async (formData: ProfileFormData) => {
    if (!editLuggageId || !editLuggageDetails?.data) throw new Error('Luggage ID or details not found');
    try {
      const luggageData = editLuggageDetails.data;
      const luggagePassType = toLuggagePassType(formData.quickPick);

      const response = await updateLuggage({
        id: editLuggageId,
        name: formData.fullName || luggageData.name || '',
        cnic: formData.cnic || luggageData.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(formData.vehicleNo, formData.vehicleNo2),
        vehicleLicenseNo: Number(formData.vehicleNo2 || luggageData.vehicleLicenseNo || 0),
        luggagePassType: luggagePassType || luggageData.luggagePassType || 1,
        validFrom: toIsoDate(formData.fromDate),
        validTo: toIsoDate(formData.toDate),
        description: formData.description || luggageData.description || '',
        externalUserId: luggageData.externalUserId,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.message || 'Failed to update luggage');
      }
    } catch (err: any) {
      throw err;
    }
  };

  // -----------------------------------------------------------------------
  // Data Transformation
  // -----------------------------------------------------------------------
  const luggagePasses: LuggagePass[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item, idx) => ({
      sno: idx + 1,
      id: item.id,
      name: item.name,
      userName: item.externalUserName || '-',
      vehicleInfo: item.vehicleLicensePlate || '-',
      visitDetail: toLuggagePassTypeLabel(item.luggagePassType),
      validity: `${formatDateDisplay(item.validFrom)} - ${formatDateDisplay(item.validTo)}`,
      cnicNicopNo: item.cnic,
      status: item.isActive && !item.isDeleted,
    }));

  // -----------------------------------------------------------------------
  // Event Handlers
  // -----------------------------------------------------------------------
  const handleAddNew = () => {
    router.push('/luggage?modal=add');
  };

  const handleEdit = (luggage: LuggagePass) => {
    saveTableRow('luggage', luggage);
    router.push(`/luggage?modal=edit&id=${encodeURIComponent(luggage.id)}`);
  };

  const handleView = (luggage: LuggagePass) => {
    saveTableRow('luggage', luggage);
    router.push(`/luggage?modal=view&id=${encodeURIComponent(luggage.id)}`);
  };

  const handleDelete = (luggage: SelectedLuggageRow) => {
    setSelectedLuggage(luggage);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLuggage) {
      return;
    }

    try {
      const response = await deleteLuggage({ id: selectedLuggage.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedLuggage.id]);
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

    setDeleteModalOpen(false);
    setSelectedLuggage(null);
  };

  // -----------------------------------------------------------------------
  // Table Columns Configuration
  // -----------------------------------------------------------------------
  const columns: Column<LuggagePass>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'validity', header: 'Validity' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    {
      key: 'status',
      header: 'Status',
      render: (value: boolean) => <StatusBadge type="activeInactive" value={value} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <CircularButton
            imagePath="/icons/View.svg"
            imageAlt="View"
            width={32}
            height={32}
            onClick={() => handleView(row)}
          />
        </div>
      ),
    },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <DashboardLayout pageTitle="Luggage">
      {/* Data Table */}
      <DataTable<LuggagePass>
        columns={columns}
        data={luggagePasses}
        loading={isLoading}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => (row.status ? 'Active' : 'Inactive')}
        error={
          isError
            ? `Failed to load luggage: ${error instanceof Error ? error.message : 'Unknown error'}`
            : undefined
        }
      />

      {/* ADD LUGGAGE MODAL */}
      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Luggage"
      >
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddLuggage}
          onCancel={handleCloseModal}
          fields={luggageFields.filter((f) => f.name !== 'description')}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

      {/* EDIT LUGGAGE MODAL */}
      <FormModal
        isOpen={(modalMode === 'edit' || modalMode === 'view') && hasCheckedId}
        onClose={handleCloseModal}
        title={isViewMode ? 'View Luggage' : 'Edit Luggage'}
      >
        {isEditLuggageLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialLuggageValues ? (
          <CommonEntityForm
            key={editLuggageId}
            title={isViewMode ? 'Please review details below!' : 'Please update details below!'}
            onSave={handleUpdateLuggage}
            onCancel={handleCloseModal}
            fields={luggageFields.filter((f) => f.name !== 'description')}
            initialValues={initialLuggageValues}
            saveButtonText="Update"
            isViewMode={isViewMode}
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading luggage details</div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Luggage Record"
        message={
          isDeleting
            ? 'Deleting...'
            : 'Are you sure you want to delete this luggage record? This action cannot be undone.'
        }
      />
    </DashboardLayout>
  );
}