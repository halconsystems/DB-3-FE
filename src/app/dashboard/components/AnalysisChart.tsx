"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import styles from "./DashboardComponents.module.css";

const data = [
  { day: "MON", registrations: 370 },
  { day: "TUE", registrations: 225 },
  { day: "WED", registrations: 245 },
  { day: "THU", registrations: 105 },
  { day: "FRY", registrations: 285 },
  { day: "SAT", registrations: 140 },
  { day: "SUN", registrations: 410 },
];

type AnalysisBarLabelProps = {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  value?: number | string;
  fill?: string;
  background?: { x?: number; y?: number; width?: number; height?: number };
};

function AnalysisActiveBar({ x = 0, y = 0, width = 0, height = 0, value, fill = "#33b43c" }: AnalysisBarLabelProps) {
  if (value === undefined || value === null) {
    return null;
  }

  const labelWidth = 38;
  const labelHeight = 24;
  const labelX = x + width / 2 - labelWidth / 2;
  const labelY = y - labelHeight - 12;
  const pointerX = x + width / 2;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={4} ry={4} fill={fill} />
      <rect
        x={labelX}
        y={labelY}
        rx={4}
        ry={4}
        width={labelWidth}
        height={labelHeight}
        fill="#171a22"
      />
      <path d={`M ${pointerX - 5} ${labelY + labelHeight} L ${pointerX + 5} ${labelY + labelHeight} L ${pointerX} ${labelY + labelHeight + 6} Z`} fill="#171a22" />
      <text
        x={x + width / 2}
        y={labelY + labelHeight / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#ffffff"
      >
        {value}
      </text>
    </g>
  );
}

export default function AnalysisChart() {
  return (
    <div className={styles.analysisRoot}>
      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>Monthly Registration</h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barCategoryGap="32%" margin={{ top: 28, right: 8, left: -20, bottom: 0 }} style={{ outline: 'none' }}>
          <CartesianGrid horizontal vertical={false} stroke="#dfe5ee" strokeDasharray="4 6" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fontWeight: 500, fontSize: 12, fill: '#7a869f' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 500]}
            ticks={[0, 100, 200, 300, 400, 500]}
            tick={{ fontWeight: 500, fontSize: 12, fill: '#2f3b52' }}
          />
          <Tooltip cursor={false} content={() => null} />
          <Bar
            dataKey="registrations"
            fill="#33b43c"
            radius={[4, 4, 0, 0]}
            barSize={18}
            activeBar={<AnalysisActiveBar />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
