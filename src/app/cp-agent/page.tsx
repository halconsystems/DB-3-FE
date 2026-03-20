"use client";
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import CpAgentTable from './components/CpAgentTable';
import type { Tab } from '../../components/tables/DataTable';

const cpAgentOnlyTab: Tab[] = [{ key: 'cp-agent', label: 'CP/Agent' }];

export default function CpAgentPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push('/cp-agent/add-cp');
  };

  return (
    <DashboardLayout pageTitle="CP Agent">
      <CpAgentTable
        tabs={cpAgentOnlyTab}
        activeTab="cp-agent"
        onTabChange={() => {
          // No-op because this standalone page has a single fixed tab.
        }}
        onAddNew={handleAddNew}
        addButtonLabel="Add CP/Agent"
      />
    </DashboardLayout>
  );
}