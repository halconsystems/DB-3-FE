'use client';
import { useState } from 'react';
import { Tab } from '@/components/tables/DataTable';
import styles from './CardManagementTable.module.css';
import { MainCardTab } from './cardType/types';
import ResidentCardTable from './cardType/ResidentCardTable';
import NonResidentCardTable from './cardType/NonResidentCardTable';
import DhaStaffCardTable from './cardType/DhaStaffCardTable';
import ClubCardTable from './cardType/ClubCardTable';
import WorkerCardTable from './cardType/WorkerCardTable';

interface CardManagementTableProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
  searchParams?: any | null;
}

export default function CardManagementTable({
  tabs,
  activeTab,
  onTabChange,
}: CardManagementTableProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainCardTab>('resident');

  const mainTabs: Array<{ key: MainCardTab; label: string }> = [
    { key: 'resident', label: 'Resident' },
    { key: 'non-resident', label: 'Non-Resident' },
    { key: 'dha-staff', label: 'DHA Staff' },
    { key: 'club-card', label: 'Club Card' },
    { key: 'worker-card', label: 'Worker Card' },
  ];

  const mainTabsHeader = (
    <div className={styles.headerBlock}>
      <div className={styles.mainTabs}>
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveMainTab(tab.key)}
            className={`${styles.mainTab} ${activeMainTab === tab.key ? styles.mainTabActive : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (activeMainTab === 'resident') {
    return <ResidentCardTable tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} mainTabsHeader={mainTabsHeader} />;
  }

  if (activeMainTab === 'non-resident') {
    return <NonResidentCardTable tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} mainTabsHeader={mainTabsHeader} />;
  }

  if (activeMainTab === 'dha-staff') {
    return <DhaStaffCardTable tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} mainTabsHeader={mainTabsHeader} />;
  }

  if (activeMainTab === 'club-card') {
    return <ClubCardTable tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} mainTabsHeader={mainTabsHeader} />;
  }

  return <WorkerCardTable tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} mainTabsHeader={mainTabsHeader} />;
}
