'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import { saveTableRow } from '../../../../lib/tableRowStorage';

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
  const [vendors, setVendors] = useState(sampleVendors);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const router = useRouter();

  const handleEdit = (item: Vendor) => {
    saveTableRow('vendor-supplier', item);
    router.push('/setup/vendor-supplier/edit-vendor');
  };
  const handleDelete = (item: Vendor) => {
    setSelectedVendor(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedVendor) {
      return;
    }

    setVendors((prev) => prev.filter((vendor) => vendor.id !== selectedVendor.id));
    setDeleteModalOpen(false);
    setSelectedVendor(null);
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
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ];

  return (
    <>
      <DataTable<Vendor>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={vendorColumns}
        data={vendors}
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={onAddNew}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vendor"
        message="Are you sure you want to delete this vendor? This action cannot be undone."
      />
    </>
  );
}
