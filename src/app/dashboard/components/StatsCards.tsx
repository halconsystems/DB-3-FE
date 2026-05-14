
import styles from "./DashboardComponents.module.css";

interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  iconPath: string;
  iconAlt: string;
}

export default function StatsCards() {
  // Dashboard statistics - can be replaced with API data
  const dashboardStats: StatItem[] = [
    { 
      title: "Total Users", 
      value: "24,687", 
      change: "+12.5%",
      changeType: 'positive',
      iconPath: "/icons/Stats/Stats.Member.svg", 
      iconAlt: "Total Users" 
    },
    { 
      title: "Today Users", 
      value: "1,565", 
      change: "+8.4%",
      changeType: 'positive',
      iconPath: "/icons/Stats/Stats.Active.svg", 
      iconAlt: "Today Users" 
    },
    { 
      title: "Total Tags", 
      value: "15,998", 
      iconPath: "/icons/Stats/Stats.CPAgents.svg", 
      iconAlt: "Total Tags" 
    },
    { 
      title: "Total Invoices", 
      value: "9,694", 
      iconPath: "/icons/Stats/Stats.Employees.svg", 
      iconAlt: "Total Invoices" 
    },
    { 
      title: "Total Employees", 
      value: "765", 
      iconPath: "/icons/Stats/Stats.Member.svg", 
      iconAlt: "Total Employees" 
    },
    { 
      title: "Total Packages", 
      value: "122", 
      iconPath: "/icons/Stats/Stats.CPAgents.svg", 
      iconAlt: "Total Packages" 
    },
  ];

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        {dashboardStats.map((item, i) => (
          <div key={i} className={styles.statsCard}>
            <div className={styles.statsLeftSection}>
              <div className={styles.statsIconBox}>
                <img src={item.iconPath} alt={item.iconAlt} className={styles.statsIconImg} />
              </div>
              {item.change && (
                <div className={`${styles.statsPercentage} ${styles[`statsPercentage${item.changeType || 'neutral'}`]}`}>
                  {item.change}
                </div>
              )}
            </div>
            <div className={styles.statsContent}>
              <div className={styles.statsTitle}>{item.title}</div>
              <div className={styles.statsValue}>{item.value}</div>
              {item.change && (
                <div className={`${styles.statsChange} ${styles[`statsChange${item.changeType || 'neutral'}`]}`}>
                  vs last 7 days
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
