"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { Search, Trash2, UserCog } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: string;
  createdAt: string;
  _count: { materials: number; ownedGroups: number; memberships: number; submissions: number };
};

const ROLES = ["all", "teacher", "student", "admin"] as const;
const roleColor: Record<string, string> = {
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  teacher: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "teacher" | "student" | "admin">("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("role", filter);
    if (search) params.set("search", search);
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((j) => setUsers(j.users ?? []))
      .finally(() => setLoading(false));
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const changeRole = async () => {
    if (!roleTarget || !newRole) return;
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: roleTarget.id, role: newRole }),
    });
    setSaving(false);
    if (res.ok) {
      toast({ type: "success", message: `${roleTarget.name} → ${newRole}` });
      setRoleTarget(null);
      load();
    } else {
      toast({ type: "error", message: "Xatolik yuz berdi" });
    }
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    setSaving(false);
    if (res.ok) {
      toast({ type: "success", message: `${deleteTarget.name} o'chirildi` });
      setDeleteTarget(null);
      load();
    } else {
      const j = await res.json();
      toast({ type: "error", message: j.error === "cannot_delete_self" ? "O'zingizni o'chirib bo'lmaydi" : "Xatolik" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism yoki email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="flex gap-1">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  filter === r ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {r === "all" ? "Barchasi" : r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Foydalanuvchi</TH>
              <TH>Rol</TH>
              <TH>Kirish usuli</TH>
              <TH>Materiallar</TH>
              <TH>Guruhlar</TH>
              <TH>Ro'yxatdan</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {users.map((u) => (
              <TR key={u.id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {u.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </TD>
                <TD>
                  <span className={`rounded-pill px-2 py-0.5 text-xs font-medium ${roleColor[u.role] ?? ""}`}>
                    {u.role}
                  </span>
                </TD>
                <TD className="text-xs text-slate-500">{u.provider}</TD>
                <TD className="text-center">{u._count.materials}</TD>
                <TD className="text-center">{u._count.ownedGroups || u._count.memberships}</TD>
                <TD className="text-xs text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString("uz")}
                </TD>
                <TD>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setRoleTarget(u); setNewRole(u.role); }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-violet-600 dark:hover:bg-slate-800 transition-colors"
                      title="Rol o'zgartirish"
                    >
                      <UserCog className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {/* Role change modal */}
      <Modal open={!!roleTarget} onClose={() => setRoleTarget(null)} title="Rol o'zgartirish">
        {roleTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>{roleTarget.name}</strong> uchun yangi rol tanlang:
            </p>
            <div className="flex gap-2">
              {["teacher", "student", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                    newRole === r ? "border-primary bg-primary/5 text-primary" : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setRoleTarget(null)}>Bekor</Button>
              <Button className="flex-1" onClick={changeRole} disabled={saving || newRole === roleTarget.role}>
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Foydalanuvchini o'chirish">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>{deleteTarget.name}</strong> ({deleteTarget.email}) ni o'chirishni tasdiqlaysizmi?
              Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Bekor</Button>
              <Button className="flex-1 bg-rose-500 hover:bg-rose-600" onClick={deleteUser} disabled={saving}>
                {saving ? "O'chirilmoqda..." : "O'chirish"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
