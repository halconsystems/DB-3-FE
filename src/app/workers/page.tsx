'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useWorkers } from '../../hooks/workers/useWorkers';
import { useDeleteWorker } from '../../hooks/workers/useDeleteWorker';
import type { ExternalWorker } from '../../services/worker.service';
import CircularButton from '../../components/ui/CircularButton';

interface Worker {
  id: string;
  name: string;
  jobType: string;
  phone: string;
  dob: string;
  cnicNicopNo: string;
  policeVerification: 'Yes' | 'No';
  workerCardDelivery: string;
  address: string;
  workerStatus: 'Active' | 'Inactive';
  workerCard: string;
  issuedDate?: string;
  expiryDate?: string;
  cardStatus?: 'Active' | 'Expire' | 'Blocked';
}

type SelectedWorkerRow = Pick<ExternalWorker, 'id'>;

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

const toJobTypeLabel = (jobType?: number) => {
  switch (jobType) {
    case 0:
      return 'Driver';
    case 1:
      return 'Cook';
    case 2:
      return 'Guard';
    case 3:
      return 'Peon';
    case 4:
      return 'Gardener';
    default:
      return 'Unknown';
  }
};

const toWorkerCardDeliveryLabel = (deliveryType?: number) => {
  switch (deliveryType) {
    case 0:
      return 'Owner Address';
    case 1:
      return 'Self Pickup';
    default:
      return '-';
  }
};

const toCardStatusLabel = (cardStatus?: number): 'Active' | 'Expire' | 'Blocked' => {
  switch (cardStatus) {
    case 2:
      return 'Blocked';
    case 3:
      return 'Expire';
    default:
      return 'Active';
  }
};

export default function WorkersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<SelectedWorkerRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useWorkers();
  const { mutateAsync: deleteWorker, isPending: isDeleting } = useDeleteWorker();

  const workers: Worker[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name || '-',
      jobType: toJobTypeLabel(item.jobType),
      phone: item.phoneNumber || '-',
      dob: formatDate(item.dateOfBirth),
      cnicNicopNo: item.cnic || '-',
      policeVerification: item.policeVerification ? 'Yes' : 'No',
      workerCardDelivery: toWorkerCardDeliveryLabel(item.workerCardDeliveryType),
      address: '-',
      workerStatus: item.isActive && !item.isDeleted ? 'Active' : 'Inactive',
      workerCard: item.workerCardNumber || '-',
      issuedDate: formatDate(item.validFrom),
      expiryDate: formatDate(item.validTo),
      cardStatus: toCardStatusLabel(item.cardStatus),
    }));

  const router = useRouter();

  const handleAddNew = () => {
    router.push('/workers/add-worker');
  };

  const handleEdit = (worker: Worker) => {
    saveTableRow('workers', { id: worker.id });
    router.push(`/workers/edit-worker?id=${encodeURIComponent(worker.id)}`);
  };

  const handleDelete = (worker: SelectedWorkerRow) => {
    setSelectedWorker(worker);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWorker) {
      return;
    }

    try {
      const response = await deleteWorker({ id: selectedWorker.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200 || response?.statusCode === 204;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedWorker.id]);
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

    setDeleteModalOpen(false);
    setSelectedWorker(null);
  };

  const columns: Column<Worker>[] = [
    { key: 'name', header: 'Name' },
    { key: 'jobType', header: 'Job Type' },
    { key: 'phone', header: 'Phone' },
    { key: 'dob', header: 'DOB' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    { key: 'policeVerification', header: 'Police Verification' },
    { key: 'workerCardDelivery', header: 'Worker Card Delivery' },
    { key: 'address', header: 'Address' },
    { 
      key: 'workerStatus', 
      header: 'Worker Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    { key: 'workerCard', header: 'Worker Card No.' },
    {     key: 'issuedDate', header: 'Issued Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value: 'Active' | 'Expired' | 'Blocked') => <StatusBadge status={value} />
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
    <DashboardLayout pageTitle="Workers">
      {isError && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          Failed to load workers: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Worker>
        columns={columns}
        data={workers}
        loading={isLoading}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.workerStatus}
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Worker"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this worker? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}