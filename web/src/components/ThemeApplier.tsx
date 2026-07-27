"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export function ThemeApplier() {
  const {
    colorBase,
    colorBaseLight,
    colorCocoa,
    colorCocoaDark,
    colorRose,
    colorRoseLight,
    colorInk,
    colorInkSoft,
    shadowDark,
    shadowLight,
    cardRadius,
    neumorphicDepth,
    textScale,
    fontHeading,
    fontBody,
  } = useThemeStore();

  const syncWithSupabase = useThemeStore((s) => s.syncWithSupabase);

  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply Dynamic Colors to CSS Custom Properties
    root.style.setProperty("--color-base", colorBase);
    root.style.setProperty("--color-base-light", colorBaseLight);
    root.style.setProperty("--color-cocoa", colorCocoa);
    root.style.setProperty("--color-cocoa-dark", colorCocoaDark);
    root.style.setProperty("--color-rose", colorRose);
    root.style.setProperty("--color-rose-light", colorRoseLight);
    root.style.setProperty("--color-ink", colorInk);
    root.style.setProperty("--color-ink-soft", colorInkSoft);
    root.style.setProperty("--shadow-dark", shadowDark);
    root.style.setProperty("--shadow-light", shadowLight);

    // Apply Card Corner Radius
    root.style.setProperty("--theme-card-radius", `${cardRadius}px`);

    // Apply Font Pairing
    if (fontHeading) {
      root.style.setProperty("--font-serif", `'${fontHeading}', Georgia, serif`);
    }
    if (fontBody) {
      root.style.setProperty("--font-sans", `'${fontBody}', system-ui, sans-serif`);
    }

    // Apply Text Scaling
    root.style.setProperty("--text-scale-factor", `${textScale}`);
  }, [
    colorBase,
    colorBaseLight,
    colorCocoa,
    colorCocoaDark,
    colorRose,
    colorRoseLight,
    colorInk,
    colorInkSoft,
    shadowDark,
    shadowLight,
    cardRadius,
    neumorphicDepth,
    textScale,
    fontHeading,
    fontBody,
  ]);

  return null;
}
