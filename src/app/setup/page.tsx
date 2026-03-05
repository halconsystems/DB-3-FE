'use client';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column, Tab } from '../../components/tables/DataTable';
import { AddNewButton } from '../../components/ui/ActionButton';
import CpAgentTable from '../cp-agent/components/CpAgentTable';
import BankAccountTable from '../bank-account/components/BankAccountTable';
import EmployeeTable from '../employee/components/EmployeeTable';
import VendorTable from '../vendor-supplier/components/VendorTable';
import PackageTable from '../package-type/components/PackageTable';
import PhaseTable from '../phase/components/PhaseTable';
import ZoneTable from '../zone/components/ZoneTable';
interface Zone {
  id: number;
  zoneName: string;
  phase: string;
  status: 'Active' | 'Inactive';
}

const sampleZones: Zone[] = [];

const tabs: Tab[] = [
  { key: 'cp-agent', label: 'CP/Agent' },
  { key: 'bank-account', label: 'Bank Account' },
  { key: 'employee', label: 'Employee' },
  { key: 'vendor-supplier', label: 'Vendor / Supplier' },
  { key: 'package-type', label: 'Package Type' },
  { key: 'phase', label: 'Phase' },
  { key: 'zone', label: 'Zone' },
];

const getAddButtonLabel = (tab: string) => {
  switch (tab) {
    case 'cp-agent': return 'Add CP/Agent';
    case 'bank-account': return 'Add Bank Account';
    case 'employee': return 'Add Employee';
    case 'vendor-supplier': return 'Add Vendor/Supplier';
    case 'package-type': return 'Add Package Type';
    case 'phase': return 'Add Phase';
    case 'zone': return 'Add Zone';
    default: return 'Add New';
  }
};

export default function ZonePage() {
  const [activeTab, setActiveTab] = useState('cp-agent');
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddNew = () => {
    console.log(`Add new ${activeTab}`);
  };

  const zoneColumns: Column<Zone>[] = [
    { key: 'zoneName', header: 'Zone Name' },
    { key: 'phase', header: 'Phase' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: 'Active' | 'Inactive') => <StatusBadge status={value} />
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'cp-agent':
        return (
          <CpAgentTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'bank-account':
        return (
          <BankAccountTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'employee':
        return (
          <EmployeeTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'vendor-supplier':
        return (
          <VendorTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'package-type':
        return (
          <PackageTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'phase':
        return (
          <PhaseTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'zone':
        return (
          <ZoneTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      default:
        return (
          <ZoneTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
    }
  };

  return (
    <DashboardLayout pageTitle="Setup">
      {renderContent()}
    </DashboardLayout>
  );
}