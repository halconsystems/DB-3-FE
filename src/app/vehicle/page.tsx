'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useVehicles } from '../../hooks/vehicle/useVehicles';
import { useDeleteVehicle } from '../../hooks/vehicle/useDeleteVehicle';
import { formatDateDisplay } from '../../lib/dateUtils';
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

export default function VehiclePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicleRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useVehicles();
  const { mutateAsync: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();

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

  const router = useRouter();

  const handleAddNew = () => {
  router.push('/vehicle/add-vehicle');
    
  };

  const handleEdit = (vehicle: Vehicle) => {
    saveTableRow('vehicle', { id: vehicle.id });
    router.push(`/vehicle/edit-vehicle?id=${encodeURIComponent(vehicle.id)}`);
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
        value && value !== '-' ? (
          <span style={{
            display: 'inline-block',
            padding: '4px 16px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: value.toLowerCase(),
            color: ['white', '#fff', 'black', '#000', 'gray', 'grey'].includes(value.toLowerCase()) ? '#222' : '#fff',
            border: '1px solid #eee',
            minWidth: 60,
            textAlign: 'center',
          }}>{value}</span>
        ) : '-'
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