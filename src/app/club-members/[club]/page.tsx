'use client';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useClubMembers } from '../ClubMembersContext';
import ClubMembersTable from '../components/ClubMembersTable';

interface ClubMembersTabPageProps {
  params: { club: string };
}

/** `params.club` is reflected in the URL; active tab is synced from pathname in `ClubMembersProvider`. */
export default function ClubMembersTabPage({ params: _params }: ClubMembersTabPageProps) {
  const { tabs, activeTab, handleTabChange } = useClubMembers();

  return (
    <DashboardLayout pageTitle="Club Members" showBackButton={false}>
      <ClubMembersTable
      />
    </DashboardLayout>
  );
}
