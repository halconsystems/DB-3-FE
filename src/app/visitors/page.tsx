'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import { AddNewButton } from '../../components/ui/ActionButton';
import HostDetailsModal from '../../components/ui/components/HostDetailsModal';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';
import { useVisitors } from '../../hooks/visitors/useVisitors';
import { useDeleteVisitor } from '../../hooks/visitors/useDeleteVisitor';
import type { ExternalVisitorPass } from '../../services/visitor.service';

interface Visitor {
  id: string;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  hostDetails: string;
  status: 'Active' | 'Inactive';
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



export default function VisitorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<SelectedVisitorRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useVisitors();
  const { mutateAsync: deleteVisitor, isPending: isDeleting } = useDeleteVisitor();

  const visitors: Visitor[] = (data?.data || [])
    .filter((item) => item && !localRemovedIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      vehicleInfo: `${item.vehicleLicensePlate}`,
      visitDetail: item.visitorPassType === 1 ? 'Long Stay' : 'Day Pass',
      validity: `${formatDate(item.validFrom)} - ${formatDate(item.validTo)}`,
      cnicNicopNo: item.cnic,
      hostDetails: item.externalUserName || 'host',
      status: item.isActive && !item.isDeleted ? 'Active' : 'Inactive',
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
    setSelectedHost({
      id: row.id,
      name: row.name,
      phone: '0321-4239813', 
      address: row.visitDetail,
      imageUrl: '/images/avatar-placeholder.png',
    });
    setHostModalOpen(true);
  };

  const columns: Column<Visitor>[] = [
    { key: 'name', header: 'Name' },
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
      key: 'status',
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />,
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Visitor>
        columns={columns}
        data={visitors}
        loading={isLoading}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
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
