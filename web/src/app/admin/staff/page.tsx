"use client";

import { useState } from "react";
import clsx from "clsx";
import { Plus, UserPlus, X, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminUsers as initialUsers, auditLog } from "@/lib/admin-data";
import { supabaseDb } from "@/lib/supabase";

const tabs = ["Admin Users", "Audit Log"] as const;

export default function AdminStaffPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Admin Users");
  const [users, setUsers] = useState(initialUsers);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Store Manager");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      lastActive: "Just now",
    };

    // Save staff member to Supabase admin_users table
    await supabaseDb.insert("admin_users", {
      id: newUser.id,
      username: email.split("@")[0],
      password: "Awais111@9149@",
      role: newUser.role,
    });

    setUsers([newUser, ...users]);
    setShowModal(false);
    setName("");
    setEmail("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold tracking-widest text-cocoa uppercase mb-1 flex items-center gap-1.5">
            <ShieldCheck size={14} /> User Permissions & Team
          </div>
          <h1 className="font-serif text-3xl text-ink">Staff & Roles</h1>
        </div>
        {tab === "Admin Users" && (
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5">
            <Plus size={16} /> Invite Staff Member
          </Button>
        )}
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-5 py-2.5 rounded-full text-xs font-bold transition-all",
              tab === t ? "neu-raised-sm text-cocoa font-extrabold" : "text-ink-soft hover:text-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Admin Users" ? (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email Address</th>
                <th className="p-4 font-bold">Assigned Role</th>
                <th className="p-4 font-bold">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink/5 last:border-0 hover:bg-cocoa/5">
                  <td className="p-4 font-bold text-ink">{u.name}</td>
                  <td className="p-4 text-ink-soft">{u.email}</td>
                  <td className="p-4">
                    <span className="neu-inset rounded-full px-3 py-1 text-xs font-bold text-cocoa">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-ink-soft font-semibold">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="neu-raised rounded-3xl p-6 space-y-3">
          <div className="text-sm font-bold text-ink mb-2">System Audit Log</div>
          {auditLog.map((log, i) => (
            <div key={i} className="neu-raised-sm rounded-2xl p-4 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-ink">{log.user}</span>{" "}
                <span className="text-ink-soft">{log.action}</span>
              </div>
              <span className="text-[11px] font-mono text-cocoa font-bold">{log.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md neu-raised rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-cocoa/10">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleInvite} className="space-y-4">
              <h2 className="font-serif text-2xl text-ink">Invite Staff Member</h2>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@bakestudio.com"
                  className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Role & Access Level</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold bg-transparent"
                >
                  <option value="Store Manager">Store Manager</option>
                  <option value="Head Baker">Head Baker (KDS Access)</option>
                  <option value="Logistics Coordinator">Logistics & Rider Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <Button type="submit" size="md" className="w-full justify-center gap-2">
                <Check size={16} /> Send Admin Invitation
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
