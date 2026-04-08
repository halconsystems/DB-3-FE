'use client';
import React, { useState, useEffect } from "react";
import { useExternalSearch } from "../../app/dashboard/hooks/useExternalSearch";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./DashboardLayout.module.css";
import CircularButton from "../ui/CircularButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  userName?: string;
  userAvatarUrl?: string;
  headerAction?: React.ReactNode;
}

// Icon mapping for menu items
const MENU_ICONS: Record<string, { active: string; inactive: string }> = {
  '/dashboard': { active: 'Dashboardgreen.svg', inactive: 'Dashboard.svg' },
  '/setup': { active: 'Setupgreen.svg', inactive: 'Setup.png' },
  '/user': { active: 'Residentialgreen.svg', inactive: 'Residential.png' },
  '/user-family': { active: 'Userfamilygreen.svg', inactive: 'Userfamily.svg' },
  '/vehicle': { active: 'Vehiclegreen.svg', inactive: 'Vehicle.png' },
  '/visitors': { active: 'Visitorgreen.svg', inactive: 'Visitor.png' },
  '/workers': { active: 'Workergreen.png', inactive: 'Worker.png' },
  '/luggage': { active: 'Luggagegreen.png', inactive: 'Luggage.png' },
};

// Helper function to get icon based on active state
const getMenuIcon = (path: string, isActive: boolean): string => {
  const icons = MENU_ICONS[path];
  return icons ? `/icons/${icons[isActive ? 'active' : 'inactive']}` : '';
};

export default function DashboardLayout({ children, pageTitle = "Dashboard", userName = "Ahmed Faraz", userAvatarUrl, headerAction }: DashboardLayoutProps) {
  const [memberTypeOpen, setMemberTypeOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('/dashboard');
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const externalSearchMutation = useExternalSearch();

  // Optionally, handle results in state or UI
  useEffect(() => {
    if (externalSearchMutation.status === "pending") {
      setSearchLoading(true);
      setSearchError(null);
    } else if (externalSearchMutation.status === "success") {
      const data: import("../../services/dashboard.service").ExternalSearchResponse = externalSearchMutation.data;
      setSearchResults(data?.data?.items || []);
      setSearchLoading(false);
      setSearchError(null);
    } else if (externalSearchMutation.status === "error") {
      setSearchLoading(false);
      setSearchError("Search failed. Please try again.");
    }
  }, [externalSearchMutation.status, externalSearchMutation.data, externalSearchMutation.error]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setActiveMenuItem(pathname ?? "");
  }, [pathname]);

  const handleLogout = () => {
    router.push('/auth/sign-in');
  };

  const handleSearch = () => {
    externalSearchMutation.mutate({
      pageNumber: 0,
      pageSize: 10,
      globalSearch: searchValue,
      name: "",
      cnic: "",
      phoneNumber: "",
      tagNumber: "",
      rfidCardNumber: "",
      workerCardNumber: "",
      vehicleLicensePlate: "",
      cardStatus: 0,
      tagStatus: 0,
      userType: 0,
      validFrom: new Date().toISOString(),
      validTo: new Date().toISOString(),
    });
  };

  return (
    <div className={styles.dashboardWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logoSection}>
          <img src="/images/PDOHA.png" alt="Logo" className={styles.logo} />
          <div className={styles.logoSeparator} />
        </div>
        <nav className={styles.menu}>
          <Link 
            href="/dashboard" 
            className={`${activeMenuItem === '/dashboard' ? styles.menuItemActive : ''} ${styles.menuItemGap} ${styles.menuItem}`}
          >
            <span>Dashboard</span>
            <img src={getMenuIcon('/dashboard', activeMenuItem === '/dashboard')} alt="" className={styles.menuIconImg} />
          </Link>
          <Link 
            href="/setup" 
            className={`${activeMenuItem.includes('/setup') ? styles.menuItemActive : ''} ${styles.menuItemGap} ${styles.menuItem}`}
          >
            <span>Setup</span>
            <img src={getMenuIcon('/setup', activeMenuItem.includes('/setup'))} alt="" className={styles.menuIconImg} />
          </Link>
          <div 
            className={styles.menuSectionTitle} 
            onClick={() => setMemberTypeOpen(!memberTypeOpen)}
            style={{ cursor: 'pointer' }}
          >
            <span>Member Type</span>
            <img 
              src="/icons/Arrow.png" 
              alt="" 
              className={`${styles.menuDropdownIconImg} ${memberTypeOpen ? styles.menuDropdownIconOpen : ''}`}
            />
          </div>
          {memberTypeOpen && (
            <>
              <Link 
                href="/user" 
                className={`${(activeMenuItem === '/user' || activeMenuItem.startsWith('/user/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>User</span>
                <img src={getMenuIcon('/user', (activeMenuItem === '/user' || activeMenuItem.startsWith('/user/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/user-family" 
                className={`${(activeMenuItem === '/user-family' || activeMenuItem.startsWith('/user-family/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>User Family</span>
                <img src={getMenuIcon('/user-family', (activeMenuItem === '/user-family' || activeMenuItem.startsWith('/user-family/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/vehicle" 
                className={`${(activeMenuItem === '/vehicle' || activeMenuItem.startsWith('/vehicle/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Vehicles</span>
                <img src={getMenuIcon('/vehicle', (activeMenuItem === '/vehicle' || activeMenuItem.startsWith('/vehicle/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/visitors" 
                className={`${(activeMenuItem === '/visitors' || activeMenuItem.startsWith('/visitors/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Visitor</span>
                <img src={getMenuIcon('/visitors', (activeMenuItem === '/visitors' || activeMenuItem.startsWith('/visitors/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/workers" 
                className={`${(activeMenuItem === '/workers' || activeMenuItem.startsWith('/workers/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Workers</span>
                <img src={getMenuIcon('/workers', (activeMenuItem === '/workers' || activeMenuItem.startsWith('/workers/')))} alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/luggage" 
                className={`${(activeMenuItem === '/luggage' || activeMenuItem.startsWith('/luggage/')) ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Luggage Pass</span>
                <img src={getMenuIcon('/luggage', (activeMenuItem === '/luggage' || activeMenuItem.startsWith('/luggage/')))} alt="" className={styles.menuIconImg} />
              </Link>
            </>
          )}
          <div className={styles.menuSeparator} />
        </nav>
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span>Logout</span>
            <img src="/icons/Log Out.png" alt="" className={styles.logoutIconImg} />
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitleWrapper}>
            {(activeMenuItem.match(/\//g)?.length ?? 0) >= 2 && (<img 
              src="/icons/arrow-back.png" 
              alt="Back" 
              className={styles.backArrowImg} 
              onClick={() => router.back()}
            />)}
            <div className={styles.headerTitle}>{pageTitle}</div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <CircularButton imagePath="/icons/Search Icon.svg" imageAlt="Search" width={32} height={32} onClick={handleSearch} pos="abs"/>
            </div>
            {searchLoading && (
              <div style={{ marginTop: 8, color: '#888' }}>Searching...</div>
            )}
            {searchError && (
              <div style={{ marginTop: 8, color: 'red' }}>{searchError}</div>
            )}
            {searchResults.length > 0 && (
              <div style={{ marginTop: 8, background: '#fff', border: '1px solid #eee', borderRadius: 4, maxHeight: 200, overflowY: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 8 }}>
                  {searchResults.map((item, idx) => (
                    <li key={idx} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                      {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/notification" className={styles.notificationWrapper}>
              <img src="/icons/basil_notification-on-solid.png" alt="" className={styles.notificationIconImg} />
            </Link>
            <div className={styles.userInfoWrapper}>
              <div 
                className={styles.userInfo} 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <img src={userAvatarUrl || "/icons/Profile Picture.jpg"} alt="User" className={styles.userAvatar} />
                <div className={styles.userTextWrapper}>
                  <span className={styles.welcomeText}>👋 Welcome Back,</span>
                  <span className={styles.userName}>{userName}</span>
                </div>
                <img src="/icons/gridicons_dropdown.png" alt="" className={styles.userDropdownImg} />
              </div>
              {profileDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <Link href="/profile" className={styles.profileDropdownItem}>
                    <span>Profile</span>
                  </Link>
                  <div className={styles.profileDropdownDivider} />
                  <div className={styles.profileDropdownItem}>
                    <span>Notifications</span>
                    <label className={styles.toggleSwitch}>
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled} 
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
          </div>
        </header>
        <section className={styles.contentSection}>{children}</section>
      </main>
    </div>
  );
}
