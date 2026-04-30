'use client';
import { useMemo, useState } from 'react';
import DataTable, { Column, StatusBadge, Tab } from '@/components/tables/DataTable';
import styles from './CardManagementTable.module.css';

interface CardManagementTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}

type MainCardTab = 'resident' | 'non-resident' | 'dha-staff' | 'club-card' | 'worker-card';
type ResidentTableTab = 'member-card' | 'non-member-card';
type WorkerTableTab = 'commercial-employee' | 'house-help-staff';

interface CardRow {
  userName: string;
  email: string;
  phone: string;
  cnicNo: string;
  userType: string;
  rfidCardNo: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: number;
}

const cardColumns: Column<CardRow>[] = [
  { key: 'userName', header: 'User Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'cnicNo', header: 'CNIC No.' },
  { key: 'userType', header: 'User Type' },
  { key: 'rfidCardNo', header: 'RFID Card No.' },
  { key: 'cardIssueDate', header: 'Card Issue Date' },
  { key: 'cardExpiryDate', header: 'Card Expiry Date' },
  {
    key: 'cardStatus',
    header: 'Card Status',
    render: (value) => <StatusBadge type="cardStatus" value={value} />,
  },
];

const baseRows: CardRow[] = [
  {
    userName: 'Shahid Hussain',
    email: 'shahid@gmail.com',
    phone: '0301-2346550',
    cnicNo: '12345-1234567-1',
    userType: 'Member',
    rfidCardNo: 'UID-9279645300001192',
    cardIssueDate: '07-02-2025',
    cardExpiryDate: '07-02-2026',
    cardStatus: 3,
  },
  {
    userName: 'Ahmed Faraz',
    email: 'ahmed@gmail.com',
    phone: '0301-2346540',
    cnicNo: '12345-4564567-1',
    userType: 'Member',
    rfidCardNo: 'UID-9279645300001144',
    cardIssueDate: '07-02-2025',
    cardExpiryDate: '07-02-2026',
    cardStatus: 6,
  },
  {
    userName: 'Mustafa Javaid',
    email: 'mustafa@gmail.com',
    phone: '0301-2346530',
    cnicNo: '12345-4522267-1',
    userType: 'Member',
    rfidCardNo: 'UID-9279645300001136',
    cardIssueDate: '07-02-2025',
    cardExpiryDate: '07-02-2026',
    cardStatus: 3,
  },
  {
    userName: 'Arsalan Khan',
    email: 'arsalan@gmail.com',
    phone: '0301-2346520',
    cnicNo: '12345-4528907-1',
    userType: 'Member',
    rfidCardNo: 'UID-9279645300001100',
    cardIssueDate: '07-02-2025',
    cardExpiryDate: '07-02-2026',
    cardStatus: 5,
  },
];

const residentMemberRows = baseRows;
const residentNonMemberRows = baseRows.map((row) => ({ ...row, userType: 'Non Member' }));
const workerCommercialRows = baseRows.map((row) => ({ ...row, userType: 'Commercial Employee' }));
const workerHouseHelpRows = baseRows.map((row) => ({ ...row, userType: 'House-Help Staff' }));

export default function CardManagementTable({
  tabs,
  activeTab,
  onTabChange,
}: CardManagementTableProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainCardTab>('resident');
  const [residentTableTab, setResidentTableTab] = useState<ResidentTableTab>('member-card');
  const [workerTableTab, setWorkerTableTab] = useState<WorkerTableTab>('commercial-employee');
  const [currentPage, setCurrentPage] = useState(1);

  const mainTabs: Array<{ key: MainCardTab; label: string }> = [
    { key: 'resident', label: 'Resident' },
    { key: 'non-resident', label: 'Non-Resident' },
    { key: 'dha-staff', label: 'DHA Staff' },
    { key: 'club-card', label: 'Club Card' },
    { key: 'worker-card', label: 'Worker Card' },
  ];

  const selectedRows = useMemo(() => {
    if (activeMainTab === 'resident') {
      return residentTableTab === 'member-card' ? residentMemberRows : residentNonMemberRows;
    }

    if (activeMainTab === 'worker-card') {
      return workerTableTab === 'commercial-employee' ? workerCommercialRows : workerHouseHelpRows;
    }

    return [];
  }, [activeMainTab, residentTableTab, workerTableTab]);

  const headerContent = (
    <div className={styles.headerBlock}>
      <div className={styles.mainTabs}>
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveMainTab(tab.key);
              setCurrentPage(1);
            }}
            className={`${styles.mainTab} ${activeMainTab === tab.key ? styles.mainTabActive : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeMainTab === 'resident' && (
        <div className={styles.subTabs}>
          {[
            { key: 'member-card', label: 'Member Card' },
            { key: 'non-member-card', label: 'Non Member Card' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setResidentTableTab(tab.key as ResidentTableTab);
                setCurrentPage(1);
              }}
              className={`${styles.subTab} ${residentTableTab === tab.key ? styles.subTabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeMainTab === 'worker-card' && (
        <div className={styles.subTabs}>
          {[
            { key: 'commercial-employee', label: 'Commercial Employee' },
            { key: 'house-help-staff', label: 'House-Help Staff' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setWorkerTableTab(tab.key as WorkerTableTab);
                setCurrentPage(1);
              }}
              className={`${styles.subTab} ${workerTableTab === tab.key ? styles.subTabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DataTable<CardRow>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      columns={cardColumns}
      data={selectedRows}
      showAddButton={false}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      headerContent={headerContent}
      enableCardStatusFilter={false}
      enableSorting={false}
      filterPlaceholder="Name"
      searchVariant="card-management"
      showSearchActionButton
    />
  );
}
