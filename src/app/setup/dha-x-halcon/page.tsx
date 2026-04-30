'use client';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useSetup } from '../SetupContext';
import DhaXHalconTable from './components/DhaXHalconTable';

export default function DhaXHalconPage() {
  const { tabs, activeTab, handleTabChange } = useSetup();

  return (
    <DashboardLayout pageTitle="Setup" showBackButton={false}>
      <DhaXHalconTable tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
    </DashboardLayout>
  );
}
