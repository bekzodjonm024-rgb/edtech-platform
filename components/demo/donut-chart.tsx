"use client";

import { motion } from "framer-motion";

type Segment = { label: string; value: number; count?: number; color: string };

export function DonutChart({
  data,
  size = 180,
  centerLabel,
}: {
  data: Segment[];
  size?: number;
  centerLabel?: string;
}) {
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  let offsetAcc = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-slate-100 dark:stroke-slate-800"
          />
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const segOffset = offsetAcc;
            offsetAcc += dash;
            return (
              <motion.circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                initial={{ strokeDashoffset: -circumference }}
                whileInView={{ strokeDashoffset: -segOffset }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{total}%</span>
          {centerLabel && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{centerLabel}</span>
          )}
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
            </span>
            <span className="font-medium">
              {d.value}%{d.count != null && <span className="ml-1 text-slate-400">({d.count})</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
