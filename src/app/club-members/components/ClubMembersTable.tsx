'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, Tab, StatusBadge } from '../../../components/tables/DataTable';

export interface ClubMember {
  id: string;
  userName: string;
  email: string;
  phone: string;
  cnicNo: string;
  clubMemberType: string;
  rfidCardNo: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: 'Active' | 'Inactive' | 'Expired' | 'Pending';
  status: 'Active' | 'Inactive';
}

interface ClubMembersTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchParams?: any | null;
}

// Mock data for display
const mockClubMembers: Record<string, ClubMember[]> = {
  'golf-club': [
    {
      id: '1',
      userName: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+92 300 1234567',
      cnicNo: '12345-6789012-3',
      clubMemberType: 'Premium',
      rfidCardNo: 'RF001001',
      cardIssueDate: '2024-01-15',
      cardExpiryDate: '2025-01-15',
      cardStatus: 'Active',
      status: 'Active',
    },
    {
      id: '2',
      userName: 'Fatima Khan',
      email: 'fatima@example.com',
      phone: '+92 300 2345678',
      cnicNo: '12345-6789012-4',
      clubMemberType: 'Standard',
      rfidCardNo: 'RF001002',
      cardIssueDate: '2024-02-20',
      cardExpiryDate: '2025-02-20',
      cardStatus: 'Active',
      status: 'Active',
    },
  ],
  'creek-club': [
    {
      id: '3',
      userName: 'Bilal Ahmed',
      email: 'bilal@example.com',
      phone: '+92 300 3456789',
      cnicNo: '12345-6789012-5',
      clubMemberType: 'Premium',
      rfidCardNo: 'RF002001',
      cardIssueDate: '2023-06-10',
      cardExpiryDate: '2024-06-10',
      cardStatus: 'Expired',
      status: 'Active',
    },
  ],
  'beach-view-club': [
    {
        id: '4',
        userName: 'Aisha Malik',
        email: 'aisha@example.com',
        phone: '+92 300 4567890',
        cnicNo: '12345-6789012-6',
        clubMemberType: 'Standard',
        rfidCardNo: 'RF003001',
        cardIssueDate: '2024-03-10',
        cardExpiryDate: '2025-03-10',
        cardStatus: 'Active',
        status: 'Active',
    }
  ],
  'marina-club': [
    {
        id: '5',
        userName: 'Daniyal Raza',
        email: 'daniyal@example.com',
        phone: '+92 300 5678901',
        cnicNo: '12345-6789012-7',
        clubMemberType: 'Premium',
        rfidCardNo: 'RF004001',
        cardIssueDate: '2024-04-15',
        cardExpiryDate: '2025-04-15',
        cardStatus: 'Active',
        status: 'Active',
    }
  ],
  'sunset-club': [
    {
        id: '6',
        userName: 'Sara Ali',
        email: 'sara@example.com',
        phone: '+92 300 6789012',
        cnicNo: '12345-6789012-8',
        clubMemberType: 'Standard',
        rfidCardNo: 'RF005001',
        cardIssueDate: '2024-05-20',
        cardExpiryDate: '2025-05-20',
        cardStatus: 'Active',
        status: 'Active',
    }
  ],
  'da-club': [
    {
        id: '7',
        userName: 'Omar Farooq',
        email: 'omar@example.com',
        phone: '+92 300 7890123',
        cnicNo: '12345-6789012-9',
        clubMemberType: 'Premium',
        rfidCardNo: 'RF006001',
        cardIssueDate: '2024-06-15',
        cardExpiryDate: '2025-06-15',
        cardStatus: 'Active',
        status: 'Active',
    }
  ],
  'zamzama-club': [
    {
        id: '8',
        userName: 'Hina Shah',
        email: 'hina@example.com',
        phone: '+92 300 8901234',
        cnicNo: '12345-6789012-10',
        clubMemberType: 'Standard',
        rfidCardNo: 'RF007001',
        cardIssueDate: '2024-07-15',
        cardExpiryDate: '2025-07-15',
        cardStatus: 'Active',
        status: 'Active',
    }
  ],
  'da-sports-club': [
    {
        id: '9',
        userName: 'Zainab Qureshi',
        email: 'zainab@example.com',
        phone: '+92 300 9012345',
        cnicNo: '12345-6789012-11',
        clubMemberType: 'Premium',
        rfidCardNo: 'RF008001',
        cardIssueDate: '2024-08-15',
        cardExpiryDate: '2025-08-15',
        cardStatus: 'Active',
        status: 'Active',
    }
  ],
};

export default function ClubMembersTable({
  tabs,
  activeTab,
  onTabChange,
  searchParams,
}: ClubMembersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading based on active tab
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMembers(mockClubMembers[activeTab] || []);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab]);

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
      header: 'Card Status',
      render: (_, row) => <StatusBadge status={row.cardStatus} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable<ClubMember>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={clubMembersColumns}
      data={members}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      getRowStatus={(row) => row.status}
      loading={isLoading}
      emptyMessage="No club members found for this club"
      enableFiltering={true}
      enableSorting={false}
      filterPlaceholder="Search members..."
    />
  );
}
