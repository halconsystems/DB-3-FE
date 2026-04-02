'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import { AddNewButton } from '../../components/ui/ActionButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useVehicles } from '../../hooks/vehicle/useVehicles';
import { useDeleteVehicle } from '../../hooks/vehicle/useDeleteVehicle';
import type { ExternalVehicle } from '../../services/vehicle.service';

interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleETagId: string;
  eTagType: string;
  issueDate: string;
  expiryDate: string;
  tagStatus: 'Active' | 'Inactive';
  ownership: string;
  make: string;
  model: string;
  year: string;
  color: string;
  status: 'Active' | 'Inactive';
}

type SelectedVehicleRow = Pick<ExternalVehicle, 'id'>;

const formatDate = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

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

  const vehicles: Vehicle[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      licensePlate: formatLicensePlate(item.license, item.licenseNo),
      vehicleETagId: item.eTagId || '-',
      eTagType: item.eTagId || '-',
      issueDate: formatDate(item.validFrom),
      expiryDate: formatDate(item.validTo),
      tagStatus: item.tagStatus === 1 ? 'Active' : 'Inactive',
      ownership: item.externalUserId || '-',
      make: item.make || '-',
      model: item.model || '-',
      year: item.year || '-',
      color: item.color || '-',
      status: item.isActive && !item.isDeleted ? 'Active' : 'Inactive',
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
    { key: 'licensePlate', header: 'License Plate' },
    { key: 'vehicleETagId', header: 'Vehicle E-Tag ID' },
    { key: 'eTagType', header: 'E-Tag Type' },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    { 
      key: 'tagStatus', 
      header: 'Tag Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    { key: 'ownership', header: 'Ownership' },
    { key: 'make', header: 'Make' },
    { key: 'model', header: 'Model' },
    { key: 'year', header: 'Year' },
    { key: 'color', header: 'Color' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Vehicle>
        columns={columns}
        data={vehicles}
        loading={isLoading}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
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