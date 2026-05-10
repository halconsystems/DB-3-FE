'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tab } from '@/components/tables/DataTable';
import { CLUB_MEMBERS_TABS } from './clubMembersConfig';

interface ClubMembersContextType {
  activeTab: string;
  tabs: Tab[];
  handleTabChange: (tabKey: string) => void;
}

const ClubMembersContext = React.createContext<ClubMembersContextType | undefined>(undefined);

const isKnownTabKey = (key: string) => CLUB_MEMBERS_TABS.some((t) => t.key === key);

export const ClubMembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('golf-club');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname?.match(/^\/club-members\/([^/]+)/)?.[1];
    if (segment && isKnownTabKey(segment)) {
      setActiveTab(segment);
      localStorage.setItem('activeClubMembersTab', segment);
      return;
    }
    const savedTab = localStorage.getItem('activeClubMembersTab');
    if (savedTab && isKnownTabKey(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [pathname]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    localStorage.setItem('activeClubMembersTab', tabKey);
    router.push(`/club-members/${tabKey}`);
  };

  const value: ClubMembersContextType = {
    activeTab,
    tabs: CLUB_MEMBERS_TABS,
    handleTabChange,
  };

  return (
    <ClubMembersContext.Provider value={value}>
      {children}
    </ClubMembersContext.Provider>
  );
};

export const useClubMembers = () => {
  const context = React.useContext(ClubMembersContext);
  if (!context) {
    throw new Error('useClubMembers must be used within ClubMembersProvider');
  }
  return context;
};
