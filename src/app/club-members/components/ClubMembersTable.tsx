'use client';
import { useEffect, useMemo, useState } from 'react';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';
import { useClubMemberUsers } from '../../../hooks/club-members/useClubMemberUsers';
import { getClubMembersSubCategory } from '../clubMembersConfig';
import type { ExternalUser } from '../../../services/user.service';
import { formatDateDisplay } from '../../../lib/dateUtils';
import { resolveTableTotalPages } from '../../../lib/unwrapApiList';
import { tableCnic, tablePhone, tableCardNumber, displayDash } from '../../../lib/formatDisplayFields';
import { normalizeNumericEnum } from '../../../lib/statusMapping';

export interface ClubMember {
  id: string;
  userName: string;
  email: string;
  phone: string;
  category: string;
  subCategory: string;
  cnicNo: string;
  clubMemberType: string;
  rfidCardNo: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: number | null;
  isActive: boolean;
}

interface ClubMembersTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchParams?: unknown | null;
}

const memberTypeFilterOptions = {
  category: [
    { value: 'Club Member', label: 'Club Member' },
    { value: 'Commercial Employee', label: 'Commercial Employee' },
    { value: 'Educational Visitor', label: 'Educational Visitor' },
    { value: 'Residential', label: 'Residential' },
  ],
  subCategory: [
    { value: 'Appartment', label: 'Appartment' },
    { value: 'Beach View', label: 'Beach View' },
    { value: 'Faculty', label: 'Faculty' },
    { value: 'Portion', label: 'Portion' },
    { value: 'Staff', label: 'Staff' },
  ],
};

const mapUserType = (type: number | string) => {
  if (typeof type === 'string') return type;
  switch (type) {
    case 1:
      return 'Admin';
    case 2:
      return 'User';
    default:
      return String(type);
  }
};

function mapExternalUserToClubMember(u: ExternalUser): ClubMember {
  return {
    id: u.id,
    userName: displayDash(u.name),
    email: displayDash(u.email),
    phone: tablePhone(u.phoneNumber),
    category: displayDash(u.category),
    subCategory: displayDash(u.subCategory),
    cnicNo: tableCnic(u.cnic),
    clubMemberType: mapUserType(u.userType),
    rfidCardNo: tableCardNumber(u.rfidCardNumber),
    cardIssueDate: formatDateDisplay(u.cardIssueDate),
    cardExpiryDate: formatDateDisplay(u.cardExpiryDate),
    cardStatus: normalizeNumericEnum(u.cardStatus),
    isActive: u.isActive,
  };
}

export default function ClubMembersTable({
  tabs,
  activeTab,
  onTabChange,
}: ClubMembersTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const subCategory = useMemo(() => getClubMembersSubCategory(activeTab), [activeTab]);

  const { data, isLoading, isFetching, error } = useClubMemberUsers(subCategory, currentPage, pageSize);
  const totalListPages = resolveTableTotalPages(data, pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, subCategory]);

  const members = useMemo(
    () => (data?.items ?? []).map(mapExternalUserToClubMember),
    [data?.items]
  );

  const clubMembersColumns: Column<ClubMember>[] = [
    { key: 'userName', header: 'User Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'cnicNo', header: 'CNIC No.' },
    { key: 'clubMemberType', header: 'Club member type' },
    { key: 'rfidCardNo', header: 'RFID Card No.' },
    { key: 'cardIssueDate', header: 'Card issue date' },
    { key: 'cardExpiryDate', header: 'Card Expiry Date' },
    {
      key: 'cardStatus',
      header: 'Tag Status',
      render: (_, row) => <StatusBadge type="cardStatus" value={row.cardStatus} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => <StatusBadge type="activeInactive" value={row.isActive} />,
    },
  ];

  const loadError = error instanceof Error ? error.message : error ? String(error) : undefined;

  return (
    <DataTable<ClubMember>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={clubMembersColumns}
      data={members}
      showAddButton={false}
      currentPage={currentPage}
      totalPages={totalListPages}
      onPageChange={setCurrentPage}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      serverSidePagination
      getRowStatus={(row) => (row.isActive ? 'Active' : 'Inactive')}
      loading={isLoading || isFetching}
      error={loadError}
      emptyMessage="No club members found for this club"
      enableFiltering={true}
      columnFilterKeys={['category', 'subCategory']}
      columnFilterLabels={{ category: 'Category', subCategory: 'Sub Category' }}
      columnFilterStaticOptions={memberTypeFilterOptions}
      enableSorting={true}
      filterPlaceholder="Search members..."
    />
  );
}
