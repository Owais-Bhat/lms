"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, LogIn, User, ShieldCheck, Cake } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("bakestudio123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        router.push("/admin");
      } else {
        setError("Invalid credentials. Please use username 'admin' and password 'bakestudio123'.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cocoa/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="neu-raised rounded-3xl p-8 md:p-10 shadow-2xl border border-cocoa/10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="neu-raised-sm w-16 h-16 rounded-full flex items-center justify-center text-cocoa mb-4 bg-rose-light/50">
              <Cake size={32} />
            </div>
            <h1 className="font-serif text-3xl text-ink">Bakestudio Admin</h1>
            <p className="text-xs text-ink-soft mt-1">Sign in to control theme, orders & store settings</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="neu-inset rounded-xl p-3.5 text-xs text-rose-700 bg-rose-100/50 border border-rose-300 flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-cocoa uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="neu-inset rounded-2xl px-4 py-3 flex items-center gap-3">
                <User size={18} className="text-cocoa/70 shrink-0" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="bg-transparent outline-none text-sm text-ink w-full placeholder:text-ink-soft/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-cocoa uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="neu-inset rounded-2xl px-4 py-3 flex items-center gap-3">
                <Lock size={18} className="text-cocoa/70 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-transparent outline-none text-sm text-ink w-full placeholder:text-ink-soft/60"
                />
              </div>
            </div>

            <div className="neu-flat rounded-xl p-3 bg-cocoa/5 text-[11px] text-ink-soft flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-cocoa">
                <KeyRound size={14} /> Default Credentials:
              </span>
              <span>
                admin / <strong>bakestudio123</strong>
              </span>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full mt-2 justify-center gap-2">
              <LogIn size={18} />
              {loading ? "Authenticating..." : "Sign In to Admin"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
