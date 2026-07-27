"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseDb } from "@/lib/supabase";

export type ThemePresetKey = "classic" | "dark-cocoa" | "rose-gold" | "warm-caramel" | "midnight";

export type Background3DStyle = "sparkles" | "flour-dust" | "pastries" | "stars";

export type ThemeState = {
  // Color Palette
  preset: ThemePresetKey;
  colorBase: string;
  colorBaseLight: string;
  colorCocoa: string;
  colorCocoaDark: string;
  colorRose: string;
  colorRoseLight: string;
  colorInk: string;
  colorInkSoft: string;
  shadowDark: string;
  shadowLight: string;

  // Typography
  fontHeading: string;
  fontBody: string;
  textScale: number;

  // Card & Container Aesthetics
  cardRadius: number;
  neumorphicDepth: "subtle" | "classic" | "deep";
  cardShadowIntensity: number;

  // Header & Footer Copy
  announcementText: string;
  announcementEnabled: boolean;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  facebookUrl: string;

  // 3D Background Settings
  bg3dEnabled: boolean;
  bg3dStyle: Background3DStyle;
  bg3dSpeed: number;
  bg3dDensity: number;
  bg3dMouseParallax: boolean;
  bg3dOpacity: number;

  // Actions
  syncWithSupabase: () => Promise<void>;
  setPreset: (preset: ThemePresetKey) => void;
  updateColors: (colors: Partial<Pick<ThemeState, "colorBase" | "colorBaseLight" | "colorCocoa" | "colorCocoaDark" | "colorRose" | "colorRoseLight" | "colorInk" | "colorInkSoft" | "shadowDark" | "shadowLight">>) => void;
  updateTypography: (typo: Partial<Pick<ThemeState, "fontHeading" | "fontBody" | "textScale">>) => void;
  updateCardStyle: (style: Partial<Pick<ThemeState, "cardRadius" | "neumorphicDepth" | "cardShadowIntensity">>) => void;
  updateHeaderFooter: (content: Partial<Pick<ThemeState, "announcementText" | "announcementEnabled" | "siteTagline" | "contactEmail" | "contactPhone" | "instagramUrl" | "facebookUrl">>) => void;
  update3DBackground: (bg: Partial<Pick<ThemeState, "bg3dEnabled" | "bg3dStyle" | "bg3dSpeed" | "bg3dDensity" | "bg3dMouseParallax" | "bg3dOpacity">>) => void;
  resetToDefaults: () => void;
};

const defaultState = {
  preset: "classic" as ThemePresetKey,
  colorBase: "#efe6dd",
  colorBaseLight: "#f7f1ea",
  colorCocoa: "#6b3a2f",
  colorCocoaDark: "#4e2a21",
  colorRose: "#e7b6a4",
  colorRoseLight: "#f3d9cd",
  colorInk: "#3c2a22",
  colorInkSoft: "#7a6459",
  shadowDark: "#d8c9ba",
  shadowLight: "#fffbf6",

  fontHeading: "Fraunces",
  fontBody: "Manrope",
  textScale: 1,

  cardRadius: 24,
  neumorphicDepth: "classic" as const,
  cardShadowIntensity: 1,

  announcementText: "Free delivery on orders above ₹999 • Order 1 day ahead for custom designs",
  announcementEnabled: true,
  siteTagline: "Treat yourself to something special",
  contactEmail: "hello@bakestudio.com",
  contactPhone: "+91 98765 43210",
  instagramUrl: "https://instagram.com/bakestudio",
  facebookUrl: "https://facebook.com/bakestudio",

  bg3dEnabled: true,
  bg3dStyle: "sparkles" as Background3DStyle,
  bg3dSpeed: 1,
  bg3dDensity: 50,
  bg3dMouseParallax: true,
  bg3dOpacity: 0.65,
};

export const themePresets: Record<ThemePresetKey, { name: string; colors: Partial<ThemeState> }> = {
  classic: {
    name: "Classic Cream (Default)",
    colors: {
      colorBase: "#efe6dd",
      colorBaseLight: "#f7f1ea",
      colorCocoa: "#6b3a2f",
      colorCocoaDark: "#4e2a21",
      colorRose: "#e7b6a4",
      colorRoseLight: "#f3d9cd",
      colorInk: "#3c2a22",
      colorInkSoft: "#7a6459",
      shadowDark: "#d8c9ba",
      shadowLight: "#fffbf6",
    },
  },
  "dark-cocoa": {
    name: "Dark Cocoa Velvet",
    colors: {
      colorBase: "#2b1c17",
      colorBaseLight: "#382721",
      colorCocoa: "#e2a991",
      colorCocoaDark: "#f5c4b1",
      colorRose: "#c4785a",
      colorRoseLight: "#543328",
      colorInk: "#f5ece6",
      colorInkSoft: "#c2aba0",
      shadowDark: "#1c110e",
      shadowLight: "#3c2922",
    },
  },
  "rose-gold": {
    name: "Rose Gold Pastels",
    colors: {
      colorBase: "#f7ece9",
      colorBaseLight: "#fcf5f3",
      colorCocoa: "#944e40",
      colorCocoaDark: "#6e3328",
      colorRose: "#e5a498",
      colorRoseLight: "#f6ded9",
      colorInk: "#422824",
      colorInkSoft: "#876661",
      shadowDark: "#e2d2ce",
      shadowLight: "#ffffff",
    },
  },
  "warm-caramel": {
    name: "Warm Caramel",
    colors: {
      colorBase: "#f2e7d8",
      colorBaseLight: "#fbf3e8",
      colorCocoa: "#824c1e",
      colorCocoaDark: "#5c3310",
      colorRose: "#d99f6c",
      colorRoseLight: "#f3ddc5",
      colorInk: "#3b2615",
      colorInkSoft: "#7c624c",
      shadowDark: "#dbcebc",
      shadowLight: "#ffffff",
    },
  },
  midnight: {
    name: "Midnight Luxury",
    colors: {
      colorBase: "#1a1b24",
      colorBaseLight: "#242733",
      colorCocoa: "#d4a373",
      colorCocoaDark: "#faedcd",
      colorRose: "#bc6c25",
      colorRoseLight: "#3a2d27",
      colorInk: "#fefae0",
      colorInkSoft: "#a3a8be",
      shadowDark: "#111218",
      shadowLight: "#252734",
    },
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      syncWithSupabase: async () => {
        const fetched = await supabaseDb.select<any>("theme_config", "*");
        if (fetched && fetched.length > 0) {
          const row = fetched[0];
          const config = typeof row.config === "string" ? JSON.parse(row.config) : row.config;
          set((state) => ({ ...state, ...config }));
        }
      },

      setPreset: (presetKey) => {
        const presetData = themePresets[presetKey];
        if (presetData) {
          const updated = {
            preset: presetKey,
            ...presetData.colors,
          };
          set(updated);
          supabaseDb.insert("theme_config", { id: "current_theme", config: get() });
        }
      },

      updateColors: (colors) => {
        set((state) => ({ ...state, ...colors }));
        supabaseDb.insert("theme_config", { id: "current_theme", config: get() });
      },
      updateTypography: (typo) => {
        set((state) => ({ ...state, ...typo }));
        supabaseDb.insert("theme_config", { id: "current_theme", config: get() });
      },
      updateCardStyle: (style) => {
        set((state) => ({ ...state, ...style }));
        supabaseDb.insert("theme_config", { id: "current_theme", config: get() });
      },
      updateHeaderFooter: (content) => {
        set((state) => ({ ...state, ...content }));
        supabaseDb.insert("theme_config", { id: "current_theme", config: get() });
      },
      update3DBackground: (bg) => {
        set((state) => ({ ...state, ...bg }));
        supabaseDb.insert("theme_config", { id: "current_theme", config: get() });
      },
      resetToDefaults: () => {
        set(defaultState);
        supabaseDb.insert("theme_config", { id: "current_theme", config: defaultState });
      },
    }),
    { name: "bakestudio-theme-config" }
  )
);
