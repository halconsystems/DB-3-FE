'use client';
import { useState, useEffect } from 'react';
import { useGetAllRequestedTags } from '../../../../hooks/approval/useGetAllRequestedTags';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import { TagApprovalRequest } from '../../../../types/tag-approval.types';
import { formatDateDisplay } from '../../../../lib/dateUtils';

interface TagLogTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}

export default function TagLogTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel,
  searchParams=null
}: TagLogTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllRequestedTags(currentPage, 10);
  const [Tags, setTags] = useState<TagApprovalRequest[]>([]);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data.items)) {
      setTags(data.data.items);
    } else {
      setTags([]);
    }
  }, [data]);

  const TagColumns: Column<TagApprovalRequest>[] = [
    { key: 'hierarchicalId', header: 'User Id', render: (_: any, row) => row.hierarchicalId || '-' },
    { key: 'subjectName', header: 'Entity Name' },
    {
      key: 'subjectType',
      header: 'Entity Type',
      render: (value: string | null | undefined) =>
        value != null && String(value).trim() !== '' ? String(value) : '-',
    },
    { key: 'tagType', header: 'Tag Type' },
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'feeScale', header: 'FeeScale' },
    { key: 'planType', header: 'Plan Type' },
    { key: 'notes', header: 'Description' },
    { key: 'category', header: 'Category', render: (_: any, row) => row.category || '-' },
    { key: 'subCategory', header: 'Sub Category', render: (_: any, row) => row.subCategory || '-' },
    { key: 'validFrom', header: 'Valid From', render: (value: string) => formatDateDisplay(value) },
    { key: 'validTo', header: 'Valid To', render: (value: string) => formatDateDisplay(value) },
    { key: 'trialPeriod', header: 'Trial Period' },
    { key: 'status', header: 'Status', render: (value: string) => (<StatusBadge status={value} />) },
  ];

  return (
    <>
      <DataTable<TagApprovalRequest>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        columns={TagColumns}
        data={Tags}
        loading={isLoading}
        showAddButton={false}
        columnFilterKeys={['subjectType', 'category', 'subCategory']}
        columnFilterLabels={{ subjectType: 'Entity Type' }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status as 'Active' | 'Inactive' | 'Pending' | undefined}
        enableSorting={true}
        headerContent={
          <div style={{height:'40px'}}></div>
        }
      />
    </>
  );
}
