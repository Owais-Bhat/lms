"use client";

import { useState } from "react";
import {
  Check,
  Eye,
  Layers,
  Layout,
  Moon,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Type,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  themePresets,
  useThemeStore,
  type Background3DStyle,
  type ThemePresetKey,
} from "@/store/theme-store";

export default function AdminThemePage() {
  const theme = useThemeStore();
  const [activeTab, setActiveTab] = useState<"presets" | "colors" | "typography" | "cards" | "header" | "bg3d">("presets");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 neu-raised rounded-3xl p-6">
        <div>
          <div className="text-xs font-bold tracking-widest text-cocoa uppercase mb-1 flex items-center gap-1.5">
            <Palette size={14} /> Admin Visual Customizer
          </div>
          <h1 className="font-serif text-3xl text-ink">Theme, Styling & 3D Controls</h1>
          <p className="text-sm text-ink-soft mt-1">
            Customize website colors, typography, neumorphic depth, cards, header copy, and 3D background settings live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => theme.resetToDefaults()} className="gap-2">
            <RotateCcw size={14} /> Reset Defaults
          </Button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="neu-raised-sm rounded-2xl px-5 py-2.5 text-xs font-bold text-cocoa hover:bg-rose-light/50 flex items-center gap-2 transition-all"
          >
            <Eye size={14} /> View Live Website ↗
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-ink/10">
        {[
          { key: "presets", label: "Theme Presets", icon: Wand2 },
          { key: "colors", label: "Color Palette", icon: Palette },
          { key: "typography", label: "Fonts & Text", icon: Type },
          { key: "cards", label: "Cards & Shapes", icon: Layers },
          { key: "header", label: "Header & Footer", icon: Layout },
          { key: "bg3d", label: "3D Background", icon: Sparkles },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === t.key
                ? "neu-inset text-cocoa font-extrabold"
                : "neu-raised-sm text-ink-soft hover:text-ink"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls Section (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Presets Tab */}
          {activeTab === "presets" && (
            <div className="neu-raised rounded-3xl p-6 space-y-6">
              <h2 className="font-serif text-xl text-ink">Choose a Theme Preset</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(themePresets) as ThemePresetKey[]).map((key) => {
                  const p = themePresets[key];
                  const isSelected = theme.preset === key;
                  return (
                    <div
                      key={key}
                      onClick={() => theme.setPreset(key)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                        isSelected
                          ? "border-cocoa neu-inset bg-cocoa/5 shadow-md"
                          : "border-transparent neu-raised hover:scale-[1.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm text-ink">{p.name}</span>
                        {isSelected && (
                          <span className="neu-raised-sm rounded-full w-6 h-6 flex items-center justify-center text-cocoa">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ background: p.colors.colorBase }} title="Base Background" />
                        <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ background: p.colors.colorCocoa }} title="Cocoa Accent" />
                        <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ background: p.colors.colorRose }} title="Rose Accent" />
                        <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ background: p.colors.colorInk }} title="Ink Text" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Palette Tab */}
          {activeTab === "colors" && (
            <div className="neu-raised rounded-3xl p-6 space-y-6">
              <h2 className="font-serif text-xl text-ink">Custom Color Palette</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "Base Background Color", key: "colorBase" },
                  { label: "Light Card Surface Color", key: "colorBaseLight" },
                  { label: "Primary Cocoa Accent", key: "colorCocoa" },
                  { label: "Dark Cocoa Accent", key: "colorCocoaDark" },
                  { label: "Rose Highlight Color", key: "colorRose" },
                  { label: "Rose Light Accent", key: "colorRoseLight" },
                  { label: "Heading & Main Ink Text", key: "colorInk" },
                  { label: "Soft Body Text Color", key: "colorInkSoft" },
                  { label: "Neumorphic Dark Shadow", key: "shadowDark" },
                  { label: "Neumorphic Light Shadow", key: "shadowLight" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between neu-raised-sm rounded-2xl p-4">
                    <span className="text-xs font-bold text-ink">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(theme as any)[item.key]}
                        onChange={(e) => theme.updateColors({ [item.key]: e.target.value })}
                        className="w-9 h-9 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <input
                        type="text"
                        value={(theme as any)[item.key]}
                        onChange={(e) => theme.updateColors({ [item.key]: e.target.value })}
                        className="w-24 text-xs font-mono font-semibold neu-inset rounded-xl px-2 py-1.5 text-center text-ink outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === "typography" && (
            <div className="neu-raised rounded-3xl p-6 space-y-6">
              <h2 className="font-serif text-xl text-ink">Typography & Fonts</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-2">Heading Font (Serif)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Fraunces", "Playfair Display", "Cinzel", "Georgia"].map((font) => (
                      <button
                        key={font}
                        onClick={() => theme.updateTypography({ fontHeading: font })}
                        className={`p-3 rounded-2xl text-sm font-semibold transition-all ${
                          theme.fontHeading === font ? "neu-inset text-cocoa font-bold" : "neu-raised-sm text-ink-soft"
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-2">Body Font (Sans)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Manrope", "Inter", "Outfit", "system-ui"].map((font) => (
                      <button
                        key={font}
                        onClick={() => theme.updateTypography({ fontBody: font })}
                        className={`p-3 rounded-2xl text-sm font-semibold transition-all ${
                          theme.fontBody === font ? "neu-inset text-cocoa font-bold" : "neu-raised-sm text-ink-soft"
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-cocoa uppercase">Overall Text Scale Factor</label>
                    <span className="text-xs font-mono font-bold text-ink">{theme.textScale}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.2"
                    step="0.05"
                    value={theme.textScale}
                    onChange={(e) => theme.updateTypography({ textScale: parseFloat(e.target.value) })}
                    className="w-full accent-cocoa"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cards & Shapes Tab */}
          {activeTab === "cards" && (
            <div className="neu-raised rounded-3xl p-6 space-y-6">
              <h2 className="font-serif text-xl text-ink">Cards & Container Styling</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-cocoa uppercase">Container Corner Roundness (Radius)</label>
                    <span className="text-xs font-mono font-bold text-ink">{theme.cardRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="40"
                    step="4"
                    value={theme.cardRadius}
                    onChange={(e) => theme.updateCardStyle({ cardRadius: parseInt(e.target.value) })}
                    className="w-full accent-cocoa"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-2">Neumorphic Depth & Elevation</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "subtle", label: "Subtle Depth" },
                      { key: "classic", label: "Classic 3D" },
                      { key: "deep", label: "Deep Elevation" },
                    ].map((d) => (
                      <button
                        key={d.key}
                        onClick={() => theme.updateCardStyle({ neumorphicDepth: d.key as any })}
                        className={`p-3 rounded-2xl text-xs font-bold transition-all ${
                          theme.neumorphicDepth === d.key ? "neu-inset text-cocoa font-extrabold" : "neu-raised-sm text-ink-soft"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header & Footer Copy Tab */}
          {activeTab === "header" && (
            <div className="neu-raised rounded-3xl p-6 space-y-6">
              <h2 className="font-serif text-xl text-ink">Header & Footer Content</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between neu-raised-sm rounded-2xl p-4">
                  <span className="text-xs font-bold text-ink">Enable Top Announcement Bar</span>
                  <input
                    type="checkbox"
                    checked={theme.announcementEnabled}
                    onChange={(e) => theme.updateHeaderFooter({ announcementEnabled: e.target.checked })}
                    className="w-5 h-5 accent-cocoa rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-2">Announcement Bar Text</label>
                  <input
                    type="text"
                    value={theme.announcementText}
                    onChange={(e) => theme.updateHeaderFooter({ announcementText: e.target.value })}
                    className="w-full text-xs font-semibold neu-inset rounded-2xl p-3.5 text-ink outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-2">Website Tagline</label>
                  <input
                    type="text"
                    value={theme.siteTagline}
                    onChange={(e) => theme.updateHeaderFooter({ siteTagline: e.target.value })}
                    className="w-full text-xs font-semibold neu-inset rounded-2xl p-3.5 text-ink outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cocoa uppercase mb-2">Contact Phone</label>
                    <input
                      type="text"
                      value={theme.contactPhone}
                      onChange={(e) => theme.updateHeaderFooter({ contactPhone: e.target.value })}
                      className="w-full text-xs font-semibold neu-inset rounded-2xl p-3.5 text-ink outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cocoa uppercase mb-2">Contact Email</label>
                    <input
                      type="text"
                      value={theme.contactEmail}
                      onChange={(e) => theme.updateHeaderFooter({ contactEmail: e.target.value })}
                      className="w-full text-xs font-semibold neu-inset rounded-2xl p-3.5 text-ink outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D Background Tab */}
          {activeTab === "bg3d" && (
            <div className="neu-raised rounded-3xl p-6 space-y-6">
              <h2 className="font-serif text-xl text-ink flex items-center gap-2">
                <Sparkles className="text-cocoa" /> 3D Animated Background Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between neu-raised-sm rounded-2xl p-4">
                  <div>
                    <div className="text-xs font-bold text-ink">Enable 3D Interactive Background</div>
                    <div className="text-[11px] text-ink-soft">Floating particles, sparkles & flour dust canvas</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={theme.bg3dEnabled}
                    onChange={(e) => theme.update3DBackground({ bg3dEnabled: e.target.checked })}
                    className="w-5 h-5 accent-cocoa rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-2">3D Particle Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: "sparkles", label: "Golden Sparkles", emoji: "✨", desc: "Warm glowing light flares" },
                      { key: "flour-dust", label: "Bakery Flour Dust", emoji: "🌫️", desc: "Soft pale drifting powder" },
                      { key: "pastries", label: "Floating Pastries", emoji: "🧁", desc: "Tiny spinning cupcakes & cookies" },
                      { key: "stars", label: "4-Point Magic Stars", emoji: "⭐", desc: "Twinkling sparkle stars" },
                    ].map((st) => (
                      <button
                        key={st.key}
                        onClick={() => theme.update3DBackground({ bg3dStyle: st.key as Background3DStyle })}
                        className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 text-center ${
                          theme.bg3dStyle === st.key ? "neu-inset text-cocoa font-extrabold" : "neu-raised-sm text-ink-soft"
                        }`}
                      >
                        <span className="text-2xl leading-none">{st.emoji}</span>
                        <span>{st.label}</span>
                        <span className="text-[10px] font-normal text-ink-soft/80 leading-tight">{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-cocoa uppercase">Particle Density (Count)</label>
                    <span className="text-xs font-mono font-bold text-ink">{theme.bg3dDensity} particles</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="10"
                    value={theme.bg3dDensity}
                    onChange={(e) => theme.update3DBackground({ bg3dDensity: parseInt(e.target.value) })}
                    className="w-full accent-cocoa"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-cocoa uppercase">Animation Speed</label>
                    <span className="text-xs font-mono font-bold text-ink">{theme.bg3dSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.1"
                    value={theme.bg3dSpeed}
                    onChange={(e) => theme.update3DBackground({ bg3dSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-cocoa"
                  />
                </div>

                <div className="flex items-center justify-between neu-raised-sm rounded-2xl p-4">
                  <span className="text-xs font-bold text-ink">Enable Mouse Parallax Interaction</span>
                  <input
                    type="checkbox"
                    checked={theme.bg3dMouseParallax}
                    onChange={(e) => theme.update3DBackground({ bg3dMouseParallax: e.target.checked })}
                    className="w-5 h-5 accent-cocoa rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Column (Right 1 col) */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <div className="neu-raised rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cocoa flex items-center gap-1.5">
                <Eye size={14} /> Real-Time Live Preview
              </span>
              <span className="text-[10px] font-mono neu-inset px-2.5 py-1 rounded-full text-ink-soft">
                {theme.preset}
              </span>
            </div>

            {/* Preview Card Box */}
            <div
              className="rounded-3xl p-6 transition-all space-y-4 border border-black/5"
              style={{
                background: theme.colorBase,
                borderRadius: `${theme.cardRadius}px`,
                boxShadow: `8px 8px 20px ${theme.shadowDark}, -8px -8px 20px ${theme.shadowLight}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ background: theme.colorRose, color: theme.colorInk }}
                >
                  B
                </div>
                <div>
                  <div className="font-serif text-lg font-bold" style={{ color: theme.colorInk, fontFamily: theme.fontHeading }}>
                    Bakestudio Preview
                  </div>
                  <div className="text-[11px]" style={{ color: theme.colorInkSoft, fontFamily: theme.fontBody }}>
                    {theme.siteTagline}
                  </div>
                </div>
              </div>

              <div className="neu-inset p-4 rounded-2xl text-xs leading-relaxed" style={{ color: theme.colorInkSoft }}>
                This card updates live as you adjust colors, corner roundness, fonts, and 3D background settings in the admin panel!
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-xs font-bold rounded-full transition-all"
                  style={{ background: theme.colorCocoa, color: "#fff" }}
                >
                  Action Button
                </button>
                <button
                  className="px-4 py-2 text-xs font-bold rounded-full transition-all"
                  style={{ background: theme.colorRoseLight, color: theme.colorCocoa }}
                >
                  Secondary
                </button>
              </div>
            </div>

            <div className="neu-flat rounded-2xl p-4 text-xs text-ink-soft space-y-1 bg-cocoa/5">
              <div className="font-bold text-cocoa">💡 Live Changes Active</div>
              <div>All updates saved automatically and live instantly across all pages of your storefront.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
