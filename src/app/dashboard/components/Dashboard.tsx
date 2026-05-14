"use client"
import { useState } from 'react';
import StatsCards from "./StatsCards"
import AnalysisChart from "./AnalysisChart"
import TodayUsersChart from "./TodayUsersChart"
import PackageChart from "./PackageChart"
import InvoiceAnalysisCard from "./InvoiceAnalysisCard"
import TagsRequestedTodayCard from "./TagsRequestedTodayCard"
import { RangeDatePicker } from '@/components/date-pickers/CustomDatePickers';
import styles from "./DashboardComponents.module.css"

export default function Dashboard() {
  const [fromDate, setFromDate] = useState('2026-02-21');
  const [toDate, setToDate] = useState('2026-03-20');

  return (
    <div className={styles.dashboardRoot}>

      {/* LEFT MAIN DASHBOARD */}
      <div className={`${styles.dashboardMain} ${styles.spacedSection}`}>
        <div className={styles.dateRangeSection}>
          <div className={styles.dateRangeCard}>
            <p className={styles.dateRangeLabel}>Date Range</p>
            <RangeDatePicker
              fromValue={fromDate}
              toValue={toDate}
              onFromChange={setFromDate}
              onToChange={setToDate}
              label="Select Date Range"
            />
          </div>
        </div>
        <StatsCards />
        <div className={styles.chartGrid}>
          <div className={styles.analysisCard}>
            <AnalysisChart />
          </div>
          <div className={styles.vehicleCard}>
            <TodayUsersChart />
          </div>
          <div className={styles.tagsCard}>
            <PackageChart />
          </div>
        </div>
        <div className={styles.bottomCardGrid}>
          <div className={styles.invoiceAnalysisCard}>
            <InvoiceAnalysisCard />
          </div>
          <div className={styles.tagsRequestedCard}>
            <TagsRequestedTodayCard />
          </div>
        </div>
      </div>

    </div>
  )
}