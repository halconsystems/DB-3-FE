"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from 'recharts';
import styles from "./DashboardComponents.module.css";

const data = [
  { name: "Basic", value: 1200 },
  { name: "VIP", value: 600 },
  { name: "Premium", value: 600 },
  { name: "Standard", value: 500 },
];

const COLORS = ["#22c55e", "#FEBE00", "#2C95FD", "#bbf7d0"];

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

  // radius where label should sit (70% between inner and outer radius)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  // calculate center of label
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const width = 38;
  const height = 24;

  return (
    <g>
      <foreignObject
        x={x - width / 2}   // shift left by half width
        y={y - height / 2}  // shift up by half height
        width={width}
        height={height}
      >
        <div
          style={{
            background: "white",
            color: '#22c55e',
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 12,
            width: width,
            height: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0001',
          }}
        >
          {value}
        </div>
      </foreignObject>
    </g>
  );
}

export default function PackageChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className={styles.vehiclesRoot}>
      <div className={styles.vehiclesChartRow}>

        <div>
          <h2 className={styles.vehiclesTitle}>Package Distribution</h2>
          <div className={styles.vehiclesTotal}>{total}</div>
        </div>

        {/* Legend below chart */}
        <div className={styles.vehiclesLegend}>
          {data.map((entry, index) => (
            <div key={index} className={styles.vehiclesLegendItem}>
              <span className={styles.vehiclesLegendDot} style={{ background: COLORS[index] }}></span>
              <span className={styles.vehiclesLegendText}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
        
        <div className={styles.vehiclesChartContainer}>
          <ResponsiveContainer width={250} height={250} >
            <PieChart >
              <Pie
                data={data}
                dataKey="value"
                outerRadius={120}
                startAngle={270}
                endAngle={-90}
                label={renderCustomLabel}
                labelLine={false}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}
