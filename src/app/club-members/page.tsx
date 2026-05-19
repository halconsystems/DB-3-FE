'use client';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useClubMembers } from './ClubMembersContext';
import ClubMembersTable from './components/ClubMembersTable';

export default function ClubMembersPage() {
  const { tabs, activeTab, handleTabChange } = useClubMembers();

  return (
    <DashboardLayout pageTitle="Club Members" showBackButton={false}>
      <ClubMembersTable
      />
    </DashboardLayout>
  );
}
