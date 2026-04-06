'use client';
import { useState, useEffect } from 'react';
import { useGetAllRequestedTags } from '../../../../hooks/approval/useGetAllRequestedTags';
import DataTable, { Column, Tab, StatusBadge } from '../../../../components/tables/DataTable';
import { TagApprovalRequest } from '../../../../types/tag-approval.types';

interface TagLogTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

export default function TagLogTable({
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  addButtonLabel
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
    { key: 'subjectType', header: 'Subject Type' },
    { key: 'subjectId', header: 'User ID' },
    { key: 'subjectName', header: 'User Name' },
    { key: 'tagType', header: 'Tag Type' },
    { key: 'tagNumber', header: 'Tag Number' },
    { key: 'feeScale', header: 'FeeScale' },
    { key: 'planType', header: 'Plan Type' },
    { key: 'notes', header: 'Description' },
    { key: 'validFrom', header: 'Valid From' },
    { key: 'validTo', header: 'Valid To' },
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
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => row.status as 'Active' | 'Inactive' | 'Pending' | undefined}
        headerContent={
          <div style={{height:'40px'}}></div>
        }
      />
    </>
  );
}
