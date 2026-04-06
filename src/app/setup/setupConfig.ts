import { Tab } from '@/components/tables/DataTable';

export const SETUP_TABS: Tab[] = [
  { key: 'cp-agent', label: 'CP/Agent' },
  { key: 'bank-account', label: 'Bank Account' },
  { key: 'employee', label: 'Employee' },
  { key: 'vendor-supplier', label: 'Vendor / Supplier' },
  { key: 'package-type', label: 'Package Type' },
  { key: 'phase', label: 'Phase' },
  { key: 'zone', label: 'Zone' },
  { key: 'fee-scale', label: 'Fee Scale' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'tag', label: 'Tag' },
  { key: 'tag-approval', label: 'Approve' },
  { key: 'tag-type', label: 'Tag Type' },
  { key: 'tag-log', label: 'Approved tags' },
];

export const getAddButtonLabel = (tab: string): string => {
  switch (tab) {
    case 'cp-agent':
      return 'Add CP/Agent';
    case 'bank-account':
      return 'Add Bank Account';
    case 'employee':
      return 'Add Employee';
    case 'vendor-supplier':
      return 'Add Vendor/Supplier';
    case 'package-type':
      return 'Add Package Type';
    case 'fee-scale':
      return 'Add Fee Scale';
    case 'invoice':
      return 'Add Invoice';
    case 'phase':
      return 'Add Phase';
    case 'zone':
      return 'Add Zone';
    case 'tag':
      return 'Create Tag';
    case 'tag-approval':
      return 'Request Approval';
    case 'tag-type':
      return 'Add Tag Type';
    default:
      return 'Add New';
  }
};

export const ROUTE_MAP: { [key: string]: string } = {
  'employee': '/setup/employee/add-employee',
  'zone': '/setup/zone/add-zone',
  'cp-agent': '/setup/cp-agent/add-cp',
  'bank-account': '/setup/bank-account/add-bank',
  'vendor-supplier': '/setup/vendor-supplier/add-vendor',
  'package-type': '/setup/package-type/add-package',
  'phase': '/setup/phase/add-phase',
  'fee-scale': '/setup/fee-scale/add-fee-scale',
  'invoice': '/setup/invoice/add-invoice',
  'tag': '/setup/tag/add-tag',
  'tag-type': '/setup/tag-type/add-tagtype',
  'tag-approval': '/setup/tag-approval/approval-request',
};
