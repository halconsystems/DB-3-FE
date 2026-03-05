'use client';
import { useState } from 'react';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';

export interface PackageType {
  id: number;
  packageName: string;
  packageId: string;
  minCharges: number;
  minRenewalCharges: number;
  status: 'Active' | 'Inactive';
}

export const samplePackages: PackageType[] = [
  { id: 1, packageName: 'King Bakers', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Active' },
  { id: 2, packageName: 'Subhan Sweets', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Inactive' },
  { id: 3, packageName: 'King Bakers', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Active' },
  { id: 4, packageName: 'Subhan Sweets', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Inactive' },
  { id: 5, packageName: 'King Bakers', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Active' },
  { id: 6, packageName: 'Subhan Sweets', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Inactive' },
  { id: 7, packageName: 'King Bakers', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Active' },
  { id: 8, packageName: 'Subhan Sweets', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Inactive' },
  { id: 9, packageName: 'King Bakers', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Active' },
  { id: 10, packageName: 'Subhan Sweets', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Inactive' },
  { id: 11, packageName: 'King Bakers', packageId: '12342346550', minCharges: 3000, minRenewalCharges: 5000, status: 'Active' },
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
    <img src="/icons/delete Button.svg" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
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

  const handleEdit = (item: PackageType) => {
    
  };
  const handleDelete = (item: PackageType) => {
    
  };
  const packageColumns: Column<PackageType>[] = [
    { key: 'packageName', header: 'Package Name' },
    { key: 'packageId', header: 'Package ID' },
    { key: 'minCharges', header: 'Minimum Charges' },
    { key: 'minRenewalCharges', header: 'Minimum Renewal Charges' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
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
    <DataTable<PackageType>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={packageColumns}
      data={samplePackages}
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
