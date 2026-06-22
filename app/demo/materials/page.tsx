"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { authStrings } from "@/lib/i18n/auth-strings";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Presentation, ListChecks, Trash2, Loader2, FileText } from "lucide-react";

type Material = {
  id: string;
  kind: string;
  topic: string;
  subject: string | null;
  createdAt: string;
  data: string;
};

export default function MaterialsPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const a = authStrings[locale];
  const router = useRouter();

  const [items, setItems] = useState<Material[] | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/materials", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.materials ?? []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    setItems((p) => (p ? p.filter((m) => m.id !== id) : p));
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
  };

  const openQuiz = (m: Material) => {
    try {
      const questions = JSON.parse(m.data);
      sessionStorage.setItem("eduai-quiz", JSON.stringify({ topic: m.topic, questions }));
    } catch {
      /* ignore */
    }
    router.push("/demo/quiz");
  };

  const parseSlides = (m: Material): { title: string; body?: string }[] => {
    try {
      const d = JSON.parse(m.data);
      return Array.isArray(d) ? d : [];
    } catch {
      return [];
    }
  };

  const role = user?.role === "student" ? "student" : "teacher";

  return (
    <DashboardShell role={role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{a.myMaterials}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{a.myMaterialsSubtitle}</p>
      </div>

      {items === null ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 dark:text-slate-400">
          {a.noMaterials}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((m) => {
            const isQuiz = m.kind === "quiz";
            const slides = isQuiz ? [] : parseSlides(m);
            let count = 0;
            if (isQuiz) {
              try {
                count = JSON.parse(m.data).length;
              } catch {
                count = 0;
              }
            }
            return (
              <Card key={m.id}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isQuiz
                          ? "bg-secondary/10 text-secondary"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isQuiz ? <ListChecks className="h-5 w-5" /> : <Presentation className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{m.topic}</div>
                      <div className="text-xs text-slate-500">
                        {m.subject ?? "—"} · {new Date(m.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(m.id)}
                    aria-label={a.delete}
                    className="text-slate-400 transition-colors hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Badge className={isQuiz ? "border-secondary/20 bg-secondary/10 text-secondary" : ""}>
                  {isQuiz ? `${a.kindQuiz} · ${count}` : `${a.kindPresentation} · ${slides.length}`}
                </Badge>

                {!isQuiz && slides.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {slides.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{s.title}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {isQuiz && (
                  <Button size="sm" variant="outline" className="mt-4" onClick={() => openQuiz(m)}>
                    {a.open} →
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
