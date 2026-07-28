"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/theme-store";

type Particle = {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
  pulseSpeed: number;
  rotation: number;
  vrot: number;
  glyph: string;
};

const PASTRY_GLYPHS = ["🧁", "🍰", "🍪", "🎂"];

export function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const {
    bg3dEnabled,
    bg3dStyle,
    bg3dSpeed,
    bg3dDensity,
    bg3dMouseParallax,
    bg3dOpacity,
    colorCocoa,
    colorRose,
    colorInkSoft,
  } = useThemeStore();

  useEffect(() => {
    if (!bg3dEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!bg3dMouseParallax) return;
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 40;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 40;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Palette per style so each of the 4 presets feels visually distinct.
    const palettes: Record<string, string[]> = {
      sparkles: [colorCocoa, "#f5c56b", "#f0a94e", "#fff3d6"],
      "flour-dust": ["#ffffff", "#fdf6ec", colorInkSoft, "#f3e8d8"],
      pastries: [colorCocoa, colorRose],
      stars: [colorRose, "#fff3d6", colorCocoa, "#ffffff"],
    };
    const colors = palettes[bg3dStyle] ?? palettes.sparkles;

    // Initialize 3D Particles
    const particles: Particle[] = [];
    for (let i = 0; i < bg3dDensity; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 500 + 100, // 3D depth
        radius: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4 * bg3dSpeed,
        vy: (-Math.random() * 0.6 - 0.2) * bg3dSpeed, // Slowly floating up
        vz: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.02,
        glyph: PASTRY_GLYPHS[Math.floor(Math.random() * PASTRY_GLYPHS.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.rotation += p.vrot;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

        // Wrap around boundaries
        if (p.y < -30) p.y = canvas.height + 30;
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;

        // Perspective 3D calculation
        const perspective = 400 / (400 + p.z);
        const drawX = (p.x - canvas.width / 2 + mouseX * perspective) * perspective + canvas.width / 2;
        const drawY = (p.y - canvas.height / 2 + mouseY * perspective) * perspective + canvas.height / 2;
        const drawRadius = Math.max(0.5, p.radius * perspective);

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha)) * bg3dOpacity;

        if (bg3dStyle === "sparkles") {
          // Warm golden glow flares — bright bokeh light bursts.
          const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawRadius * 4.5);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(0.4, p.color);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(drawX, drawY, drawRadius * 4.5, 0, Math.PI * 2);
          ctx.fill();
          // tiny bright core for a "glint" look
          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha)) * bg3dOpacity;
          ctx.fillStyle = "#fffdf5";
          ctx.beginPath();
          ctx.arc(drawX, drawY, drawRadius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (bg3dStyle === "flour-dust") {
          // Soft, fine, densely-drifting powder — small pale blurred motes.
          const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawRadius * 1.8);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(drawX, drawY, drawRadius * 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (bg3dStyle === "pastries") {
          // Tiny floating pastry glyphs that gently spin and bob.
          ctx.translate(drawX, drawY);
          ctx.rotate(p.rotation);
          ctx.font = `${Math.max(10, drawRadius * 6)}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.glyph, 0, 0);
        } else {
          // 4-point twinkling magic stars.
          ctx.translate(drawX, drawY);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(
              Math.cos((i * Math.PI) / 2) * drawRadius * 3,
              Math.sin((i * Math.PI) / 2) * drawRadius * 3
            );
            ctx.lineTo(
              Math.cos((i * Math.PI) / 2 + Math.PI / 4) * drawRadius * 1,
              Math.sin((i * Math.PI) / 2 + Math.PI / 4) * drawRadius * 1
            );
          }
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [bg3dEnabled, bg3dStyle, bg3dSpeed, bg3dDensity, bg3dMouseParallax, bg3dOpacity, colorCocoa, colorRose, colorInkSoft]);

  if (!bg3dEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}
