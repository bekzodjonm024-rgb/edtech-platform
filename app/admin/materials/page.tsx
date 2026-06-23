"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { Trash2 } from "lucide-react";

type Material = {
  id: string;
  kind: string;
  topic: string;
  subject: string | null;
  createdAt: string;
  user: { name: string; email: string };
  _count: { assignments: number };
};

const kindLabel: Record<string, string> = {
  quiz: "Test",
  essay: "Uy vazifasi",
  presentation: "Taqdimot",
};
const kindColor: Record<string, string> = {
  quiz: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  essay: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  presentation: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
};

export default function AdminMaterials() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [kindFilter, setKindFilter] = useState("all");

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/materials")
      .then((r) => r.json())
      .then((j) => setMaterials(j.materials ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteMaterial = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch("/api/admin/materials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    setDeleting(false);
    if (res.ok) {
      toast({ type: "success", message: `"${deleteTarget.topic}" o'chirildi` });
      setDeleteTarget(null);
      load();
    } else {
      toast({ type: "error", message: "Xatolik yuz berdi" });
    }
  };

  const filtered = kindFilter === "all" ? materials : materials.filter((m) => m.kind === kindFilter);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500">Jami: <strong className="text-slate-800 dark:text-slate-100">{filtered.length}</strong></span>
          <div className="flex gap-1 ml-auto">
            {["all", "quiz", "essay", "presentation"].map((k) => (
              <button
                key={k}
                onClick={() => setKindFilter(k)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  kindFilter === k ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {k === "all" ? "Barchasi" : kindLabel[k]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Mavzu</TH>
              <TH>Tur</TH>
              <TH>Yaratuvchi</TH>
              <TH>Topshiriqlar</TH>
              <TH>Yaratilgan</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {filtered.map((m) => (
              <TR key={m.id}>
                <TD>
                  <div className="font-medium">{m.topic}</div>
                  {m.subject && <div className="text-xs text-slate-500">{m.subject}</div>}
                </TD>
                <TD>
                  <span className={`rounded-pill px-2 py-0.5 text-xs font-medium ${kindColor[m.kind] ?? ""}`}>
                    {kindLabel[m.kind] ?? m.kind}
                  </span>
                </TD>
                <TD>
                  <div className="text-sm">{m.user.name}</div>
                  <div className="text-xs text-slate-500">{m.user.email}</div>
                </TD>
                <TD className="text-center text-sm">{m._count.assignments}</TD>
                <TD className="text-xs text-slate-500">
                  {new Date(m.createdAt).toLocaleDateString("uz")}
                </TD>
                <TD>
                  <button
                    onClick={() => setDeleteTarget(m)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Materialni o'chirish">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>&quot;{deleteTarget.topic}&quot;</strong> materialini o&apos;chirishni tasdiqlaysizmi?
              Unga bog&apos;liq barcha topshiriqlar ham o&apos;chiriladi.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Bekor</Button>
              <Button className="flex-1 bg-rose-500 hover:bg-rose-600" onClick={deleteMaterial} disabled={deleting}>
                {deleting ? "O'chirilmoqda..." : "O'chirish"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
