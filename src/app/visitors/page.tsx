'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import { AddNewButton } from '../../components/ui/ActionButton';

interface Visitor {
  id: number;
  name: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  qrReference: string;
  hostDetails: string;
  status: 'Active' | 'Inactive';
}

const sampleVisitors: Visitor[] = [
  { id: 1, name: 'Shahid Husain', vehicleInfo: 'ABC-123', visitDetail: 'Day Pass', validity: '07-02-1999', cnicNicopNo: '12345-1234567-1', qrReference: '0098451230892', hostDetails: 'host', status: 'Active' },
  { id: 2, name: 'Ahmed Faraz', vehicleInfo: 'DEF-909', visitDetail: 'Day Pass', validity: '02-11-1997', cnicNicopNo: '12345-4564567-1', qrReference: '0098451230666', hostDetails: 'host', status: 'Inactive' },
  { id: 3, name: 'Mustafa Javaid', vehicleInfo: 'PPA-889', visitDetail: 'Day Pass', validity: '17-12-1999', cnicNicopNo: '12345-4522267-1', qrReference: '0095541230892', hostDetails: 'host', status: 'Active' },
  { id: 4, name: 'Arsalan Khan', vehicleInfo: 'SLP-786', visitDetail: 'Day Pass', validity: '21-07-2001', cnicNicopNo: '12345-4528907-1', qrReference: '1108451230892', hostDetails: 'host', status: 'Inactive' },
  { id: 5, name: 'Shahid Husain', vehicleInfo: 'ABC-123', visitDetail: 'Day Pass', validity: '07-02-1999', cnicNicopNo: '12345-1234567-1', qrReference: '0098451230892', hostDetails: 'host', status: 'Active' },
  { id: 6, name: 'Ahmed Faraz', vehicleInfo: 'DEF-909', visitDetail: 'Day Pass', validity: '02-11-1997', cnicNicopNo: '12345-4564567-1', qrReference: '0098451230666', hostDetails: 'host', status: 'Inactive' },
  { id: 7, name: 'Mustafa Javaid', vehicleInfo: 'PPA-889', visitDetail: 'Day Pass', validity: '17-12-1999', cnicNicopNo: '12345-4522267-1', qrReference: '0095541230892', hostDetails: 'host', status: 'Active' },
  { id: 8, name: 'Arsalan Khan', vehicleInfo: 'SLP-786', visitDetail: 'Day Pass', validity: '21-07-2001', cnicNicopNo: '12345-4528907-1', qrReference: '1108451230892', hostDetails: 'host', status: 'Inactive' },
  { id: 9, name: 'Shahid Husain', vehicleInfo: 'ABC-123', visitDetail: 'Day Pass', validity: '07-02-1999', cnicNicopNo: '12345-1234567-1', qrReference: '0098451230892', hostDetails: 'host', status: 'Active' },
  { id: 10, name: 'Ahmed Faraz', vehicleInfo: 'DEF-909', visitDetail: 'Day Pass', validity: '02-11-1997', cnicNicopNo: '12345-4564567-1', qrReference: '0098451230666', hostDetails: 'host', status: 'Inactive' },
  { id: 11, name: 'Mustafa Javaid', vehicleInfo: 'PPA-889', visitDetail: 'Day Pass', validity: '17-12-1999', cnicNicopNo: '12345-4522267-1', qrReference: '0095541230892', hostDetails: 'host', status: 'Active' },
];



export default function VisitorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/visitors/add-visitor');
  };

  const handleEdit = (visitor: Visitor) => {
    console.log('Edit visitor:', visitor);
  };

  const columns: Column<Visitor>[] = [
    { key: 'name', header: 'Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'validity', header: 'Validity' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
    { key: 'qrReference', header: 'QR Reference' },
    { 
      key: 'hostDetails', 
      header: 'Host Details',
      render: () => <CircularButton imagePath="/icons/host.svg" imageAlt="Host" width={32} height={32} />
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    { 
      key: 'action', 
      header: 'Action',
      render: (_, row) => <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
    },
  ];

  return (
    <DashboardLayout pageTitle="Visitor">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Visitor>
        columns={columns}
        data={sampleVisitors}
        showAddButton={false}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
    </DashboardLayout>
  );
}