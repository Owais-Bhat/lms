"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseDb } from "@/lib/supabase";

type AuthState = {
  isAuthenticated: boolean;
  adminUser: { username: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true, // Default enabled for instant admin access
      adminUser: { username: "admin", role: "Super Admin" },

      login: async (username, password) => {
        // First check Supabase admin_users table
        const users = await supabaseDb.select<any>("admin_users", "*");
        if (users && users.length > 0) {
          const match = users.find((u) => u.username === username.trim() && u.password === password);
          if (match) {
            set({
              isAuthenticated: true,
              adminUser: { username: match.username, role: match.role || "Super Admin" },
            });
            return true;
          }
        }

        // Fallback check against provided user password "Awais111@9149@" or default "bakestudio123"
        if (
          username.trim() === "admin" &&
          (password === "Awais111@9149@" || password === "bakestudio123")
        ) {
          set({
            isAuthenticated: true,
            adminUser: { username: "admin", role: "Super Admin" },
          });
          return true;
        }

        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          adminUser: null,
        });
      },
    }),
    { name: "bakestudio-admin-auth" }
  )
);
