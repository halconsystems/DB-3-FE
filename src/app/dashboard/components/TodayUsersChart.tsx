"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import styles from "./DashboardComponents.module.css";

const data = [
  { day: "RES/COM", registrations: 180, label: "RES/COM" },
  { day: "EDU VISITOR", registrations: 70, label: "EDU\nVISITOR" },
  { day: "COM EMP", registrations: 290, label: "COM\nEMP" },
  { day: "HOUSE HELP WORKER", registrations: 200, label: "HOUSE HELP\nWORKER" },
  { day: "VISITOR", registrations: 165, label: "VISITOR" },
  { day: "CLUB MEM", registrations: 325, label: "CLUB\nMEM" },
  { day: "OTHERS", registrations: 140, label: "OTHERS" },
];

type ActiveBarProps = {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  value?: number | string;
  fill?: string;
};

function TodayUsersActiveBar({ x = 0, y = 0, width = 0, height = 0, value, fill = "#33b43c" }: ActiveBarProps) {
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
      <rect x={labelX} y={labelY} rx={4} ry={4} width={labelWidth} height={labelHeight} fill="#171a22" />
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

function CategoryTick({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value?: string } }) {
  const label = String(payload?.value ?? "");
  const lines = label.includes("\n") ? label.split("\n") : [label];

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#7a869f" fontSize="10" fontWeight="500">
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={0} dy={index === 0 ? 0 : 12}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export default function TodayUsersChart() {
  return (
    <div className={styles.analysisRoot}>
      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>2- Today Users</h2>
        <div className={styles.chartTotal}>
          <span className={styles.chartTotalPrefix}>Total:</span>
          <span className={styles.chartTotalValue}>1,565</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={206}>
        <BarChart data={data} barCategoryGap="32%" margin={{ top: 30, right: 8, left: -20, bottom: 0 }} style={{ outline: 'none' }}>
          <CartesianGrid horizontal vertical={false} stroke="#dfe5ee" strokeDasharray="4 6" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            interval={0}
            tick={<CategoryTick />}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 500]}
            ticks={[0, 100, 200, 300, 400, 500]}
            tickFormatter={(value) => String(value)}
            tick={{ fontWeight: 500, fontSize: 12, fill: '#2f3b52' }}
          />
          <Tooltip cursor={false} content={() => null} />
          <Bar
            dataKey="registrations"
            fill="#33b43c"
            radius={[4, 4, 0, 0]}
            barSize={18}
            activeBar={<TodayUsersActiveBar />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
