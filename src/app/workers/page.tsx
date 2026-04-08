'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useWorkers } from '../../hooks/workers/useWorkers';
import { useDeleteWorker } from '../../hooks/workers/useDeleteWorker';
import type { ExternalWorker } from '../../services/worker.service';
import CircularButton from '../../components/ui/CircularButton';

interface Worker {
  id: string;
  workerName: string;
  userName: string;
  jobType: string;
  phone: string;
  dob: string;
  cnicNicopNo: string;
  policeVerification: 'Yes' | 'No';
  workerCardDelivery: string;
  fatherOrHusbandName?: string;
  workerStatus: boolean;
  workerCard: string;
  issuedDate?: string;
  expiryDate?: string;
  cardStatus?: number;
  sno?: number;
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

export default function WorkersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<SelectedWorkerRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useWorkers();
  const { mutateAsync: deleteWorker, isPending: isDeleting } = useDeleteWorker();

  const workers: Worker[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item, idx) => ({
      sno: idx + 1,
      id: item.id,
      workerName: item.name || '-',
      userName: item.externalUserName || '-',
      fatherOrHusbandName: item.fatherOrHusbandName || '-',
      jobType:
        typeof item.jobType === 'string'
          ? item.jobType
          : toJobTypeLabel(item.jobType),
      phone: item.phoneNumber || '-',
      dob: formatDate(item.dateOfBirth),
      cnicNicopNo: item.cnic || '-',
      policeVerification: item.policeVerification ? 'Yes' : 'No',
      workerCardDelivery: item.workerCardDeliveryType?.toString() || '-',
      workerStatus: !!(item.isActive && !item.isDeleted),
      workerCard: item.workerCardNumber || '-',
      issuedDate: formatDate(item.validFrom),
      expiryDate: formatDate(item.validTo),
      cardStatus: item.cardStatus,
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
     {
      key: 'sno',
      header: 'S.No',
    },
    { key: 'workerName', header: 'Worker Name' },
    { key: 'userName', header: 'User Name' },
    { key: 'jobType', header: 'Job Type' },
    { key: 'phone', header: 'Phone' },
    { key: 'dob', header: 'DOB' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    { key: 'fatherOrHusbandName', header: 'Father/Husband Name' },
    { key: 'policeVerification', header: 'Police Verification' },
    { key: 'workerCardDelivery', header: 'Worker Card Delivery' },
    { 
      key: 'workerStatus', 
      header: 'Worker Status',
      render: (value: boolean) => <StatusBadge type="activeInactive" value={value} />
    },
    { key: 'workerCard', header: 'Worker Card No.' },
    {     key: 'issuedDate', header: 'Issued Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value: number) => <StatusBadge type="tagStatus" value={value} />
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
      <DataTable<Worker>
        columns={columns}
        data={workers}
        loading={isLoading}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.workerStatus ? 'Active' : 'Inactive'}
        error={isError ? `Failed to load workers: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
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