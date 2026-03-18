'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column, Tab } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import HostDetailsModal from '../../components/ui/components/HostDetailsModal';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import { saveTableRow } from '../../lib/tableRowStorage';

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
  const [members, setMembers] = useState(sampleData);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/residential/add-new');
  };

  const handleEdit = (member: Member) => {
    saveTableRow('residential', member);
    router.push('/residential/edit-residential');
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedMember) {
      return;
    }

    setMembers((prev) => prev.filter((member) => member.id !== selectedMember.id));
    setDeleteModalOpen(false);
    setSelectedMember(null);
  };


  const handleHostClick = (row: Member) => {
    setSelectedHost({
      id: row.id,
      name: row.name,
      phone: '0321-4239813', 
      address: row.khayaban,
      imageUrl: '/images/avatar-placeholder.png',
    });
    setHostModalOpen(true);
  };

  const handleFamilyClick = (member: Member) => {
    saveTableRow('residential', member);
    router.push('/residential/Family');
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
    { key: 'card', header: 'Card No/ID' },
    {key: 'issueDate', header: 'Issue Date'},
    {key: 'expiryDate', header: 'Expiry Date'},
    {
      key: 'cardStatus', header: 'Card Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    {
      key: 'family',
      header: 'Family',
      render: (_, row) => (
        <CircularButton imagePath="/icons/host.svg" imageAlt="Family" width={32} height={32} onClick={() => handleFamilyClick(row)} />
      )
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => { return (<div style={{ display: 'flex', gap: '8px' }}>
          <CircularButton imagePath="/icons/Edit Button.svg" imageAlt="Edit" width={32} height={32} onClick={() => handleEdit(row)} />
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
          <CircularButton imagePath="/icons/host.svg" imageAlt="Host" width={32} height={32} onClick={() => handleHostClick(row)} />
      </div>); 
      }
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
        data={members}
        showAddButton={false}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.memberStatus}
      />
      <HostDetailsModal open={hostModalOpen} onClose={() => setHostModalOpen(false)} host={selectedHost || { id: '', name: '', phone: '', address: '', imageUrl: '' }} />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
      />
    </DashboardLayout>
  );
}