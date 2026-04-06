
import styles from "./DashboardComponents.module.css";
import { useSyncSummary } from "../../../hooks/dashboard/useSyncSummary";

export default function StatsCards() {
  const { data, isLoading, isError } = useSyncSummary();

  const syncStats = [
    { title: "Total Records", value: data?.data.totalRecords ?? "-", iconPath: "/icons/Stats/Stats.CPAgents.svg", iconAlt: "Total Records" },
    { title: "Total Success", value: data?.data.totalSuccess ?? "-", iconPath: "/icons/Stats/Stats.Member.svg", iconAlt: "Total Success" },
    { title: "Total Failed", value: data?.data.totalFailed ?? "-", iconPath: "/icons/Stats/Stats.Active.svg", iconAlt: "Total Failed" },
    { title: "Total Pending Retry", value: data?.data.totalPendingRetry ?? "-", iconPath: "/icons/Stats/Stats.Employees.svg", iconAlt: "Total Pending Retry" },
  ];

  if (isError) return <div>Failed to load sync summary.</div>;

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        {syncStats.map((item, i) => (
          <div key={i} className={styles.statsCard}>
            <div className={styles.statsIconBox}>
              <img src={item.iconPath} alt={item.iconAlt} className={styles.statsIconImg} />
            </div>
            <div>
              <div className={styles.statsTitle}>{item.title}</div>
              <div className={styles.statsValue}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
