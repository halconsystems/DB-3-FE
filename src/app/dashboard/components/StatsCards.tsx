
import styles from "./DashboardComponents.module.css";

export default function StatsCards() {
  const stats = [
    { title: "Total CP/Agents", value: "05", iconPath: "/icons/Stats/Stats.CPAgents.svg", iconAlt: "Total CP Agents" },
    { title: "Members Register", value: "3200", iconPath: "/icons/Stats/Stats.Member.svg", iconAlt: "Members Register" },
    { title: "Active Package", value: "2800", iconPath: "/icons/Stats/Stats.Active.svg", iconAlt: "Active Package" },
    { title: "Total Employees", value: "890", iconPath: "/icons/Stats/Stats.Employees.svg", iconAlt: "Total Employees" },
    { title: "Total Vendors/Suppliers", value: "321", iconPath: "/icons/Stats/Stats.Vendor.svg", iconAlt: "Total Vendors Suppliers" },
    { title: "Total Bank Accounts", value: "2901", iconPath: "/icons/Stats/Stats.Bank.svg", iconAlt: "Total Bank Accounts" },
    { title: "Total Phases", value: "08", iconPath: "/icons/Stats/Stats.Phases.svg", iconAlt: "Total Phases" },
    { title: "Total Zones", value: "16", iconPath: "/icons/Stats/Stats.Zones.svg", iconAlt: "Total Zones" },
  ];

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        {stats.map((item, i) => (
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
