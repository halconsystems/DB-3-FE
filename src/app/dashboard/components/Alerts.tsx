"use client";

import styles from "./DashboardComponents.module.css";

const alerts = [
  "05 Pending Approvals",
  "03 Incomplete Registrations",
  "02 Payment Verification",
  "04 Package Approvals",
];

export default function Alerts() {
  return (
    <div className={styles.alertsCard}>
      <h2 className={styles.alertsTitle}>Alerts</h2>

      <div className={styles.alertsList}>
        {alerts.map((alertText, index) => (
          <div
            key={`${alertText}-${index}`}
            className={`${styles.alertItem} ${index !== alerts.length - 1 ? styles.alertItemBorder : ""}`}
          >
            <input type="checkbox" className={styles.alertCheckbox} aria-label={alertText} />
            <span className={styles.alertText}>{alertText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}