'use client';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';

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
}

const sampleWorkers: Worker[] = [
  { id: 1, name: 'Shahid Husain', jobType: 'Guard', phone: '0301-2346550', dob: '07-02-1999', cnicNicopNo: '12345-1234567-1', policeVerification: 'Yes', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' },
  { id: 2, name: 'Ahmed Faraz', jobType: 'Driver', phone: '0301-2346540', dob: '02-11-1997', cnicNicopNo: '12345-4564567-1', policeVerification: 'No', workerCardDelivery: 'Employer Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' },
  { id: 3, name: 'Mustafa Javaid', jobType: 'Cook', phone: '0301-2346530', dob: '17-12-1999', cnicNicopNo: '12345-4522267-1', policeVerification: 'Yes', workerCardDelivery: 'Self Pickup', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' },
  { id: 4, name: 'Arsalan Khan', jobType: 'Peon', phone: '0301-2346520', dob: '21-07-2001', cnicNicopNo: '12345-4528907-1', policeVerification: 'No', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' },
  { id: 5, name: 'Shahid Husain', jobType: 'Guard', phone: '0301-2346540', dob: '07-02-1999', cnicNicopNo: '12345-1234567-1', policeVerification: 'Yes', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' },
  { id: 6, name: 'Ahmed Faraz', jobType: 'Driver', phone: '0301-2346540', dob: '02-11-1997', cnicNicopNo: '12345-4564567-1', policeVerification: 'No', workerCardDelivery: 'Employer Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' },
  { id: 7, name: 'Mustafa Javaid', jobType: 'Cook', phone: '0301-2346530', dob: '17-12-1999', cnicNicopNo: '12345-4522267-1', policeVerification: 'Yes', workerCardDelivery: 'Self Pickup', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' },
  { id: 8, name: 'Arsalan Khan', jobType: 'Peon', phone: '0301-2346520', dob: '21-07-2001', cnicNicopNo: '12345-4528907-1', policeVerification: 'No', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' },
  { id: 9, name: 'Shahid Husain', jobType: 'Guard', phone: '0301-2346540', dob: '07-02-1999', cnicNicopNo: '12345-1234567-1', policeVerification: 'Yes', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' },
  { id: 10, name: 'Ahmed Faraz', jobType: 'Driver', phone: '0301-2346540', dob: '02-11-1997', cnicNicopNo: '12345-4564567-1', policeVerification: 'No', workerCardDelivery: 'Employer Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' },
  { id: 11, name: 'Mustafa Javaid', jobType: 'Cook', phone: '0301-2346530', dob: '17-12-1999', cnicNicopNo: '12345-4522267-1', policeVerification: 'Yes', workerCardDelivery: 'Self Pickup', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Active', workerCard: 'UID-927864' },
  { id: 12, name: 'Arsalan Khan', jobType: 'Peon', phone: '0301-2346520', dob: '21-07-2001', cnicNicopNo: '12345-4528907-1', policeVerification: 'No', workerCardDelivery: 'Owner Address', address: 'Khayaban E Iqbal, Phase VIII', workerStatus: 'Inactive', workerCard: 'UID-927864' },
];

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
  { key: 'workerCard', header: 'Worker Card' },
];

export default function WorkersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddNew = () => {
    console.log('Add new worker');
    
  };

  return (
    <DashboardLayout pageTitle="Workers">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Worker>
        columns={columns}
        data={sampleWorkers}
        showAddButton={false}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.workerStatus}
      />
    </DashboardLayout>
  );
}