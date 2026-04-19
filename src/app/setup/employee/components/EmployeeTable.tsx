'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import CircularButton from '../../../../components/ui/CircularButton';
import WarningModal from '../../../../components/popup/WarningModal';
import FormModal from '../../../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../../../lib/tableRowStorage';
import { useEmployees } from '../../../../hooks/employee/useEmployees';
import { useRemoveEmployee } from '../../../../hooks/employee/useRemoveEmployee';
import { useUpdateEmployee } from '../../../../hooks/employee/useUpdateEmployee';
import { useEmployeeById } from '../../../../hooks/employee/useEmployeeById';
import { employeeFields } from '../fields';

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
  searchParams?: any | null;
}

export default function EmployeeTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams
}: EmployeeTableProps) {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useEmployees();
  const { mutateAsync: removeEmployee, isPending: isDeleting } = useRemoveEmployee();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editEmployeeId, setEditEmployeeId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [formError, setFormError] = useState('');

  const { mutateAsync: updateEmployee } = useUpdateEmployee();
  const { data: editEmployeeDetails, isLoading: isEditEmployeeLoading } = useEmployeeById(editEmployeeId);

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditEmployeeId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('employee');
        if (selected?.id) {
          setEditEmployeeId(String(selected.id));
          clearTableRow('employee');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  const handleCloseModal = () => {
    setEditEmployeeId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/setup/employee');
  };

  const initialEmployeeValues = useMemo<ProfileFormData | null>(() => {
    if (!editEmployeeDetails?.data) return null;
    return {
      fullName: editEmployeeDetails.data.fullName || '',
      emailAddress: editEmployeeDetails.data.email || '',
      cellNumber: editEmployeeDetails.data.phoneNumber || '',
      cnic: editEmployeeDetails.data.cnic || '',
      role: editEmployeeDetails.data.userRole || '',
      tempPassword: '',
    };
  }, [editEmployeeDetails]);

  const handleUpdateEmployee = async (formData: ProfileFormData) => {
    if (!editEmployeeId || !editEmployeeDetails?.data) return;
    setFormError('');
    try {
      await updateEmployee({
        id: editEmployeeId,
        fullName: formData.fullName || editEmployeeDetails.data.fullName || '',
        email: formData.emailAddress || editEmployeeDetails.data.email || '',
        phoneNumber: formData.cellNumber || editEmployeeDetails.data.phoneNumber || '',
        cnic: formData.cnic || editEmployeeDetails.data.cnic || '',
        userRole: formData.role || editEmployeeDetails.data.userRole || '',
      } as any);
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update employee';
      setFormError(message);
    }
  };

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
    router.push(`/setup/employee?modal=edit&id=${encodeURIComponent(item.id)}`);
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
        showAddButton={true}
        addButtonLabel={addButtonLabel}
        onAddClick={onAddNew}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status}
      />
      
      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Employee"
      >
        {isEditEmployeeLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <CommonEntityForm
            title=""
            fields={employeeFields}
            initialValues={initialEmployeeValues || { fullName: '', emailAddress: '', cellNumber: '', cnic: '', role: '', tempPassword: '' }}
            onSave={handleUpdateEmployee}
            onCancel={handleCloseModal}
            loading={false}
            error={formError}
          />
        )}
      </FormModal>
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
