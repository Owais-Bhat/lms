"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Database, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useThemeStore } from "@/store/theme-store";

const tabs = ["Store Info", "Notifications", "Integrations", "Supabase DB Config"] as const;

const integrations = [
  { name: "Google Analytics 4", connected: true },
  { name: "Meta Pixel", connected: true },
  { name: "WhatsApp Business API", connected: true },
  { name: "Instagram Shop Sync", connected: false },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Store Info");
  const { siteTagline, contactEmail, contactPhone, updateHeaderFooter } = useThemeStore();

  const [storeName, setStoreName] = useState("Bakestudio");
  const [phone, setPhone] = useState(contactPhone || "+91 98765 43210");
  const [email, setEmail] = useState(contactEmail || "hello@bakestudio.com");
  const [tagline, setTagline] = useState(siteTagline || "Treat yourself to something special");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateHeaderFooter({
      siteTagline: tagline,
      contactEmail: email,
      contactPhone: phone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">General Store Settings</h1>
          <p className="text-sm text-ink-soft">Configure store contact details, notifications & Supabase connection.</p>
        </div>
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
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

      <div className="neu-raised rounded-3xl p-6 md:p-8">
        {saved && (
          <div className="neu-inset rounded-2xl p-4 mb-6 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check size={16} /> Store settings saved and synced with Supabase database!
          </div>
        )}

        {tab === "Store Info" && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-cocoa uppercase block mb-1.5">Store Brand Name</label>
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="neu-inset rounded-2xl px-4 py-3 text-sm text-ink w-full outline-none font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-cocoa uppercase block mb-1.5">Website Tagline</label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="neu-inset rounded-2xl px-4 py-3 text-sm text-ink w-full outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-cocoa uppercase block mb-1.5">Support Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="neu-inset rounded-2xl px-4 py-3 text-sm text-ink w-full outline-none font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cocoa uppercase block mb-1.5">Support Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neu-inset rounded-2xl px-4 py-3 text-sm text-ink w-full outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-cocoa uppercase block mb-1.5">Store Hours</label>
              <input
                defaultValue="8am – 9pm, Daily"
                className="neu-inset rounded-2xl px-4 py-3 text-sm text-ink w-full outline-none font-semibold"
              />
            </div>

            <Button type="submit" size="md" className="w-fit gap-2 mt-2">
              <Save size={16} /> Save Changes
            </Button>
          </form>
        )}

        {tab === "Notifications" && (
          <div className="space-y-4">
            {[
              { label: "New Order Email Alert", desc: "Receive email when a customer places a new order" },
              { label: "Kitchen KDS Sound Alert", desc: "Play chime when order reaches kitchen queue" },
              { label: "Low Inventory Alert", desc: "Notify when ingredient stock drops below threshold" },
              { label: "SMS Dispatch Tracking", desc: "Send SMS updates to customers on delivery" },
            ].map((n, i) => (
              <div key={i} className="neu-raised-sm rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-ink">{n.label}</div>
                  <div className="text-xs text-ink-soft">{n.desc}</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-cocoa rounded cursor-pointer" />
              </div>
            ))}
          </div>
        )}

        {tab === "Integrations" && (
          <div className="space-y-3">
            {integrations.map((item) => (
              <div key={item.name} className="neu-raised-sm rounded-2xl p-4 flex items-center justify-between">
                <span className="font-bold text-sm text-ink">{item.name}</span>
                <span
                  className={clsx(
                    "text-xs font-bold px-3 py-1 rounded-full",
                    item.connected ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                  )}
                >
                  {item.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "Supabase DB Config" && (
          <div className="space-y-4">
            <div className="neu-inset rounded-2xl p-4 bg-cocoa/5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cocoa text-sm">
                <Database size={16} /> Active Supabase Credentials
              </div>
              <div className="text-xs text-ink-soft font-mono">URL: https://aecllrspvhgmkpfdwrpf.supabase.co</div>
              <div className="text-xs text-ink-soft font-mono">Publishable Key: sb_publishable_BUh1el6...</div>
            </div>
            <div className="text-xs text-ink-soft">
              All storefront customer checkouts, theme configurations, products catalog, and orders sync live with this Supabase database project.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
