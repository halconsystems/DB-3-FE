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
import { resolveTableTotalPages } from '../../lib/unwrapApiList';
import { luggageFields } from './fields';
import { EXTERNAL_USERS_SELECT_PAGE_SIZE, getAllExternalUsers } from '../../services/user.service';
import type { Luggage } from '../../services/luggage.service';
import { displayDash, tableCnic } from '../../lib/formatDisplayFields';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface LuggagePass {
  id: string;
  ser: number;
  name: string;
  userName?: string;
  vehicleInfo: string;
  visitPassType: string;
  validFrom: string;
  validTill: string;
  cnicNicopNo: string;
  status: boolean;
  activeStatus: string;
  passStatus: string;
}

type SelectedLuggageRow = Pick<Luggage, 'id'>;

// ============================================================================
// UTILITIES
// ============================================================================
const formatLuggagePassTypeLabel = (passType?: string | number): string => {
  if (passType === null || passType === undefined || passType === '') return '-';
  if (passType === 1 || passType === '1') return 'Day pass';
  if (passType === 2 || passType === '2') return 'Long Stay Pass';
  const p = String(passType).trim();
  const lower = p.toLowerCase();
  if (p === 'DayPass' || lower === 'daypass' || lower === 'day pass' || lower === 'day') {
    return 'Day pass';
  }
  if (
    p === 'LongStay' ||
    p === 'LongDay' ||
    lower === 'longstay' ||
    lower === 'long day' ||
    lower === 'long stay' ||
    lower.includes('long')
  ) {
    return 'Long Stay Pass';
  }
  return p ? p : '-';
};

const formatLuggageVehicleDisplay = (item: Luggage): string => {
  const plate = (item.vehicleLicensePlate ?? '').trim();
  const numRaw = item.vehicleLicenseNo;
  const numStr =
    numRaw !== null && numRaw !== undefined && String(numRaw).trim() !== ''
      ? String(numRaw).trim()
      : '';
  if (!plate && !numStr) return '-';
  if (plate && numStr) {
    if (plate.endsWith(`-${numStr}`)) return plate;
    return `${plate}-${numStr}`;
  }
  return plate || numStr || '-';
};

const deriveLuggagePassStatus = (item: Luggage): string => {
  if (item.isDeleted || !item.isActive) return 'Inactive';
  const end = new Date(item.validTo);
  if (Number.isNaN(end.getTime())) return 'Active';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  if (endDay < today) return 'Expired';
  return 'Active';
};

const splitLuggageVehicleForForm = (data: Luggage) => {
  const plate = (data.vehicleLicensePlate ?? '').trim();
  const numStr = data.vehicleLicenseNo != null ? String(data.vehicleLicenseNo) : '';
  if (plate.includes('-')) {
    const [first, second = ''] = plate.split('-');
    return {
      vehicleNo: (first || '').trim(),
      vehicleNo2: (second || '').trim() || numStr,
    };
  }
  return { vehicleNo: plate, vehicleNo2: numStr };
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

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState<SelectedLuggageRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError, error } = useLuggage(currentPage, pageSize);
  const totalListPages = resolveTableTotalPages(data, pageSize);
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
        const { items: users } = await getAllExternalUsers({
          pageNumber: 1,
          pageSize: EXTERNAL_USERS_SELECT_PAGE_SIZE,
        });
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
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to create luggage');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const initialLuggageValues = useMemo<ProfileFormData | null>(() => {
    if (!editLuggageDetails?.data) return null;
    const data = editLuggageDetails.data;
    const { vehicleNo, vehicleNo2 } = splitLuggageVehicleForForm(data);
    return {
      fullName: data.name || '',
      cnic: data.cnic || '',
      vehicleNo,
      vehicleNo2,
      licensePlate: formatLuggageVehicleDisplay(data),
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
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to update luggage');
      }
    } catch (err: any) {
      throw err;
    }
  };

  // -----------------------------------------------------------------------
  // Data Transformation
  // -----------------------------------------------------------------------
  const luggagePasses: LuggagePass[] = (data?.items || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item) => {
      const passStatus = deriveLuggagePassStatus(item);
      const isActiveRow = item.isActive && !item.isDeleted;
      return {
        ser: item.ser ?? 0,
        id: item.id,
        name: displayDash(item.name),
        userName: displayDash(item.externalUserName),
        vehicleInfo: formatLuggageVehicleDisplay(item),
        visitPassType: formatLuggagePassTypeLabel(item.luggagePassType),
        validFrom: formatDateDisplay(item.validFrom),
        validTill: formatDateDisplay(item.validTo),
        cnicNicopNo: item.cnic ?? '',
        status: isActiveRow,
        activeStatus: isActiveRow ? 'Active' : 'Inactive',
        passStatus,
      };
    });

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
    { key: 'ser', header: 'Ser' },
    { key: 'name', header: 'Name' },
    { key: 'vehicleInfo', header: 'Vehicle No' },
    { key: 'visitPassType', header: 'Luggage Pass Type' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTill', header: 'Valid Till' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.', render: (v: string) => tableCnic(v) },
    {
      key: 'passStatus',
      header: 'Pass Status',
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'activeStatus',
      header: 'Status',
      render: (_, row) => <StatusBadge type="activeInactive" value={row.status} />,
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
        totalPages={totalListPages}
        onPageChange={setCurrentPage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        serverSidePagination
        getRowStatus={(row) => {
          if (!row.status || row.passStatus === 'Expired') return 'Inactive';
          return 'Active';
        }}
        columnFilterKeys={['passStatus', 'visitPassType']}
        enableSorting={false}
        enableFiltering={true}
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