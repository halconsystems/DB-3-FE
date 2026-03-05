'use client';
import React, { useState, useEffect } from "react";
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

export default function DashboardLayout({ children, pageTitle = "Dashboard", userName = "Ahmed Faraz", userAvatarUrl, headerAction }: DashboardLayoutProps) {
  const [memberTypeOpen, setMemberTypeOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('/dashboard');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setActiveMenuItem(pathname);
  }, [pathname]);

  const handleLogout = () => {
    router.push('/auth/sign-in');
  };

  const handleSearch = () => {
    // Add your search logic here
    console.log('Search button clicked');
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
            <img src="/icons/Dashboard.svg" alt="" className={styles.menuIconImg} />
          </Link>
          <Link 
            href="/setup" 
            className={`${activeMenuItem === '/setup' ? styles.menuItemActive : ''} ${styles.menuItemGap} ${styles.menuItem}`}
          >
            <span>Setup</span>
            <img src="/icons/Setup.png" alt="" className={styles.menuIconImg} />
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
                href="/residential" 
                className={`${activeMenuItem === '/residential' ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Residential/Commercial</span>
                <img src="/icons/Residential.png" alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/vehicle" 
                className={`${activeMenuItem === '/vehicle' ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Vehicles</span>
                <img src="/icons/Vehicle.png" alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/visitors" 
                className={`${activeMenuItem === '/visitors' ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Visitor</span>
                <img src="/icons/Visitor.png" alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/workers" 
                className={`${activeMenuItem === '/workers' ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Workers</span>
                <img src="/icons/Worker.png" alt="" className={styles.menuIconImg} />
              </Link>
              <Link 
                href="/luggage" 
                className={`${activeMenuItem === '/luggage' ? styles.menuItemActive : ''} ${styles.menuItem}`}
              >
                <span>Luggage Pass</span>
                <img src="/icons/Luggage.png" alt="" className={styles.menuIconImg} />
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
            <img 
              src="/icons/arrow-back.png" 
              alt="Back" 
              className={styles.backArrowImg} 
              onClick={() => router.back()}
            />
            <div className={styles.headerTitle}>{pageTitle}</div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <input type="text" placeholder="Search" className={styles.searchInput} />
              <CircularButton imagePath="/icons/Search Icon.svg" imageAlt="Search" width={32} height={32} onClick={handleSearch} pos="abs"/>
            </div>
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
