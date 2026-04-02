'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import { AddNewButton } from '../../../../components/ui/ActionButton';
import { saveTableRow } from '../../../../lib/tableRowStorage';

interface FeeScale {
  id: string;
  packageName: string;
  feeCategory: string;
  amount: number;
  taxPercentage: number;
  serviceType: string;
  userCategory: string;
  vehicleCategory: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface FeeScaleTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

// Demo data
const demoFeeScales: FeeScale[] = [
  {
    id: '1',
    packageName: 'Basic',
    feeCategory: 'Registration',
    amount: 100,
    taxPercentage: 5,
    serviceType: 'Parking',
    userCategory: 'Residential',
    vehicleCategory: 'Private',
    description: 'Basic registration fee',
    status: 'Active'
  },
  {
    id: '2',
    packageName: 'Premium',
    feeCategory: 'Renewal',
    amount: 150,
    taxPercentage: 5,
    serviceType: 'Parking',
    userCategory: 'Commercial',
    vehicleCategory: 'Commercial User',
    description: 'Premium renewal fee',
    status: 'Active'
  }
];

export default function FeeScaleTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: FeeScaleTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [feeScales] = useState<FeeScale[]>(demoFeeScales);

  const handleEdit = (item: FeeScale) => {
    saveTableRow('fee-scale', item);
    router.push('/setup/fee-scale/edit-fee-scale');
  };

  const handleDelete = (id: string) => {
    console.log('Delete Fee Scale:', id);
    // Handle delete if needed
  };

  const columns: Column<FeeScale>[] = [
    { key: 'packageName', header: 'Package Name' },
    { key: 'feeCategory', header: 'Fee Category' },
    { key: 'amount', header: 'Amount' },
    { key: 'taxPercentage', header: 'Tax %' },
    { key: 'serviceType', header: 'Service Type' },
    { key: 'userCategory', header: 'User Category' },
    { key: 'vehicleCategory', header: 'Vehicle Category' },
    { key: 'description', header: 'Description' },
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
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row.id)} />
        </div>
      )
    }
  ];

  return (
    <DataTable<FeeScale>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={columns}
      data={feeScales}
      loading={false}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      headerContent={
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
          <AddNewButton onClick={onAddNew} label={addButtonLabel} />
        </div>
      }
    />
  );
}
