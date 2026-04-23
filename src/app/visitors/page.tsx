'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import HostDetailsModal from '../../components/ui/components/HostDetailsModal';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { useVisitors } from '../../hooks/visitors/useVisitors';
import { useVisitorById } from '../../hooks/visitors/useVisitorById';
import { useCreateVisitor } from '../../hooks/visitors/useCreateVisitor';
import { useUpdateVisitor } from '../../hooks/visitors/useUpdateVisitor';
import { useDeleteVisitor } from '../../hooks/visitors/useDeleteVisitor';
import { formatDateDisplay } from '../../lib/dateUtils';
import { visitorFields } from './fields';
import { getAllExternalUsers } from '../../services/user.service';
import type { ExternalVisitorPass } from '../../services/visitor.service';

interface Visitor {
  id: string;
  visitorName: string;
  userName: string;
  vehicleInfo: string;
  visitDetail: string;
  issueDate: string;
  expiryDate: string;
  cnicNicopNo: string;
  hostDetails: string;
  status: boolean;
  cardStatus?: number;
  externalUserId: string;
  sno?: number;
}

type SelectedVisitorRow = Pick<ExternalVisitorPass, 'id'>;

const toVisitorPassTypeLabel = (passType?: string | number): string => {
  if (passType === 'DayPass' || passType === 1) return 'Day Pass';
  if (passType === 'LongDay' || passType === 2) return 'Long Stay';
  return '-';
};



export default function VisitorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<SelectedVisitorRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [editVisitorId, setEditVisitorId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);

  const { data, isLoading, isError, error } = useVisitors();
  const { data: editVisitorDetails, isLoading: isEditVisitorLoading } = useVisitorById(editVisitorId);
  const { mutateAsync: deleteVisitor, isPending: isDeleting } = useDeleteVisitor();
  const { mutateAsync: createVisitor } = useCreateVisitor();
  const { mutateAsync: updateVisitor } = useUpdateVisitor();

  const [formError, setFormError] = useState('');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditVisitorId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('visitors');
        if (selected?.id) {
          setEditVisitorId(String(selected.id));
          clearTableRow('visitors');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  console.log('Fetched visitors data:', data);

  const visitors: Visitor[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item, idx) => ({
      sno: idx + 1,
      id: item.id,
      visitorName: item.name,
      userName: item.externalUserName || '-',
      vehicleInfo: `${item.vehicleLicensePlate}`,
      visitDetail: toVisitorPassTypeLabel(item.visitorPassType),
      issueDate: formatDateDisplay(item.validFrom),
      expiryDate: formatDateDisplay(item.validTo),
      cnicNicopNo: item.cnic,
      hostDetails: item.externalUserName || 'host',
      status: item.isActive && !item.isDeleted,
      cardStatus: item.cardStatus,
      externalUserId: item.externalUserId,
    }));



  const handleAddNew = () => {
    router.push('/visitors?modal=add');
  };

  const handleEdit = (visitor: Visitor) => {
    saveTableRow('visitors', { id: visitor.id });
    router.push(`/visitors?modal=edit&id=${encodeURIComponent(visitor.id)}`);
  };

  const handleCloseModal = () => {
    setEditVisitorId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/visitors');
  };

  const toDateInputValue = (value?: string) => {
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

  const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
    const firstPart = (vehicleNo ?? '').trim();
    const secondPart = (vehicleNo2 ?? '').trim();
    if (!firstPart && !secondPart) return '';
    return `${firstPart}-${secondPart}`;
  };

  const toVisitorPassType = (quickPick?: string): number | null => {
    if (quickPick === 'LongStay') return 2;
    if (quickPick === 'DayPass') return 1;
    return null;
  };

  const toQuickPick = (passType?: string | number): string => {
    if (passType === 2) return 'LongStay';
    if (passType === 1) return 'DayPass';
    return 'DayPass';
  };

  const handleAddVisitor = async (data: ProfileFormData) => {
    setFormError('');
    try {
      const visitorPassType = toVisitorPassType(data.quickPick);
      if (visitorPassType === null) {
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

      await createVisitor({
        name: data.fullName || '',
        cnic: data.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
        vehicleLicenseNo: Number(data.vehicleNo2 || 0),
        visitorPassType: visitorPassType || 1,
        validFrom: toIsoDate(data.fromDate),
        validTo: toIsoDate(data.toDate),
        externalUserId,
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create visitor';
      setFormError(message);
    }
  };

  const initialVisitorValues = useMemo<ProfileFormData | null>(() => {
    if (!editVisitorDetails?.data) return null;
    const data = editVisitorDetails.data;
    return {
      fullName: data.name || '',
      cnic: data.cnic || '',
      vehicleNo: data.vehicleLicensePlate?.split('-')[0] || '',
      vehicleNo2: String(data.vehicleLicenseNo || ''),
      licensePlate: data.vehicleLicensePlate || '',
      qrReference: data.qrCode || '',
      quickPick: toQuickPick(data.visitorPassType),
      fromDate: toDateInputValue(data.validFrom),
      toDate: toDateInputValue(data.validTo),
      isActive: data.isActive,
      tagId: '',
      tagNumber: '',
      tagType: '',
      validFrom: '',
      validTo: '',
      entityType: '',
      entityId: '',
    };
  }, [editVisitorDetails]);

  const handleUpdateVisitor = async (formData: ProfileFormData) => {
    if (!editVisitorId || !editVisitorDetails?.data) return;
    setFormError('');
    try {
      const visitorData = editVisitorDetails.data;
      const visitorPassType = toVisitorPassType(formData.quickPick);

      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let lastModifiedBy = 'system';
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          lastModifiedBy = user?.fullName || user?.name || user?.email || 'system';
        } catch {
          lastModifiedBy = 'system';
        }
      }

      const isActive = formData.isActive ?? visitorData.isActive;

      await updateVisitor({
        id: editVisitorId,
        name: formData.fullName || visitorData.name || '',
        cnic: formData.cnic || visitorData.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(formData.vehicleNo, formData.vehicleNo2),
        vehicleLicenseNo: Number(formData.vehicleNo2 || visitorData.vehicleLicenseNo || 0),
        visitorPassType: visitorPassType || visitorData.visitorPassType || 1,
        validFrom: toIsoDate(formData.fromDate),
        validTo: toIsoDate(formData.toDate),
        isActive,
        isDeleted: !isActive,
        lastModifiedBy,
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update visitor';
      setFormError(message);
    }
  };

  const handleDelete = (visitor: SelectedVisitorRow) => {
    setSelectedVisitor(visitor);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVisitor) {
      return;
    }

    try {
      const response = await deleteVisitor({ id: selectedVisitor.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedVisitor.id]);
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

    setDeleteModalOpen(false);
    setSelectedVisitor(null);
  };

  const handleHostClick = (row: Visitor) => {
    const visitorData = (data?.data || []).find(v => v.id === row.id);
    if (visitorData) {
      setSelectedHost({
        id: visitorData.externalUserId,
        name: visitorData.externalUserName || 'Unknown',
        phone: '',
        address: visitorData.visitorPassType === 'LongStay' ? 'Long Stay' : 'Day Pass',
        imageUrl: undefined,
      });
    }
    setHostModalOpen(true);
  };

  const columns: Column<Visitor>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'visitorName', header: 'Visitor Name' },
    { key: 'userName', header: 'User Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    {
      key: 'hostDetails',
      header: 'Host Details',
      render: (_, row) => (
        <CircularButton imagePath="/icons/Host.svg" imageAlt="Host" width={32} height={32} onClick={() => handleHostClick(row)} />
      ),
    },
     {
      key: 'cardStatus',
      header: 'Card Status',
      render: (value: number) => <StatusBadge type="tagStatus" value={value} />
    },
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
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle="Visitor">
      <DataTable<Visitor>
        columns={columns}
        data={visitors}
        loading={isLoading}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status ? 'Active' : 'Inactive'}
        error={isError ? `Failed to load visitors: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Visitor"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddVisitor}
          onCancel={handleCloseModal}
          fields={visitorFields.filter((f) => f.name !== 'description')}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Visitor"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {isEditVisitorLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialVisitorValues ? (
          <CommonEntityForm
            key={editVisitorId}
            title="Please update details below!"
            onSave={handleUpdateVisitor}
            onCancel={handleCloseModal}
            fields={visitorFields.filter((f) => f.name !== 'description')}
            initialValues={initialVisitorValues}
            saveButtonText="Update"
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading visitor details</div>
        )}
      </FormModal>

      <HostDetailsModal open={hostModalOpen} onClose={() => setHostModalOpen(false)} host={selectedHost || { id: '', name: '', phone: '', address: '', imageUrl: '' }} />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Visitor"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this visitor? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}
