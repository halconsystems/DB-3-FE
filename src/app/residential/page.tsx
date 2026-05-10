'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column, Tab } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import { saveTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';

interface Member {
  id: number;
  ser?: number;
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
  issueDate?: string;
  expiryDate?: string;
  cardStatus?: 'Active' | 'Inactive';
}


const sampleData: Member[] = [
  { id: 1, name: 'Shahid Husain', email: 'shahid@gmail.com', phone: '0301-2346550', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' , issueDate: '2024-01-01', expiryDate: '2025-01-01', cardStatus: 'Active'},
  { id: 2, name: 'Ahmed Faraz', email: 'ahmed@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 3, name: 'Mustafa Javaid', email: 'mustafa@gmail.com', phone: '0301-2346530', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 4, name: 'Arsalan Khan', email: 'arsalan@gmail.com', phone: '0301-2346520', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 5, name: 'Shahid Husain', email: 'shahid@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 6, name: 'Ahmed Faraz', email: 'ahmed@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 7, name: 'Mustafa Javaid', email: 'mustafa@gmail.com', phone: '0301-2346530', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 8, name: 'Arsalan Khan', email: 'arsalan@gmail.com', phone: '0301-2346520', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 9, name: 'Shahid Husain', email: 'shahid@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 10, name: 'Ahmed Faraz', email: 'ahmed@gmail.com', phone: '0301-2346540', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Faisal', floor: '04', laneStreetNumber: '12', plotNo: '44-C', memberStatus: 'Inactive', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
  { id: 11, name: 'Mustafa Javaid', email: 'mustafa@gmail.com', phone: '0301-2346530', subCategory: 'Shop', phase: 'Phase VIII', zone: 'N/A', khayaban: 'Khayaban-e-Ittehad', floor: '02', laneStreetNumber: '12', plotNo: '50-A', memberStatus: 'Active', card: '02134' , issueDate: '2023-01-01', expiryDate: '2024-01-01', cardStatus: 'Inactive'},
];

const tabs: Tab[] = [
  { key: 'commercial', label: 'Commercial' },
  { key: 'residents', label: 'Residents' },
];


export default function ResidentialPage() {
  const [activeTab, setActiveTab] = useState('commercial');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/residential/add-new');
  };

  const handleEdit = (member: Member) => {
    saveTableRow('residential', member);
    router.push('/residential/edit-residential');
  };

  const handleHostClick = (row: Member) => {
    saveTableRow('residential', row);
    router.push('/residential/Family');
  };

  const columns: Column<Member>[] = [
    { key: 'ser', header: 'Ser' },
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
    { key: 'card', header: 'Card No/ID' },
    { key: 'issueDate', header: 'Issue Date', render: (value: string) => formatDateDisplay(value) },
    { key: 'expiryDate', header: 'Expiry Date', render: (value: string) => formatDateDisplay(value) },
    {
      key: 'cardStatus', header: 'Tag Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => { return (<div style={{ display: 'flex', gap: '8px' }}>
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/Host.svg" imageAlt="Host" width={32} height={32} onClick={() => handleHostClick(row)} />
      </div>); 
      }
    },
  ];

  const sampleDataWithSno = sampleData.map((row, idx) => ({ ...row, ser: idx + 1 }));

  return (
    <DashboardLayout pageTitle="Residential / Commercial">
      <DataTable<Member>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        columns={columns}
        data={sampleDataWithSno}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.memberStatus}
      />
    </DashboardLayout>
  );
}
