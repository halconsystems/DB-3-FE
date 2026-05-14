"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import styles from "./DashboardComponents.module.css";

const data = [
  { month: "JAN", value: 470 },
  { month: "FEB", value: 240 },
  { month: "MAR", value: 260 },
  { month: "APR", value: 70 },
  { month: "MAY", value: 380 },
  { month: "JUN", value: 95 },
  { month: "JUL", value: 501 },
];

function ActiveBar({ x = 0, y = 0, width = 0, height = 0, value }: { x?: number; y?: number; width?: number; height?: number; value?: number | string }) {
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
      <rect x={x} y={y} width={width} height={height} rx={4} ry={4} fill="#35b53f" />
      <rect x={labelX} y={labelY} rx={4} ry={4} width={labelWidth} height={labelHeight} fill="#171a22" />
      <path d={`M ${pointerX - 5} ${labelY + labelHeight} L ${pointerX + 5} ${labelY + labelHeight} L ${pointerX} ${labelY + labelHeight + 6} Z`} fill="#171a22" />
      <text x={x + width / 2} y={labelY + labelHeight / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">
        {value}k
      </text>
    </g>
  );
}

function MonthTick({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value?: string } }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#7a869f" fontSize="10" fontWeight="500">
        {String(payload?.value ?? "")}
      </text>
    </g>
  );
}

export default function InvoiceAnalysisCard() {
  const [selectedRange, setSelectedRange] = useState("Month");

  return (
    <div className={styles.invoiceAnalysisRoot}>
      <div className={styles.invoiceAnalysisHeader}>
        <h2 className={styles.invoiceAnalysisTitle}>4- Invoice Analysis</h2>
        <div className={styles.rangeToggleGroup} aria-label="Invoice analysis range selector">
          {(["Week", "Month", "Year"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.rangeToggleButton} ${selectedRange === item ? styles.rangeToggleButtonActive : ""}`}
              onClick={() => setSelectedRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={262}>
        <BarChart data={data} barCategoryGap="36%" margin={{ top: 18, right: 8, left: -10, bottom: 0 }} style={{ outline: 'none' }}>
          <CartesianGrid horizontal vertical={false} stroke="#dfe5ee" strokeDasharray="4 6" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} tick={<MonthTick />} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 1000]}
            ticks={[0, 50, 100, 250, 400, 500, 1000]}
            tick={{ fontWeight: 500, fontSize: 12, fill: '#2f3b52' }}
            tickFormatter={(value) => {
              if (value === 0) return '0';
              if (value === 50) return '50K';
              if (value === 100) return '100K';
              if (value === 250) return '250K';
              if (value === 400) return '400K';
              if (value === 500) return '500K';
              return '1M';
            }}
          />
          <Tooltip cursor={false} content={() => null} />
          <Bar dataKey="value" fill="#35b53f" radius={[4, 4, 0, 0]} barSize={18} activeBar={<ActiveBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
