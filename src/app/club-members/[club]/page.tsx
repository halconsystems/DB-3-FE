'use client';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useClubMembers } from '../ClubMembersContext';
import ClubMembersTable from '../components/ClubMembersTable';

interface ClubMembersTabPageProps {
  params: {
    club: string;
  };
}

export default function ClubMembersTabPage({ params }: ClubMembersTabPageProps) {
  const searchParams = useSearchParams();
  const { tabs, activeTab, handleTabChange } = useClubMembers();

  return (
    <DashboardLayout pageTitle="Club Members" showBackButton={false}>
      <ClubMembersTable
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchParams={searchParams}
      />
    </DashboardLayout>
  );
}
