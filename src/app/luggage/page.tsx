'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import { AddNewButton } from '../../components/ui/ActionButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';

interface LuggagePass {
  id: number;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  qrReference: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

const sampleLuggagePasses: LuggagePass[] = [
  { id: 1, name: 'Shahid Husain', vehicleInfo: 'ABC-123', visitDetail: 'Day Pass', validity: '07-02-1999', cnicNicopNo: '12345-1234567-1', qrReference: '0098451230892', status: 'Active' },
  { id: 2, name: 'Ahmed Faraz', vehicleInfo: 'DEF-909', visitDetail: 'Day Pass', validity: '02-11-1997', cnicNicopNo: '12345-4564567-1', qrReference: '0098451230666', status: 'Pending' },
  { id: 3, name: 'Mustafa Javaid', vehicleInfo: 'PPA-889', visitDetail: 'Day Pass', validity: '17-12-1999', cnicNicopNo: '12345-4522267-1', qrReference: '0095541230892', status: 'Active' },
  { id: 4, name: 'Arsalan Khan', vehicleInfo: 'SLP-786', visitDetail: 'Day Pass', validity: '21-07-2001', cnicNicopNo: '12345-4528907-1', qrReference: '1108451230892', status: 'Inactive' },
  { id: 5, name: 'Shahid Husain', vehicleInfo: 'ABC-123', visitDetail: 'Day Pass', validity: '07-02-1999', cnicNicopNo: '12345-1234567-1', qrReference: '0098451230892', status: 'Active' },
  { id: 6, name: 'Ahmed Faraz', vehicleInfo: 'DEF-909', visitDetail: 'Day Pass', validity: '02-11-1997', cnicNicopNo: '12345-4564567-1', qrReference: '0098451230666', status: 'Pending' },
  { id: 7, name: 'Mustafa Javaid', vehicleInfo: 'PPA-889', visitDetail: 'Day Pass', validity: '17-12-1999', cnicNicopNo: '12345-4522267-1', qrReference: '0095541230892', status: 'Active' },
  { id: 8, name: 'Arsalan Khan', vehicleInfo: 'SLP-786', visitDetail: 'Day Pass', validity: '21-07-2001', cnicNicopNo: '12345-4528907-1', qrReference: '1108451230892', status: 'Inactive' },
  { id: 9, name: 'Shahid Husain', vehicleInfo: 'ABC-123', visitDetail: 'Day Pass', validity: '07-02-1999', cnicNicopNo: '12345-1234567-1', qrReference: '0098451230892', status: 'Pending' },
  { id: 10, name: 'Ahmed Faraz', vehicleInfo: 'DEF-909', visitDetail: 'Day Pass', validity: '02-11-1997', cnicNicopNo: '12345-4564567-1', qrReference: '0098451230666', status: 'Inactive' },
  { id: 11, name: 'Mustafa Javaid', vehicleInfo: 'PPA-889', visitDetail: 'Day Pass', validity: '17-12-1999', cnicNicopNo: '12345-4522267-1', qrReference: '0095541230892', status: 'Active' },
];



export default function LuggagePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [luggagePasses, setLuggagePasses] = useState(sampleLuggagePasses);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState<LuggagePass | null>(null);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/luggage/add-luggage');
  };

  const handleEdit = (luggage: LuggagePass) => {
    saveTableRow('luggage', luggage);
    router.push('/luggage/edit-luggage');
  };

  const handleDelete = (luggage: LuggagePass) => {
    setSelectedLuggage(luggage);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedLuggage) {
      return;
    }

    setLuggagePasses((prev) => prev.filter((item) => item.id !== selectedLuggage.id));
    setDeleteModalOpen(false);
    setSelectedLuggage(null);
  };

  const columns: Column<LuggagePass>[] = [
    { key: 'name', header: 'Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'validity', header: 'Validity' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    { key: 'qrReference', header: 'QR Reference' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive' | 'Pending') => <StatusBadge status={value} />
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
    <DashboardLayout pageTitle="Luggage">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<LuggagePass>
        columns={columns}
        data={luggagePasses}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Luggage Record"
        message="Are you sure you want to delete this luggage record? This action cannot be undone."
      />
    </DashboardLayout>
  );
}