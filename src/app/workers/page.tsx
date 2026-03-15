'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';

interface Worker {
  id: number;
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

const sampleWorkers: Worker[] = [
  { id: 1, name: 'Shahid Husain', jobType: 'Guard', phone: '0301-2346550', dob: '07-02-1999', cnicNicopNo: '12345-1234567-1', policeVerification: 'Yes', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 2, name: 'Ahmed Faraz', jobType: 'Driver', phone: '0301-2346540', dob: '02-11-1997', cnicNicopNo: '12345-4564567-1', policeVerification: 'No', workerCardDelivery: 'Employer Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Blocked' },
  { id: 3, name: 'Mustafa Javaid', jobType: 'Cook', phone: '0301-2346530', dob: '17-12-1999', cnicNicopNo: '12345-4522267-1', policeVerification: 'Yes', workerCardDelivery: 'Self Pickup', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Expire' },
  { id: 4, name: 'Arsalan Khan', jobType: 'Peon', phone: '0301-2346520', dob: '21-07-2001', cnicNicopNo: '12345-4528907-1', policeVerification: 'No', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 5, name: 'Shahid Husain', jobType: 'Guard', phone: '0301-2346540', dob: '07-02-1999', cnicNicopNo: '12345-1234567-1', policeVerification: 'Yes', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 6, name: 'Ahmed Faraz', jobType: 'Driver', phone: '0301-2346540', dob: '02-11-1997', cnicNicopNo: '12345-4564567-1', policeVerification: 'No', workerCardDelivery: 'Employer Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 7, name: 'Mustafa Javaid', jobType: 'Cook', phone: '0301-2346530', dob: '17-12-1999', cnicNicopNo: '12345-4522267-1', policeVerification: 'Yes', workerCardDelivery: 'Self Pickup', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 8, name: 'Arsalan Khan', jobType: 'Peon', phone: '0301-2346520', dob: '21-07-2001', cnicNicopNo: '12345-4528907-1', policeVerification: 'No', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 9, name: 'Shahid Husain', jobType: 'Guard', phone: '0301-2346540', dob: '07-02-1999', cnicNicopNo: '12345-1234567-1', policeVerification: 'Yes', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Expire' },
  { id: 10, name: 'Ahmed Faraz', jobType: 'Driver', phone: '0301-2346540', dob: '02-11-1997', cnicNicopNo: '12345-4564567-1', policeVerification: 'No', workerCardDelivery: 'Employer Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Blocked' },
  { id: 11, name: 'Mustafa Javaid', jobType: 'Cook', phone: '0301-2346530', dob: '17-12-1999', cnicNicopNo: '12345-4522267-1', policeVerification: 'Yes', workerCardDelivery: 'Self Pickup', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
  { id: 12, name: 'Arsalan Khan', jobType: 'Peon', phone: '0301-2346520', dob: '21-07-2001', cnicNicopNo: '12345-4528907-1', policeVerification: 'No', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' , issuedDate: '01-01-2023', expiryDate: '31-12-2023', cardStatus: 'Active' },
];


import CircularButton from '../../components/ui/CircularButton';

export default function WorkersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [workers, setWorkers] = useState(sampleWorkers);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/workers/add-worker');
  };

  const handleEdit = (worker: Worker) => {
    saveTableRow('workers', worker);
    router.push('/workers/edit-worker');
  };

  const handleDelete = (worker: Worker) => {
    setSelectedWorker(worker);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedWorker) {
      return;
    }

    setWorkers((prev) => prev.filter((worker) => worker.id !== selectedWorker.id));
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
          <CircularButton imagePath="/icons/Delete Button.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];

  return (
    <DashboardLayout pageTitle="Workers">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Worker>
        columns={columns}
        data={workers}
        showAddButton={false}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.workerStatus}
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Worker"
        message="Are you sure you want to delete this worker? This action cannot be undone."
      />
    </DashboardLayout>
  );
}