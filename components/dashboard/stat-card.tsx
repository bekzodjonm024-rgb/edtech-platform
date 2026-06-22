"use client";

import { Card } from "@/components/ui/card";
import { chipColors } from "./colors";
import {
  Book,
  ClipboardList,
  Users,
  Target,
  CheckCircle2,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  book: Book,
  clipboard: ClipboardList,
  users: Users,
  target: Target,
  checkCircle: CheckCircle2,
  trophy: Trophy,
};

export function StatCard({
  label,
  value,
  delta,
  color,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  color: string;
  icon: string;
}) {
  const Icon = icons[icon] ?? Book;
  const positive = delta?.startsWith("+");

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${chipColors[color]}`}>
          <Icon className="h-5 w-5" />
        </span>
        {delta && (
          <span
            className={`text-xs font-semibold ${
              positive ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </Card>
  );
}
