"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import styles from "./DashboardComponents.module.css";

const data = [
  { name: "Pending", value: 60 },
  { name: "Approved", value: 20 },
  { name: "Rejected", value: 20 },
];

const COLORS = ["#35b53f", "#ffbf00", "#ff1a14"];

const legendItems = [
  { label: "Pending - 300", color: COLORS[0] },
  { label: "Approved - 100", color: COLORS[1] },
  { label: "Rejected - 100", color: COLORS[2] },
];

function renderCustomLabel(props: PieLabelRenderProps) {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    value = 0,
  } = props;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const width = 54;
  const height = 34;

  return (
    <g>
      <foreignObject x={x - width / 2} y={y - height / 2} width={width} height={height}>
        <div
          style={{
            background: "#ffffff",
            color: "#43506f",
            borderRadius: 5,
            fontWeight: 700,
            fontSize: 12,
            width,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e6ebf2",
          }}
        >
          {value}%
        </div>
      </foreignObject>
    </g>
  );
}

export default function TagsRequestedTodayCard() {
  return (
    <div className={styles.tagsRequestedRoot}>
      <div className={styles.tagsRequestedHeader}>
        <h2 className={styles.tagsRequestedTitle}>5- Tags Requested Today</h2>
      </div>

      <div className={styles.tagsRequestedBody}>
        <div className={styles.tagsRequestedChartArea}>
          <ResponsiveContainer width="100%" height={274}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={98}
                innerRadius={72}
                startAngle={225}
                endAngle={-135}
                label={renderCustomLabel}
                labelLine={false}
                stroke="#ffffff"
                strokeWidth={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.tagsRequestedCenter}>
            <div className={styles.tagsRequestedCenterValue}>500</div>
            <div className={styles.tagsRequestedCenterLabel}>Total Tags</div>
          </div>
        </div>

        <div className={styles.tagsRequestedLegend}>
          {legendItems.map((item) => (
            <div key={item.label} className={styles.tagsRequestedLegendItem}>
              <span className={styles.tagsRequestedLegendSwatch} style={{ background: item.color }} />
              <span className={styles.tagsRequestedLegendText}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
