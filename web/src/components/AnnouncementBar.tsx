"use client";

import { useThemeStore } from "@/store/theme-store";

export function AnnouncementBar() {
  const { announcementEnabled, announcementText } = useThemeStore();

  if (!announcementEnabled) return null;

  return (
    <div className="neu-inset text-center py-2 px-4 text-[13px] font-semibold tracking-wide text-cocoa transition-all">
      {announcementText || "Free delivery on orders above ₹999 • Order 1 day ahead for custom designs"}
    </div>
  );
}
