"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { Trash2, Users, ClipboardList } from "lucide-react";

type Group = {
  id: string;
  name: string;
  subject: string | null;
  code: string;
  createdAt: string;
  teacher: { name: string; email: string };
  _count: { members: number; assignments: number };
};

export default function AdminGroups() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/groups")
      .then((r) => r.json())
      .then((j) => setGroups(j.groups ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteGroup = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch("/api/admin/groups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    setDeleting(false);
    if (res.ok) {
      toast({ type: "success", message: `"${deleteTarget.name}" guruh o'chirildi` });
      setDeleteTarget(null);
      load();
    } else {
      toast({ type: "error", message: "Xatolik yuz berdi" });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Jami: <strong className="text-slate-800 dark:text-slate-100">{groups.length}</strong> ta guruh</span>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Guruh nomi</TH>
              <TH>Kod</TH>
              <TH>O'qituvchi</TH>
              <TH>A'zolar</TH>
              <TH>Topshiriqlar</TH>
              <TH>Yaratilgan</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {groups.map((g) => (
              <TR key={g.id}>
                <TD>
                  <div className="font-medium">{g.name}</div>
                  {g.subject && <div className="text-xs text-slate-500">{g.subject}</div>}
                </TD>
                <TD>
                  <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono dark:bg-slate-800">
                    {g.code}
                  </code>
                </TD>
                <TD>
                  <div className="text-sm">{g.teacher.name}</div>
                  <div className="text-xs text-slate-500">{g.teacher.email}</div>
                </TD>
                <TD>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3.5 w-3.5 text-slate-400" /> {g._count.members}
                  </div>
                </TD>
                <TD>
                  <div className="flex items-center gap-1 text-sm">
                    <ClipboardList className="h-3.5 w-3.5 text-slate-400" /> {g._count.assignments}
                  </div>
                </TD>
                <TD className="text-xs text-slate-500">
                  {new Date(g.createdAt).toLocaleDateString("uz")}
                </TD>
                <TD>
                  <button
                    onClick={() => setDeleteTarget(g)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Guruhni o'chirish">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>"{deleteTarget.name}"</strong> guruhini o'chirishni tasdiqlaysizmi?
              Barcha a'zolar va topshiriqlar ham o'chiriladi.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Bekor</Button>
              <Button className="flex-1 bg-rose-500 hover:bg-rose-600" onClick={deleteGroup} disabled={deleting}>
                {deleting ? "O'chirilmoqda..." : "O'chirish"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
