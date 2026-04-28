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
import { useVehicles } from '../../hooks/vehicle/useVehicles';
import { useVehicleById } from '../../hooks/vehicle/useVehicleById';
import { useCreateVehicle } from '../../hooks/vehicle/useCreateVehicle';
import { useUpdateVehicle } from '../../hooks/vehicle/useUpdateVehicle';
import { useDeleteVehicle } from '../../hooks/vehicle/useDeleteVehicle';
import { formatDateDisplay } from '../../lib/dateUtils';
import { vehicleFields } from './fields';
import { getEnumMetadata } from '../../services/enum.service';
import { getAllExternalUsers } from '../../services/user.service';
import type { ExternalVehicle as BaseExternalVehicle } from '../../services/vehicle.service';

// Extend ExternalVehicle to include externalUserName
interface ExternalVehicle extends BaseExternalVehicle {
  externalUserName?: string;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleETagId: string;
  eTagType: string;
  issueDate: string;
  expiryDate: string;
  tagStatus: number | null;
  ownership: string;
  make: string;
  model: string;
  year: string;
  color: string;
  externalUserName?: string;
  sno?: number;
}

type SelectedVehicleRow = Pick<ExternalVehicle, 'id'>;

const formatLicensePlate = (license?: string | null, licenseNo?: number | null) => {
  const first = (license || '').trim();
  const second = licenseNo === null || licenseNo === undefined ? '' : String(licenseNo);

  if (!first && !second) {
    return '-';
  }

  if (!second) {
    return first || '-';
  }

  if (first.includes('-')) {
    return first;
  }

  return `${first}-${second}`;
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

export default function VehiclePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicleRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [editVehicleId, setEditVehicleId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);

  const { data, isLoading, isError, error } = useVehicles();
  const { data: editVehicleDetails, isLoading: isEditVehicleLoading } = useVehicleById(editVehicleId);
  const { mutateAsync: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();
  const { mutateAsync: createVehicle } = useCreateVehicle();
  const { mutateAsync: updateVehicle } = useUpdateVehicle();

  const [loadingEnums, setLoadingEnums] = useState(true);
  const [enumFields, setEnumFields] = useState(vehicleFields);
  const [formError, setFormError] = useState('');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditVehicleId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('vehicle');
        if (selected?.id) {
          setEditVehicleId(String(selected.id));
          clearTableRow('vehicle');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  useEffect(() => {
    async function fetchEnumOptions() {
      try {
        const [colorRes, tagStatusRes] = await Promise.all([
          getEnumMetadata({ EnumType: 'VehicleColor' }),
          getEnumMetadata({ EnumType: 'TagStatus' })
        ]);
        const colorEnum = colorRes.data.enums.find((e: any) => e.name === 'VehicleColor');
        const tagStatusEnum = tagStatusRes.data.enums.find((e: any) => e.name === 'TagStatus');
        const colorOptions = colorEnum?.members.map((m: any) => ({ value: m.value.toString(), label: m.name })) || [];
        const tagStatusOptions = tagStatusEnum?.members.map((m: any) => ({ value: m.value.toString(), label: m.name })) || [];
        setEnumFields((prevFields) =>
          prevFields.map((f) => {
            if (f.name === 'color') {
              return { ...f, type: 'select', options: colorOptions };
            }
            if (f.name === 'eTagStatus') {
              return { ...f, type: 'select', options: tagStatusOptions };
            }
            return f;
          })
        );
      } catch {
        // fallback: leave as text if API fails
      } finally {
        setLoadingEnums(false);
      }
    }
    fetchEnumOptions();
  }, []);

  console.log('VehiclePage render with data:', data, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

  const vehicles: Vehicle[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item: ExternalVehicle, idx) => ({
      sno: idx + 1,
      id: item.id,
      licensePlate: formatLicensePlate(item.license, item.licenseNo),
      vehicleETagId: item.eTagId || '-',
      eTagType: item.eTagId || '-',
      issueDate: formatDateDisplay(item.validFrom),
      expiryDate: formatDateDisplay(item.validTo),
      ownership: item.externalUserId || '-',
      externalUserName: item.externalUserName || '-',
      make: item.make || '-',
      model: item.model || '-',
      year: item.year || '-',
      color: item.color || '-',
      tagStatus: item.tagStatus,
    }));


  const handleAddNew = () => {
    router.push('/vehicle?modal=add');
  };

  const handleEdit = (vehicle: Vehicle) => {
    saveTableRow('vehicle', { id: vehicle.id });
    router.push(`/vehicle?modal=edit&id=${encodeURIComponent(vehicle.id)}`);
  };

  const handleCloseModal = () => {
    setEditVehicleId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/vehicle');
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const toIsoDate = (value?: string) => {
    if (!value) return new Date().toISOString();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  };

  const splitLicense = (license?: string | null) => {
    const normalized = (license || '').trim();
    if (!normalized) return { vehicleNo: '', vehicleNo2: '' };
    const [firstPart, secondPart = ''] = normalized.split('-');
    return { vehicleNo: firstPart || '', vehicleNo2: secondPart || '' };
  };

  const handleAddVehicle = async (data: ProfileFormData) => {
    try {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let createdBy = 'system';
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          createdBy = user?.fullName || user?.name || user?.email || 'system';
        } catch {
          createdBy = 'system';
        }
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

      const response = await createVehicle({
        license: data.vehicleNo || '',
        licenseNo: Number(data.vehicleNo2),
        make: data.make || '',
        model: data.model || '',
        color: data.color || '',
        year: data.year || '',
        eTagId: data.eTagId || '',
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        tagStatus: data.eTagStatus === 'active' ? 1 : 0,
        isActive: true,
        externalUserId,
        createdBy,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || 'Failed to create vehicle');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const initialVehicleValues = useMemo<ProfileFormData | null>(() => {
    if (!editVehicleDetails || !editVehicleDetails.data) return null;
    const data = editVehicleDetails.data;
    return {
      vehicleNo: splitLicense(data.license).vehicleNo,
      vehicleNo2: String(data.licenseNo ?? ''),
      licensePlate: data.licenseNo ? `${data.license || ''}-${data.licenseNo}` : data.license || '',
      make: data.make || '',
      model: data.model || '',
      color: data.color || '',
      year: data.year || '',
      eTagId: data.eTagId || '',
      issueDate: toDateInputValue(data.validFrom),
      expiryDate: toDateInputValue(data.validTo),
      eTagStatus: data.tagStatus === 1 ? 'active' : 'inactive',
      isActive: data.isActive,
    };
  }, [editVehicleDetails]);

  const handleUpdateVehicle = async (data: ProfileFormData) => {
    if (!editVehicleId || !editVehicleDetails?.data) throw new Error('Vehicle ID or details not found');
    try {
      const vehicleData = editVehicleDetails.data;
      
      // Get lastModifiedBy from localStorage
      let lastModifiedBy = 'system';
      try {
        const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userRaw) {
          const user = JSON.parse(userRaw);
          lastModifiedBy = user?.fullName || user?.name || user?.email || 'system';
        }
      } catch {
        lastModifiedBy = 'system';
      }
      
      const response = await updateVehicle({
        id: editVehicleId,
        license: data.vehicleNo || vehicleData.license || '',
        licenseNo: data.vehicleNo2 ? Number(data.vehicleNo2) : vehicleData.licenseNo,
        make: data.make || vehicleData.make || '',
        model: data.model || vehicleData.model || '',
        color: data.color || vehicleData.color || '',
        year: data.year || vehicleData.year || '',
        eTagId: data.eTagId || vehicleData.eTagId || '',
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        tagStatus: data.eTagStatus === 'active' ? 1 : 0,
        lastModifiedBy: lastModifiedBy || 'system',
        isActive: data.isActive ?? vehicleData.isActive,
        externalUserId: vehicleData.externalUserId,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || 'Failed to update vehicle');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = (vehicle: SelectedVehicleRow) => {
    setSelectedVehicle(vehicle);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) {
      return;
    }

    try {
      const response = await deleteVehicle({ id: selectedVehicle.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200 || response?.statusCode === 204;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedVehicle.id]);
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

    setDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  const columns: Column<Vehicle>[] = [
    { key: 'sno', header: 'S.No' },
    {
      key: 'externalUserName',
      header: 'Ownership',
      render: (value) => value || '-',
    },
    { key: 'licensePlate', header: 'License Plate' },
    { key: 'vehicleETagId', header: 'Vehicle E-Tag ID' },
    { key: 'eTagType', header: 'E-Tag Type' },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    // Removed Ownership ID column as requested
    { key: 'make', header: 'Make' },
    { key: 'model', header: 'Model' },
    { key: 'year', header: 'Year' },
    {
      key: 'color',
      header: 'Color',
      render: (value: string) => (
        value && value !== '-' ? value : '-'
      ),
    },
    {
      key: 'tagStatus',
      header: 'Tag Status',
      render: (value: number | null) => <StatusBadge type="tagStatus" value={value} />,
    },
    { 
      key: 'action', 
      header: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];

  return (
    <DashboardLayout pageTitle="Vehicle">
      <DataTable<Vehicle>
        columns={columns}
        data={vehicles}
        loading={isLoading}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        error={isError ? `Failed to load vehicles: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Vehicle"
      >
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddVehicle}
          onCancel={handleCloseModal}
          fields={enumFields}
          saveButtonText="Create"
          loading={loadingEnums}
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Vehicle"
      >
        {isEditVehicleLoading || loadingEnums ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialVehicleValues ? (
          <CommonEntityForm
            key={editVehicleId}
            title="Please update details below!"
            onSave={handleUpdateVehicle}
            onCancel={handleCloseModal}
            fields={enumFields}
            initialValues={initialVehicleValues}
            saveButtonText="Update"
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading vehicle details</div>
        )}
      </FormModal>

      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this vehicle? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}