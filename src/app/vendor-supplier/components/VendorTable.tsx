'use client';
import { useState } from 'react';
import DataTable, { Column, Tab } from '../../../components/tables/DataTable';
import { AddNewButton } from '../../../components/ui/ActionButton';
import { statusColumn, actionColumn } from '../../../components/tables/TableColumns';

export interface Vendor {
  id: number;
  businessName: string;
  city: string;
  address: string;
  email: string;
  contactPersonName: string;
  phone1: string;
  phone2: string;
  vehicleId: string;
  status: 'Active' | 'Inactive';
}

export const sampleVendors: Vendor[] = [
  { id: 1, businessName: 'King Bakers', city: 'Karachi', address: '0098451230892', email: 'shahid@gmail.com', contactPersonName: 'Shahid Husain', phone1: '0301-2346550', phone2: '0301-2346550', vehicleId: '99952346550', status: 'Active' },
  { id: 2, businessName: 'Subhan Sweets', city: 'Karachi', address: '0098451230686', email: 'ahmed@gmail.com', contactPersonName: 'Ahmed Faraz', phone1: '0301-2346540', phone2: '0301-2346540', vehicleId: '96752346550', status: 'Inactive' },
  { id: 3, businessName: 'King Bakers', city: 'Karachi', address: 'mustafa@gmail.com', email: 'mustafa@gmail.com', contactPersonName: 'Mustafa Javaid', phone1: '0301-2346530', phone2: '0301-2346530', vehicleId: '96752346666', status: 'Active' },
  { id: 4, businessName: 'Subhan Sweets', city: 'Karachi', address: 'arsalan@gmail.com', email: 'arsalan@gmail.com', contactPersonName: 'Arsalan Khan', phone1: '0301-2346520', phone2: '0301-2346520', vehicleId: '96101346666', status: 'Inactive' },
  { id: 5, businessName: 'King Bakers', city: 'Karachi', address: 'shahid@gmail.com', email: 'shahid@gmail.com', contactPersonName: 'Shahid Husain', phone1: '0301-2346550', phone2: '0301-2346550', vehicleId: '99952346550', status: 'Active' },
  { id: 6, businessName: 'Subhan Sweets', city: 'Karachi', address: 'ahmed@gmail.com', email: 'ahmed@gmail.com', contactPersonName: 'Ahmed Faraz', phone1: '0301-2346540', phone2: '0301-2346540', vehicleId: '96752346550', status: 'Inactive' },
  { id: 7, businessName: 'King Bakers', city: 'Karachi', address: 'mustafa@gmail.com', email: 'mustafa@gmail.com', contactPersonName: 'Mustafa Javaid', phone1: '0301-2346530', phone2: '0301-2346530', vehicleId: '96752346666', status: 'Active' },
  { id: 8, businessName: 'Subhan Sweets', city: 'Karachi', address: 'arsalan@gmail.com', email: 'arsalan@gmail.com', contactPersonName: 'Arsalan Khan', phone1: '0301-2346520', phone2: '0301-2346520', vehicleId: '96101346666', status: 'Inactive' },
  { id: 9, businessName: 'King Bakers', city: 'Karachi', address: 'shahid@gmail.com', email: 'shahid@gmail.com', contactPersonName: 'Shahid Husain', phone1: '0301-2346550', phone2: '0301-2346550', vehicleId: '99952346550', status: 'Active' },
  { id: 10, businessName: 'Subhan Sweets', city: 'Karachi', address: 'ahmed@gmail.com', email: 'ahmed@gmail.com', contactPersonName: 'Ahmed Faraz', phone1: '0301-2346540', phone2: '0301-2346540', vehicleId: '96752346550', status: 'Inactive' },
  { id: 11, businessName: 'King Bakers', city: 'Karachi', address: 'mustafa@gmail.com', email: 'mustafa@gmail.com', contactPersonName: 'Mustafa Javaid', phone1: '0301-2346530', phone2: '0301-2346530', vehicleId: '96752346666', status: 'Active' },
];

const DeleteIcon = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    style={{ 
      width: 32, 
      height: 32, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }}
  >
    <img src="/icons/delete Button.png" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
  </button>
);

interface VendorTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function VendorTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: VendorTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (item: Vendor) => {
    
  };
  const handleDelete = (item: Vendor) => {
    
  };
  const vendorColumns: Column<Vendor>[] = [
    { key: 'businessName', header: 'Business Name' },
    { key: 'city', header: 'City' },
    { key: 'address', header: 'Address' },
    { key: 'email', header: 'Email' },
    { key: 'contactPersonName', header: 'Contact Person Name' },
    { key: 'phone1', header: 'Phone 1' },
    { key: 'phone2', header: 'Phone 2' },
    { key: 'vehicleId', header: 'Vehicle ID' },
    statusColumn,
    actionColumn(handleEdit, handleDelete),
  ];

  return (
    <DataTable<Vendor>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={vendorColumns}
      data={sampleVendors}
      showAddButton={false}
      currentPage={currentPage}
      totalPages={3}
      onPageChange={setCurrentPage}
      getRowStatus={(row) => row.status}
      headerContent={
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
          <AddNewButton onClick={onAddNew} label={addButtonLabel} />
        </div>
      }
    />
  );
}
