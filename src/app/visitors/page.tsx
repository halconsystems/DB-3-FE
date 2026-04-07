'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import HostDetailsModal from '../../components/ui/components/HostDetailsModal';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useVisitors } from '../../hooks/visitors/useVisitors';
import { useDeleteVisitor } from '../../hooks/visitors/useDeleteVisitor';
import type { ExternalVisitorPass } from '../../services/visitor.service';

interface Visitor {
  id: string;
  visitorName: string;
  userName: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  hostDetails: string;
  status: boolean;
  cardStatus?: number;
  externalUserId: string;
  sno?: number;
}

type SelectedVisitorRow = Pick<ExternalVisitorPass, 'id'>;

const formatDate = (value: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const toVisitorPassTypeLabel = (passType?: string | number): string => {
  if (passType === 'DayPass' || passType === 1) return 'Day Pass';
  if (passType === 'LongStay' || passType === 2) return 'Long Stay';
  return '-';
};



export default function VisitorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<SelectedVisitorRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useVisitors();
  const { mutateAsync: deleteVisitor, isPending: isDeleting } = useDeleteVisitor();

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
      validity: `${formatDate(item.validFrom)} - ${formatDate(item.validTo)}`,
      cnicNicopNo: item.cnic,
      hostDetails: item.externalUserName || 'host',
      status: item.isActive && !item.isDeleted,
      cardStatus: item.cardStatus,
      externalUserId: item.externalUserId,
    }));


  const router = useRouter();

  const handleAddNew = () => {
    router.push('/visitors/add-visitor');
  };

  const handleEdit = (visitor: Visitor) => {
    saveTableRow('visitors', { id: visitor.id });
    router.push('/visitors/edit-visitor');
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
    { key: 'validity', header: 'Validity' },
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
