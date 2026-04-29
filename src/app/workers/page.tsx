'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { useWorkers } from '../../hooks/workers/useWorkers';
import { useWorkerById } from '../../hooks/workers/useWorkerById';
import { useCreateWorker } from '../../hooks/workers/useCreateWorker';
import { useUpdateWorker } from '../../hooks/workers/useUpdateWorker';
import { useDeleteWorker } from '../../hooks/workers/useDeleteWorker';
import { formatDateDisplay } from '../../lib/dateUtils';
import { workerFields } from './fields';
import { getAllExternalUsers } from '../../services/user.service';
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

export default function WorkersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<SelectedWorkerRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [editWorkerId, setEditWorkerId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);

  const { data, isLoading, isError, error } = useWorkers();
  const { data: editWorkerDetails, isLoading: isEditWorkerLoading } = useWorkerById(editWorkerId);
  const { mutateAsync: deleteWorker, isPending: isDeleting } = useDeleteWorker();
  const { mutateAsync: createWorker } = useCreateWorker();
  const { mutateAsync: updateWorker } = useUpdateWorker();

  const [formError, setFormError] = useState('');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');
  const isViewMode = modalMode === 'view';

  useEffect(() => {
    if (modalMode === 'edit' || modalMode === 'view') {
      if (modalId) {
        setEditWorkerId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('workers');
        if (selected?.id) {
          setEditWorkerId(String(selected.id));
          clearTableRow('workers');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

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
      dob: formatDateDisplay(item.dateOfBirth),
      cnicNicopNo: item.cnic || '-',
      policeVerification: item.policeVerification ? 'Yes' : 'No',
      workerCardDelivery: item.workerCardDeliveryType?.toString() || '-',
      workerStatus: !!(item.isActive && !item.isDeleted),
      workerCard: item.workerCardNumber || '-',
      issuedDate: formatDateDisplay(item.validFrom),
      expiryDate: formatDateDisplay(item.validTo),
      cardStatus: item.cardStatus,
    }));


  const handleAddNew = () => {
    router.push('/workers?modal=add');
  };

  const handleEdit = (worker: Worker) => {
    saveTableRow('workers', { id: worker.id });
    router.push(`/workers?modal=edit&id=${encodeURIComponent(worker.id)}`);
  };

  const handleView = (worker: Worker) => {
    saveTableRow('workers', { id: worker.id });
    router.push(`/workers?modal=view&id=${encodeURIComponent(worker.id)}`);
  };

  const handleCloseModal = () => {
    setEditWorkerId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/workers');
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

  const toJobType = (value?: string): number => {
    switch (value) {
      case 'driver': return 0;
      case 'cook': return 1;
      case 'guard': return 2;
      case 'peon': return 3;
      case 'gardener': return 4;
      default: return 0;
    }
  };

  const toJobTypeFormValue = (value?: number): string => {
    switch (value) {
      case 0: return 'driver';
      case 1: return 'cook';
      case 2: return 'guard';
      case 3: return 'peon';
      case 4: return 'gardener';
      default: return '';
    }
  };

  const toCardStatus = (value?: string | number | boolean): number => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'number') return value === 1 ? 1 : 0;
    if (value === 'active' || value === '1') return 1;
    return 0;
  };

  const toCardStatusFormValue = (value?: number): string => {
    return value === 1 ? 'active' : 'inactive';
  };

  const toWorkerCardDeliveryType = (value?: string): number => {
    if (value === 'owner') return 0;
    if (value === 'self') return 1;
    return 0;
  };

  const toPoliceVerification = (value?: string): boolean => {
    return value === 'yes';
  };

  const handleAddWorker = async (data: ProfileFormData) => {
    try {
      let externalUserId = 'system';
      let createdBy = 'system';
      try {
        const users = await getAllExternalUsers();
        const firstValid = users.find((u: any) => u.id);
        if (firstValid && firstValid.id) {
          externalUserId = firstValid.id;
          createdBy = firstValid.name;
        }
      } catch {
        externalUserId = 'system';
        createdBy = 'system';
      }

      const response = await createWorker({
        ser: 0,
        jobType: toJobType(data.jobType),
        cnic: data.cnic || '',
        name:data.name || '',
        phoneNumber: data.cellNumber || '',
        dateOfBirth: toIsoDate(data.dob),
        fatherOrHusbandName: data.fatherOrHusbandName || '',
        policeVerification: toPoliceVerification(data.policeVerification),
        workerCardDeliveryType: toWorkerCardDeliveryType(data.workerCardDelivery),
        workerCardNumber: data.workerCardNo || '',
        validFrom: toIsoDate(data.issuedDate),
        validTo: toIsoDate(data.expiryDate),
        cardStatus: toCardStatus(data.cardStatus),
        isActive: true,
        externalUserId,
        createdBy,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || 'Failed to create worker');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const initialWorkerValues = useMemo<ProfileFormData | null>(() => {
    if (!editWorkerDetails?.data) return null;
    const data = editWorkerDetails.data;
    return {
      jobType: toJobTypeFormValue(data.jobType),
      cnic: data.cnic || '',
      name: data.name || '',
      cellNumber: data.phoneNumber || '',
      dob: toDateInputValue(data.dateOfBirth),
      fatherOrHusbandName: data.fatherOrHusbandName || '',
      policeVerification: data.policeVerification ? 'yes' : 'no',
      workerCardDelivery: data.workerCardDeliveryType === 0 ? 'owner' : 'self',
      workerCardNo: data.workerCardNumber || '',
      issuedDate: toDateInputValue(data.validFrom),
      expiryDate: toDateInputValue(data.validTo),
      cardStatus: toCardStatusFormValue(data.cardStatus),
      isActive: data.isActive,
    };
  }, [editWorkerDetails]);

  const handleUpdateWorker = async (formData: ProfileFormData) => {
    if (!editWorkerId || !editWorkerDetails?.data) throw new Error('Worker ID or details not found');
    try {
      const workerData = editWorkerDetails.data;
      const response = await updateWorker({
        id: editWorkerId,
        ser: workerData.ser || 0,
        jobType: toJobType(formData.jobType) ?? workerData.jobType,
        cnic: formData.cnic || workerData.cnic || '',
        name: formData.name || workerData.name || '',
        phoneNumber: formData.cellNumber || workerData.phoneNumber || '',
        dateOfBirth: toIsoDate(formData.dob || workerData.dateOfBirth),
        fatherOrHusbandName: formData.fatherOrHusbandName || workerData.fatherOrHusbandName || '',
        policeVerification: toPoliceVerification(formData.policeVerification) ?? workerData.policeVerification,
        workerCardDeliveryType: toWorkerCardDeliveryType(formData.workerCardDelivery) ?? workerData.workerCardDeliveryType,
        workerCardNumber: formData.workerCardNo || workerData.workerCardNumber || '',
        validFrom: toIsoDate(formData.issuedDate || workerData.validFrom),
        validTo: toIsoDate(formData.expiryDate || workerData.validTo),
        cardStatus: toCardStatus(formData.cardStatus) ?? workerData.cardStatus,
        isActive: formData.isActive ?? workerData.isActive,
        externalUserId: workerData.externalUserId,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || 'Failed to update worker');
      }
    } catch (err: any) {
      throw err;
    }
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
          <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} onClick={() => handleView(row)} />
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
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.workerStatus ? 'Active' : 'Inactive'}
        error={isError ? `Failed to load workers: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Worker"
      >
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddWorker}
          onCancel={handleCloseModal}
          fields={workerFields}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={(modalMode === 'edit' || modalMode === 'view') && hasCheckedId}
        onClose={handleCloseModal}
        title={isViewMode ? 'View Worker' : 'Edit Worker'}
      >
        {isEditWorkerLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialWorkerValues ? (
          <CommonEntityForm
            key={editWorkerId}
            title={isViewMode ? 'Please review details below!' : 'Please update details below!'}
            onSave={handleUpdateWorker}
            onCancel={handleCloseModal}
            fields={workerFields}
            initialValues={initialWorkerValues}
            saveButtonText="Update"
            isViewMode={isViewMode}
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading worker details</div>
        )}
      </FormModal>

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