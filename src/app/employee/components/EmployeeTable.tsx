'use client';
import { useState } from 'react';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import { AddNewButton } from '../../../components/ui/ActionButton';

export interface Employee {
  id: number;
  employeeName: string;
  serviceNo: string;
  email: string;
  phone: string;
  cnic: string;
  designation: string;
  nextOfKinName: string;
  nextOfKinNumber: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export const sampleEmployees: Employee[] = [
  { id: 1, employeeName: 'Shahid Husain', serviceNo: '0098451230892', email: 'shahid@gmail.com', phone: '0301-2346550', cnic: '12345-1234567-1', designation: 'DHA Phase II', nextOfKinName: 'DHA Phase II', nextOfKinNumber: '0301-2346550', role: 'Manager', status: 'Active' },
  { id: 2, employeeName: 'Ahmed Faraz', serviceNo: '0098451230686', email: 'ahmed@gmail.com', phone: '0301-2346540', cnic: '12345-4564567-1', designation: 'DHA Phase 1', nextOfKinName: 'DHA Phase 1', nextOfKinNumber: '0301-2346540', role: 'Staff', status: 'Active' },
  { id: 3, employeeName: 'Mustafa Javaid', serviceNo: '0098451230892', email: 'mustafa@gmail.com', phone: '0301-2346530', cnic: '12345-4522267-1', designation: 'DHA Phase II', nextOfKinName: 'DHA Phase II', nextOfKinNumber: '0301-2346530', role: 'Manager', status: 'Active' },
  { id: 4, employeeName: 'Arsalan Khan', serviceNo: '0098451230686', email: 'arsalan@gmail.com', phone: '0301-2346520', cnic: '12345-4528907-1', designation: 'DHA Phase 1', nextOfKinName: 'DHA Phase 1', nextOfKinNumber: '0301-2346520', role: 'Staff', status: 'Active' },
  { id: 5, employeeName: 'Shahid Husain', serviceNo: '0098451230892', email: 'shahid@gmail.com', phone: '0301-2346550', cnic: '12345-1234567-1', designation: 'DHA Phase II', nextOfKinName: 'DHA Phase II', nextOfKinNumber: '0301-2346550', role: 'Manager', status: 'Active' },
  { id: 6, employeeName: 'Ahmed Faraz', serviceNo: '0098451230686', email: 'ahmed@gmail.com', phone: '0301-2346540', cnic: '12345-4564567-1', designation: 'DHA Phase 1', nextOfKinName: 'DHA Phase 1', nextOfKinNumber: '0301-2346540', role: 'Staff', status: 'Active' },
  { id: 7, employeeName: 'Mustafa Javaid', serviceNo: '0098451230892', email: 'mustafa@gmail.com', phone: '0301-2346530', cnic: '12345-4522267-1', designation: 'DHA Phase II', nextOfKinName: 'DHA Phase II', nextOfKinNumber: '0301-2346530', role: 'Manager', status: 'Active' },
  { id: 8, employeeName: 'Arsalan Khan', serviceNo: '0098451230686', email: 'arsalan@gmail.com', phone: '0301-2346520', cnic: '12345-4528907-1', designation: 'DHA Phase 1', nextOfKinName: 'DHA Phase 1', nextOfKinNumber: '0301-2346520', role: 'Staff', status: 'Active' },
  { id: 9, employeeName: 'Shahid Husain', serviceNo: '0098451230892', email: 'shahid@gmail.com', phone: '0301-2346550', cnic: '12345-1234567-1', designation: 'DHA Phase II', nextOfKinName: 'DHA Phase II', nextOfKinNumber: '0301-2346550', role: 'Manager', status: 'Active' },
  { id: 10, employeeName: 'Ahmed Faraz', serviceNo: '0098451230686', email: 'ahmed@gmail.com', phone: '0301-2346540', cnic: '12345-4564567-1', designation: 'DHA Phase 1', nextOfKinName: 'DHA Phase 1', nextOfKinNumber: '0301-2346540', role: 'Staff', status: 'Active' },
  { id: 11, employeeName: 'Mustafa Javaid', serviceNo: '0098451230892', email: 'mustafa@gmail.com', phone: '0301-2346530', cnic: '12345-4522267-1', designation: 'DHA Phase II', nextOfKinName: 'DHA Phase II', nextOfKinNumber: '0301-2346530', role: 'Manager', status: 'Inactive' },
];

interface EmployeeTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function EmployeeTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
}: EmployeeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const employeeColumns: Column<Employee>[] = [
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'serviceNo', header: 'Service No.' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'cnic', header: 'CNIC/NICOP No.' },
    { key: 'designation', header: 'Designation' },
    { key: 'nextOfKinName', header: 'Next Of Kin Name' },
    { key: 'nextOfKinNumber', header: 'Next Of Kin Number' },
    { key: 'role', header: 'Role' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
  ];

  return (
    <DataTable<Employee>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={employeeColumns}
      data={sampleEmployees}
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
