"use client";

import { motion } from "framer-motion";

export function LineChart({
  data,
  height = 200,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const width = 480;
  const pad = 28;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const min = Math.min(...data.map((d) => d.value)) * 0.85;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = pad + (i * (width - pad * 2)) / (data.length - 1);
    const y = height - pad - ((d.value - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - pad} L ${points[0].x} ${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.5, 1].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={width - pad}
          y1={pad + g * (height - pad * 2)}
          y2={pad + g * (height - pad * 2)}
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth={1}
        />
      ))}

      <motion.path
        d={areaPath}
        fill="url(#lineFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke="#7c5cff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill="#7c5cff"
          className="stroke-white dark:stroke-slate-900"
          strokeWidth={2}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.06 }}
        />
      ))}
      {data.map((d, i) => (
        <text
          key={d.label}
          x={points[i].x}
          y={height - 8}
          textAnchor="middle"
          className="fill-slate-400 text-[10px]"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
