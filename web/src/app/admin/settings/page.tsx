"use client";

import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

const tabs = ["Store Info", "Notifications", "Localization", "Integrations"] as const;

const integrations = [
  { name: "Google Analytics", connected: true },
  { name: "Meta Pixel", connected: true },
  { name: "WhatsApp Business API", connected: false },
  { name: "Instagram Shop Sync", connected: false },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Store Info");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">Settings</h1>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
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

      <div className="neu-raised rounded-3xl p-6 max-w-2xl">
        {tab === "Store Info" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Store Name</label>
              <input defaultValue="Bakestudio" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">Support Phone</label>
                <input defaultValue="+1 555 010 2323" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">Support Email</label>
                <input defaultValue="hello@bakestudio.com" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Store Hours</label>
              <input defaultValue="8am – 9pm, daily" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
            </div>
          </div>
        )}

        {tab === "Notifications" && (
          <div className="flex flex-col gap-3">
            {["Order Confirmation", "Order Status Update", "Promotional Emails", "Abandoned Cart Reminder"].map(
              (n) => (
                <label key={n} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{n}</span>
                  <span className="w-10 h-5 rounded-full neu-inset relative">
                    <span className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-cocoa" />
                  </span>
                </label>
              )
            )}
          </div>
        )}

        {tab === "Localization" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Currency</label>
              <select defaultValue="USD" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none">
                <option>USD</option>
                <option>INR</option>
                <option>EUR</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Timezone</label>
              <select defaultValue="ET" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none">
                <option>ET (UTC-5)</option>
                <option>IST (UTC+5:30)</option>
              </select>
            </div>
          </div>
        )}

        {tab === "Integrations" && (
          <div className="flex flex-col gap-3">
            {integrations.map((i) => (
              <div key={i.name} className="neu-raised-sm rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{i.name}</span>
                <button
                  className={
                    i.connected
                      ? "neu-inset rounded-full px-3 py-1 text-xs font-semibold text-cocoa"
                      : "neu-raised-sm rounded-full px-3 py-1 text-xs font-semibold text-ink-soft"
                  }
                >
                  {i.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="self-start" size="sm">
        Save Changes
      </Button>
    </div>
  );
}
