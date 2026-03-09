'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import CircularButton from '../../../components/ui/CircularButton';
import { AddNewButton } from '../../../components/ui/ActionButton';
export interface BankAccount {
  id: number;
  bankName: string;
  bankCode: string;
  accountNo: string;
  iban: string;
  branchCode: string;
  branch: string;
  status: 'Active' | 'Inactive';
}
export const sampleBankAccounts: BankAccount[] = [
  { id: 1, bankName: 'Bank Al Falah', bankCode: 'FALAHPKIE', accountNo: '0098451230892', iban: '5595541230892', branchCode: '0098', branch: 'DHA Phase II', status: 'Active' },
  { id: 2, bankName: 'Meezan Bank', bankCode: 'MZENPKIE', accountNo: '0098451230666', iban: '7898451230666', branchCode: '0965', branch: 'DHA Phase 1', status: 'Inactive' },
  { id: 3, bankName: 'Bank Al Falah', bankCode: 'FALAHPKIE', accountNo: '0098451230892', iban: '5595541230892', branchCode: '0098', branch: 'DHA Phase II', status: 'Active' },
  { id: 4, bankName: 'Meezan Bank', bankCode: 'MZENPKIE', accountNo: '0098451230666', iban: '7898451230666', branchCode: '0965', branch: 'DHA Phase 1', status: 'Inactive' },
  { id: 5, bankName: 'Bank Al Falah', bankCode: 'FALAHPKIE', accountNo: '0098451230892', iban: '5595541230892', branchCode: '0098', branch: 'DHA Phase II', status: 'Active' },
  { id: 6, bankName: 'Meezan Bank', bankCode: 'MZENPKIE', accountNo: '0098451230666', iban: '7898451230666', branchCode: '0965', branch: 'DHA Phase 1', status: 'Inactive' },
  { id: 7, bankName: 'Bank Al Falah', bankCode: 'FALAHPKIE', accountNo: '0098451230892', iban: '5595541230892', branchCode: '0098', branch: 'DHA Phase II', status: 'Active' },
  { id: 8, bankName: 'Meezan Bank', bankCode: 'MZENPKIE', accountNo: '0098451230666', iban: '7898451230666', branchCode: '0965', branch: 'DHA Phase 1', status: 'Inactive' },
  { id: 9, bankName: 'Bank Al Falah', bankCode: 'FALAHPKIE', accountNo: '0098451230892', iban: '5595541230892', branchCode: '0098', branch: 'DHA Phase II', status: 'Active' },
  { id: 10, bankName: 'Meezan Bank', bankCode: 'MZENPKIE', accountNo: '0098451230666', iban: '7898451230666', branchCode: '0965', branch: 'DHA Phase 1', status: 'Inactive' },
  { id: 11, bankName: 'Bank Al Falah', bankCode: 'FALAHPKIE', accountNo: '0098451230892', iban: '5595541230892', branchCode: '0098', branch: 'DHA Phase II', status: 'Active' },
];
interface BankAccountTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function BankAccountTable({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onAddNew, 
  addButtonLabel 
}: BankAccountTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleEdit = (item: BankAccount) => {
    router.push('/bank-account/edit-bank');
  };

  const handleDelete = (item: BankAccount) => {
    console.log('Delete item:', item);
  };

  const bankAccountColumns: Column<BankAccount>[] = [
    { key: 'bankName', header: 'Bank Name' },
    { key: 'bankCode', header: 'Bank Code' },
    { key: 'accountNo', header: 'Account No.' },
    { key: 'iban', header: 'IBAN' },
    { key: 'branchCode', header: 'Branch Code' },
    { key: 'branch', header: 'Branch' },
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
    <DataTable<BankAccount>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={bankAccountColumns}
      data={sampleBankAccounts}
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
