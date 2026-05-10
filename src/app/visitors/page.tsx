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
import { resolveTableTotalPages } from '../../lib/unwrapApiList';
import { visitorFields } from './fields';
import { EXTERNAL_USERS_SELECT_PAGE_SIZE, getAllExternalUsers, getUserById } from '../../services/user.service';
import { displayDash, tableCardNumber, tableCnic, tablePhone } from '../../lib/formatDisplayFields';
import type { HostDetailRow } from '../../components/ui/components/HostDetailsModal';
import { getStatusConfig } from '../../lib/statusMapping';
import type { ExternalVisitorPass } from '../../services/visitor.service';

interface Visitor {
  id: string;
  ser: number;
  visitorName: string;
  userName: string;
  vehicleInfo: string;
  visitPassType: string;
  validFrom: string;
  validTill: string;
  cnicNicopNo: string;
  hostDetails: string;
  status: boolean;
  activeStatus: string;
  passStatus: string;
  externalUserId: string;
}

type SelectedVisitorRow = Pick<ExternalVisitorPass, 'id'>;

const formatVisitPassTypeLabel = (passType?: string | number): string => {
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
    lower === 'longstaypass' ||
    lower.includes('long')
  ) {
    return 'Long Stay Pass';
  }
  return p ? p : '-';
};

const formatVehicleDisplay = (item: ExternalVisitorPass): string => {
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

const derivePassStatus = (item: ExternalVisitorPass): string => {
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



export default function VisitorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);
  const [hostDetails, setHostDetails] = useState<HostDetailRow[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<SelectedVisitorRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [editVisitorId, setEditVisitorId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);

  const { data, isLoading, isError, error } = useVisitors(currentPage, pageSize);
  const totalListPages = resolveTableTotalPages(data, pageSize);
  const { data: editVisitorDetails, isLoading: isEditVisitorLoading } = useVisitorById(editVisitorId);
  const { mutateAsync: deleteVisitor, isPending: isDeleting } = useDeleteVisitor();
  const { mutateAsync: createVisitor } = useCreateVisitor();
  const { mutateAsync: updateVisitor } = useUpdateVisitor();

  const [formError, setFormError] = useState('');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');
  const isViewMode = modalMode === 'view';

  useEffect(() => {
    if (modalMode === 'edit' || modalMode === 'view') {
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

  const visitors: Visitor[] = (data?.items || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item) => {
      const passStatus = derivePassStatus(item);
      const isActiveRow = item.isActive && !item.isDeleted;
      return {
        ser: item.ser ?? 0,
        id: item.id,
        visitorName: displayDash(item.name),
        userName: displayDash(item.externalUserName),
        vehicleInfo: formatVehicleDisplay(item),
        visitPassType: formatVisitPassTypeLabel(item.visitorPassType),
        validFrom: formatDateDisplay(item.validFrom),
        validTill: formatDateDisplay(item.validTo),
        cnicNicopNo: item.cnic ?? '',
        hostDetails: item.externalUserName || 'host',
        status: isActiveRow,
        activeStatus: isActiveRow ? 'Active' : 'Inactive',
        passStatus,
        externalUserId: item.externalUserId,
      };
    });



  const handleAddNew = () => {
    router.push('/visitors?modal=add');
  };

  const handleEdit = (visitor: Visitor) => {
    saveTableRow('visitors', { id: visitor.id });
    router.push(`/visitors?modal=edit&id=${encodeURIComponent(visitor.id)}`);
  };

  const handleView = (visitor: Visitor) => {
    saveTableRow('visitors', { id: visitor.id });
    router.push(`/visitors?modal=view&id=${encodeURIComponent(visitor.id)}`);
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
    try {
      const visitorPassType = toVisitorPassType(data.quickPick);
      if (visitorPassType === null) {
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

      const response = await createVisitor({
        name: data.fullName || '',
        cnic: data.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
        vehicleLicenseNo: Number(data.vehicleNo2 || 0),
        visitorPassType: visitorPassType || 1,
        validFrom: toIsoDate(data.fromDate),
        validTo: toIsoDate(data.toDate),
        externalUserId,
      });

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to create visitor');
      }
    } catch (err: any) {
      throw err;
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

  const modalFields = useMemo(() => {
    return visitorFields.filter((f) => f.name !== 'description');
  }, []);

  const handleUpdateVisitor = async (formData: ProfileFormData) => {
    if (!editVisitorId || !editVisitorDetails?.data) throw new Error('Visitor ID or details not found');
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

      const response = await updateVisitor({
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

      if (!isApiSuccess(response)) {
        throw new Error(response?.errorMessage || response?.successMessage || 'Failed to update visitor');
      }
    } catch (err: any) {
      throw err;
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

  const handleHostClick = async (row: Visitor) => {
    const visitorData = (data?.items || []).find((v: ExternalVisitorPass) => v.id === row.id);
    setHostModalOpen(true);
    setHostLoading(true);
    setHostDetails([]);

    if (!visitorData?.externalUserId) {
      setHostDetails([
        { label: 'Name', value: displayDash(visitorData?.externalUserName) },
        {
          label: 'Visit pass type',
          value: visitorData ? formatVisitPassTypeLabel(visitorData.visitorPassType) : '-',
        },
      ]);
      setHostLoading(false);
      return;
    }

    try {
      const u = await getUserById(visitorData.externalUserId);
      const tagLabel = getStatusConfig('cardStatus', u.cardStatus)?.label ?? displayDash(u.cardStatus);
      setHostDetails([
        { label: 'Name', value: displayDash(u.name) },
        { label: 'Email', value: displayDash(u.email) },
        { label: 'Phone', value: tablePhone(u.phoneNumber) },
        { label: 'CNIC', value: tableCnic(u.cnic) },
        { label: 'Address', value: displayDash(u.address) },
        { label: 'Member No.', value: displayDash(u.memberNo) },
        { label: 'Staff No.', value: displayDash(u.staffNo) },
        { label: 'Category', value: displayDash(u.category) },
        { label: 'Sub Category', value: displayDash(u.subCategory) },
        { label: 'RFID Card No.', value: tableCardNumber(u.rfidCardNumber) },
        { label: 'Card Issue Date', value: formatDateDisplay(u.cardIssueDate) },
        { label: 'Card Expiry Date', value: formatDateDisplay(u.cardExpiryDate) },
        { label: 'Tag Status', value: tagLabel },
      ]);
    } catch {
      setHostDetails([
        { label: 'Name', value: displayDash(visitorData.externalUserName) },
        { label: 'Note', value: 'Could not load full host profile.' },
      ]);
    } finally {
      setHostLoading(false);
    }
  };

  const columns: Column<Visitor>[] = [
    { key: 'ser', header: 'Ser' },
    { key: 'visitorName', header: 'Visitor Name' },
    { key: 'userName', header: 'User Name' },
    { key: 'vehicleInfo', header: 'Vehicle No' },
    { key: 'visitPassType', header: 'Visit Pass Type' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTill', header: 'Valid Till' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.', render: (v: string) => tableCnic(v) },
    {
      key: 'hostDetails',
      header: 'Host Details',
      render: (_, row) => (
        <CircularButton imagePath="/icons/Host.svg" imageAlt="Host" width={32} height={32} onClick={() => handleHostClick(row)} />
      ),
    },
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
          <CircularButton imagePath="/icons/View.svg" imageAlt="View" width={32} height={32} onClick={() => handleView(row)} />
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
        enableFiltering={false}
        getRowStatus={(row) => {
          if (!row.status || row.passStatus === 'Expired') return 'Inactive';
          return 'Active';
        }}
        error={isError ? `Failed to load visitors: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Visitor"
      >
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddVisitor}
          onCancel={handleCloseModal}
          fields={modalFields}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={(modalMode === 'edit' || modalMode === 'view') && hasCheckedId}
        onClose={handleCloseModal}
        title={isViewMode ? 'View Visitor' : 'Edit Visitor'}
      >
        {isEditVisitorLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialVisitorValues ? (
          <CommonEntityForm
            key={editVisitorId}
            title={isViewMode ? 'Please review details below!' : 'Please update details below!'}
            onSave={handleUpdateVisitor}
            onCancel={handleCloseModal}
            fields={modalFields}
            initialValues={initialVisitorValues}
            saveButtonText="Update"
            isViewMode={isViewMode}
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading visitor details</div>
        )}
      </FormModal>

      <HostDetailsModal
        open={hostModalOpen}
        onClose={() => {
          setHostModalOpen(false);
          setHostDetails([]);
        }}
        loading={hostLoading}
        details={hostDetails}
      />
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
