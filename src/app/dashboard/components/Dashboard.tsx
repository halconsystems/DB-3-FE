"use client"
import StatsCards from "./StatsCards"
import AnalysisChart from "./AnalysisChart"
import PackageChart from "./PackageChart"
import RecentActivities from "./RecentActivites"
import Alerts from "./Alerts"
import styles from "./DashboardComponents.module.css"

export default function Dashboard() {
  return (
    <div className={styles.dashboardRoot}>

      {/* LEFT MAIN DASHBOARD */}
      <div className={`${styles.dashboardMain} ${styles.spacedSection}`}>
        <StatsCards />
        <div className={styles.chartGrid}>
          <div className={styles.analysisCard}>
            <AnalysisChart />
          </div>
          <div className={styles.vehicleCard}>
            <PackageChart />
          </div>
            <div className={styles.alertsWrapper}>
              <Alerts />
            </div>
        </div>
        <RecentActivities />
      </div>

    </div>
  )
}