'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';
import { getAllUsers, removeUser } from '../../../services/auth.service';
import Loader from '../../../components/ui/loader';

export interface Employee {
  id: string;
  employeeName: string;
  email: string;
  phone: string;
  cnic: string;
  role: string;
  status: 'Active' | 'Inactive';
}


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
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    getAllUsers().then(res => {
      if (res.statusCode === 200 && res.data && Array.isArray(res.data.items)) {
        setEmployees(res.data.items.map(user => ({
          id: user.id,
          employeeName: user.fullName,
          email: user.email,
          phone: user.phoneNumber ?? '',
          cnic: user.cnic,
          role: user.userRole ?? '',
          status: user.isActive ? 'Active' : 'Inactive',
        })));
      }
    });
  }, []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const router = useRouter();
  const handleEdit = (item: Employee) => {
    saveTableRow('employee', item);
    router.push('/employee/edit-employee');
  };
  const handleDelete = (item: Employee) => {
    setSelectedEmployee(item);
    setDeleteModalOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await removeUser(selectedEmployee.id);
      if (res.statusCode === 200) {
        setEmployees((prev) => prev.filter((employee) => employee.id !== selectedEmployee.id));
      }
    } catch (err) {
      // Optionally handle error
    }
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setSelectedEmployee(null);
  };

  const employeeColumns: Column<Employee>[] = [
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'cnic', header: 'CNIC/NICOP No.' },
    { key: 'role', header: 'Role' },
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
          <CircularButton imagePath="/icons/delete-button.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    }
  ];

  return (
    <>
    {isDeleting && <Loader variant="full" />}
    <DataTable<Employee>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={employeeColumns}
      data={employees}
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
    <WarningModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Employee"
      message="Are you sure you want to delete this employee? This action cannot be undone."
    />
    </>
  );
}
