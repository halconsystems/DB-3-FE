'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import { ActionIcon, AddNewButton } from '../../components/ui/ActionButton';

interface Vehicle {
  id: number;
  licensePlate: string;
  vehicleETagId: string;
  eTagType: string;
  issueDate: string;
  expiryDate: string;
  tagStatus: 'Active' | 'Inactive';
  ownership: string;
  make: string;
  model: string;
  year: string;
  color: string;
  status: 'Active' | 'Inactive';
}

const sampleVehicles: Vehicle[] = [
  { id: 1, licensePlate: 'ABC-123', vehicleETagId: '99952346550', eTagType: '99952346550', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Active', ownership: 'Mrs. Shahid', make: 'Toyota', model: 'Land Cruiser', year: '2022', color: 'White', status: 'Active' },
  { id: 2, licensePlate: 'DEF-909', vehicleETagId: '96752346550', eTagType: '96752346550', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Inactive', ownership: 'Owais Ahmed', make: 'Honda', model: 'Civic', year: '2020', color: 'Black', status: 'Inactive' },
  { id: 3, licensePlate: 'PPA-889', vehicleETagId: '96752346666', eTagType: '96752346666', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Active', ownership: 'Arsalan Khan', make: 'Toyota', model: 'Prado', year: '2017', color: 'Silver', status: 'Active' },
  { id: 4, licensePlate: 'SLP-786', vehicleETagId: '96110346666', eTagType: '96110346666', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Inactive', ownership: 'Ayaan Shabbir', make: 'Toyota', model: 'Corolla', year: '2019', color: 'Gold', status: 'Inactive' },
  { id: 5, licensePlate: 'ABC-123', vehicleETagId: '99952346550', eTagType: '99952346550', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Active', ownership: 'Mrs. Shahid', make: 'Toyota', model: 'Land Cruiser', year: '2022', color: 'White', status: 'Active' },
  { id: 6, licensePlate: 'DEF-909', vehicleETagId: '96752346550', eTagType: '96752346550', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Inactive', ownership: 'Owais Ahmed', make: 'Honda', model: 'Civic', year: '2020', color: 'Black', status: 'Inactive' },
  { id: 7, licensePlate: 'PPA-889', vehicleETagId: '96752346666', eTagType: '96752346666', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Active', ownership: 'Arsalan Khan', make: 'Toyota', model: 'Prado', year: '2017', color: 'Silver', status: 'Active' },
  { id: 8, licensePlate: 'SLP-786', vehicleETagId: '96110346666', eTagType: '96110346666', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Inactive', ownership: 'Ayaan Shabbir', make: 'Toyota', model: 'Corolla', year: '2019', color: 'Gold', status: 'Inactive' },
  { id: 9, licensePlate: 'ABC-123', vehicleETagId: '99952346550', eTagType: '99952346550', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Active', ownership: 'Mrs. Shahid', make: 'Toyota', model: 'Land Cruiser', year: '2022', color: 'White', status: 'Active' },
  { id: 10, licensePlate: 'DEF-909', vehicleETagId: '96752346550', eTagType: '96752346550', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Inactive', ownership: 'Owais Ahmed', make: 'Honda', model: 'Civic', year: '2020', color: 'Black', status: 'Inactive' },
  { id: 11, licensePlate: 'PPA-889', vehicleETagId: '96752346666', eTagType: '96752346666', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Active', ownership: 'Arsalan Khan', make: 'Toyota', model: 'Prado', year: '2017', color: 'Silver', status: 'Active' },
  { id: 12, licensePlate: 'SLP-786', vehicleETagId: '96110346666', eTagType: '96110346666', issueDate: '23-02-2026', expiryDate: '04-06-2030', tagStatus: 'Inactive', ownership: 'Ayaan Shabbir', make: 'Toyota', model: 'Corolla', year: '2019', color: 'Gold', status: 'Inactive' },
];



export default function VehiclePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleAddNew = () => {
  router.push('/vehicle/add-vehicle');
    
  };

  const handleEdit = (vehicle: Vehicle) => {
    console.log('Edit vehicle:', vehicle);
  };

  const columns: Column<Vehicle>[] = [
    { key: 'licensePlate', header: 'License Plate' },
    { key: 'vehicleETagId', header: 'Vehicle E-Tag ID' },
    { key: 'eTagType', header: 'E-Tag Type' },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    { 
      key: 'tagStatus', 
      header: 'Tag Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    { key: 'ownership', header: 'Ownership' },
    { key: 'make', header: 'Make' },
    { key: 'model', header: 'Model' },
    { key: 'year', header: 'Year' },
    { key: 'color', header: 'Color' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
    { 
      key: 'action', 
      header: 'Action',
      render: (_, row) => <ActionIcon onClick={() => handleEdit(row)} />
    },
  ];

  return (
    <DashboardLayout pageTitle="Vehicle">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <AddNewButton onClick={handleAddNew} />
      </div>
      <DataTable<Vehicle>
        columns={columns}
        data={sampleVehicles}
        showAddButton={false}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
    </DashboardLayout>
  );
}