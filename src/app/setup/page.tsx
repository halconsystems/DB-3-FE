'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Tab } from '../../components/tables/DataTable';
import CpAgentTable from '../cp-agent/components/CpAgentTable';
import BankAccountTable from '../bank-account/components/BankAccountTable';
import EmployeeTable from '../employee/components/EmployeeTable';
import VendorTable from '../vendor-supplier/components/VendorTable';
import PackageTable from '../package-type/components/PackageTable';
import PhaseTable from '../phase/components/PhaseTable';
import ZoneTable from '../zone/components/ZoneTable';
import TagTable from '../tag/components/TagTable';
import TagApprovalTable from '../tag-approval/components/tagatable';
import TagTypeTable from '../tag-type/components/tagtype-table';

const tabs: Tab[] = [
  { key: 'cp-agent', label: 'CP/Agent' },
  { key: 'bank-account', label: 'Bank Account' },
  { key: 'employee', label: 'Employee' },
  { key: 'vendor-supplier', label: 'Vendor / Supplier' },
  { key: 'package-type', label: 'Package Type' },
  { key: 'phase', label: 'Phase' },
  { key: 'zone', label: 'Zone' },
  { key: 'tag', label: 'Tag' },
  { key: 'tag-approval', label: 'Tag Approval' },
  { key: 'tag-type', label: 'Tag Type' },
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
    case 'tag': return 'Create Tag';
    case 'tag-approval': return 'Request Approval';
    case 'tag-type': return 'Add Tag Type';
    default: return 'Add New';
  }
};


export default function ZonePage() {
  const [activeTab, setActiveTab] = useState('cp-agent');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    localStorage.getItem('activeTab') && setActiveTab(localStorage.getItem('activeTab')!);
  },[])

  function handleTabChange(tabKey: string) {
    setActiveTab(tabKey);
    localStorage.setItem('activeTab', tabKey);
  }

  const handleAddNew = () => {
    if (activeTab === 'cp-agent') {
      router.push('/cp-agent/add-cp');
    } else if (activeTab === 'bank-account') {
      router.push('/bank-account/add-bank');
    } else if (activeTab === 'employee') {
      router.push('/employee/add-employee');
    } else if (activeTab === 'vendor-supplier') {
      router.push('/vendor-supplier/add-vendor');
    } else if (activeTab === 'package-type') {
      router.push('/package-type/add-package');
    } else if (activeTab === 'phase') {
      router.push('/phase/add-phase');
    } else if (activeTab === 'zone') {
      router.push('/zone/add-zone');
    } else if (activeTab === 'tag') {
      router.push('/tag/add-tag');
    } else if (activeTab === 'tag-type') {
      router.push('/tag-type/add-tagtype');
    } else if (activeTab === 'tag-approval') {
      router.push('/tag-approval/approval-request');
    }
    else if (activeTab === 'tag-approval') {
      router.push('/tag-approval');
    } else if (activeTab === 'tag-type') {
      router.push('/tag-type');
    } else {
      console.log(`Add new ${activeTab}`);
    }

  };
  const renderContent = () => {
    switch (activeTab) {
      case 'cp-agent':
        return (
          <CpAgentTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'bank-account':
        return (
          <BankAccountTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'employee':
        return (
          <EmployeeTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'vendor-supplier':
        return (
          <VendorTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'package-type':
        return (
          <PackageTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'phase':
        return (
          <PhaseTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'zone':
        return (
          <ZoneTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
      case 'tag':
        return (
          <TagTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
case 'tag-approval':
        return (
          <TagApprovalTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
        case 'tag-type':
        return (
          <TagTypeTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddNew={handleAddNew}
            addButtonLabel={getAddButtonLabel(activeTab)}
          />
        );
        
           
      default:
        return (
          <ZoneTable
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
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