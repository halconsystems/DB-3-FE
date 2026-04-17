'use client';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useSetup } from '../SetupContext';
import VendorSupplierTable from './components/VendorSupplierTable';

export default function VendorSupplierPage() {
  const searchParams = useSearchParams();
  const { tabs, activeTab, handleTabChange, handleAddNew, addButtonLabel } = useSetup();

  return (
    <DashboardLayout pageTitle="Setup" showBackButton={false}>
      <VendorSupplierTable
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddNew={handleAddNew}
        addButtonLabel={addButtonLabel}
        searchParams={searchParams}
      />
    </DashboardLayout>
  );
}
