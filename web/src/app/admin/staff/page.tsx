"use client";

import { useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminUsers, auditLog } from "@/lib/admin-data";

const tabs = ["Admin Users", "Audit Log"] as const;

export default function AdminStaffPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Admin Users");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-3xl text-ink">Staff & Roles</h1>
        {tab === "Admin Users" && (
          <Button size="sm">
            <Plus size={14} /> Invite Staff
          </Button>
        )}
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-semibold",
              tab === t ? "neu-raised-sm text-cocoa" : "text-ink-soft"
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
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((u) => (
                <tr key={u.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold text-ink">{u.name}</td>
                  <td className="p-4 text-ink-soft">{u.email}</td>
                  <td className="p-4">
                    <span className="neu-inset rounded-full px-3 py-1 text-xs font-semibold text-cocoa">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-ink-soft">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="neu-raised rounded-3xl p-6">
          <div className="flex flex-col gap-3">
            {auditLog.map((a, i) => (
              <div key={i} className="flex gap-4 text-sm border-b border-ink/5 pb-3 last:border-0">
                <span className="text-ink-soft w-36 shrink-0">{a.at}</span>
                <span className="font-semibold text-ink w-32 shrink-0">{a.user}</span>
                <span className="text-ink-soft">{a.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
