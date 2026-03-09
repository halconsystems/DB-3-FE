'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column, Tab } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  subCategory: string;
  phase: string;
  zone: string;
  khayaban: string;
  floor: string;
  laneStreetNumber: string;
  plotNo: string;
  memberStatus: 'Active' | 'Inactive';
  card: string;
}


const sampleData: Member[] = [
  { id: 1, name: 'Shahid Husain', email: 'shahid@gmail.com', phone: '0301-2346550', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' },
  { id: 2, name: 'Ahmed Faraz', email: 'ahmed@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' },
  { id: 3, name: 'Mustafa Javaid', email: 'mustafa@gmail.com', phone: '0301-2346530', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' },
  { id: 4, name: 'Arsalan Khan', email: 'arsalan@gmail.com', phone: '0301-2346520', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' },
  { id: 5, name: 'Shahid Husain', email: 'shahid@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' },
  { id: 6, name: 'Ahmed Faraz', email: 'ahmed@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' },
  { id: 7, name: 'Mustafa Javaid', email: 'mustafa@gmail.com', phone: '0301-2346530', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' },
  { id: 8, name: 'Arsalan Khan', email: 'arsalan@gmail.com', phone: '0301-2346520', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' },
  { id: 9, name: 'Shahid Husain', email: 'shahid@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' },
  { id: 10, name: 'Ahmed Faraz', email: 'ahmed@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' },
  { id: 11, name: 'Mustafa Javaid', email: 'mustafa@gmail.com', phone: '0301-2346530', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' },
];

const tabs: Tab[] = [
  { key: 'commercial', label: 'Commercial' },
  { key: 'residents', label: 'Residents' },
];

import CircularButton from '../../components/ui/CircularButton';



export default function ResidentialPage() {
  const [activeTab, setActiveTab] = useState('commercial');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/residential/add-new');
  };

  const handleEdit = (member: Member) => {
    router.push('/residential/edit-residential');
  };

  const columns: Column<Member>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'subCategory', header: 'Sub Category' },
    { key: 'phase', header: 'Phase' },
    { key: 'zone', header: 'Zone' },
    { key: 'khayaban', header: 'Khayaban' },
    { key: 'floor', header: 'Floor' },
    { key: 'laneStreetNumber', header: 'Lane/Street Number' },
    { key: 'plotNo', header: 'Plot No' },
    { 
      key: 'memberStatus', 
      header: 'Member Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    { key: 'card', header: 'Card' },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
    },
  ];

  return (
    <DashboardLayout pageTitle="Residential / Commercial">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Member>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        columns={columns}
        data={sampleData}
        showAddButton={false}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.memberStatus}
      />
    </DashboardLayout>
  );
}