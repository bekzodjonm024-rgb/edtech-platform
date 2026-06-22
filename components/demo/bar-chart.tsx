"use client";

import { motion } from "framer-motion";

export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 100);

  return (
    <div className="flex h-48 items-end justify-between gap-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60"
              title={`${d.value}%`}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
