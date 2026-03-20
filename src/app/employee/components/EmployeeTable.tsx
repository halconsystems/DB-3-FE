'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
import WarningModal from '../../../components/popup/WarningModal';
import { saveTableRow } from '../../../lib/tableRowStorage';
import { useEmployees } from '../../../hooks/employee/useEmployees';
import { useRemoveEmployee } from '../../../hooks/employee/useRemoveEmployee';

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
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useEmployees();
  const { mutateAsync: removeEmployee, isPending: isDeleting } = useRemoveEmployee();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const items = data?.data?.items;
    if (!Array.isArray(items)) {
      setEmployees([]);
      return;
    }

    setEmployees(
      items.map((user) => ({
      id: user.id,
      employeeName: user.fullName,
      email: user.email,
      phone: user.phoneNumber ?? '',
      cnic: user.cnic,
      role: user.userRole ?? '',
      status: user.isActive ? 'Active' : 'Inactive',
      }))
    );
  }, [data]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const totalCount = data?.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const router = useRouter();
  const handleEdit = (item: Employee) => {
    saveTableRow('employee', item);
    router.push('/employee/edit-employee');
  };
  const handleDelete = (item: Employee) => {
    setSelectedEmployee(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) {
      return;
    }

    try {
      const response = await removeEmployee({ id: selectedEmployee.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200;

      if (isSuccess) {
        setEmployees((prev) =>
          prev.filter((employee) => employee.id !== selectedEmployee.id)
        );
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

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
          <CircularButton imagePath="/icons/DeleteButton.svg" imageAlt="Delete" width={32} height={32} onClick={() => handleDelete(row)} />
        </div>
      )
    }
  ];

  return (
    <>
    <DataTable<Employee>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={employeeColumns}
      data={employees}
      loading={isLoading}
      showAddButton={false}
      currentPage={currentPage}
      totalPages={totalPages}
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
