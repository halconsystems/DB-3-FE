"use client";

import { useMemo, useState } from "react";
import DataTable, { Column, StatusBadge } from "../../../components/tables/DataTable";
import styles from "./DashboardComponents.module.css";

type RecentActivityRow = {
  id: string;
  name: string;
  type: string;
  date: string;
  status: "Active" | "Inactive";
};

const recentActivities: RecentActivityRow[] = [
  {
    id: "1",
    name: "Ali Khan",
    type: "New CP/Agent",
    date: "12-02-2026",
    status: "Active",
  },
  {
    id: "2",
    name: "Sara Ahmed",
    type: "New Member",
    date: "12-02-2026",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Shahid Hussain",
    type: "New Employee",
    date: "12-02-2026",
    status: "Active",
  },
  {
    id: "4",
    name: "Gold Package",
    type: "New Package",
    date: "12-02-2026",
    status: "Inactive",
  },
  {
    id: "5",
    name: "Hina Tariq",
    type: "New Member",
    date: "13-02-2026",
    status: "Active",
  },
  {
    id: "6",
    name: "Corporate Vendor",
    type: "New Supplier",
    date: "13-02-2026",
    status: "Inactive",
  },
];

const columns: Column<RecentActivityRow>[] = [
  { key: "name", header: "Name" },
  { key: "type", header: "Type" },
  { key: "date", header: "Date" },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];

export default function RecentActivities() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(recentActivities.length / rowsPerPage)),
    [rowsPerPage]
  );

  return (
    <div className={styles.recentActivitiesSection}>
      <DataTable
        columns={columns}
        data={recentActivities}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        showAddButton={false}
        emptyMessage="No recent activities found."
        headerContent={
          <div className={styles.recentActivitiesHeader}>
            <h2 className={styles.recentActivitiesTitle}>Recent Activities</h2>
            <div className={styles.rowSelectGroup}>
              <span className={styles.rowLabel}>Rows :</span>
              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className={styles.rowSelect}
              >
                {[4, 5, 10, 20].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      />
    </div>
  );
}
