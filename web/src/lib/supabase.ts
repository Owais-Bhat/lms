"use client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aecllrspvhgmkpfdwrpf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_BUh1el6-52mkLOUOr-rshg_y314W6dT";

const headers = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

export const supabaseDb = {
  // Select Query
  async select<T>(table: string, query = "*"): Promise<T[] | null> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${query}`, {
        method: "GET",
        headers,
      });
      if (!res.ok) {
        console.warn(`Supabase SELECT on ${table} returned status ${res.status}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error(`Supabase SELECT error on ${table}:`, err);
      return null;
    }
  },

  // Insert-or-update Query (matches on the given conflict column, default "id")
  async upsert<T>(table: string, data: Record<string, any>, conflictColumn = "id"): Promise<T | null> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictColumn}`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.warn(`Supabase UPSERT on ${table} returned status ${res.status}`);
        return null;
      }
      const upserted = await res.json();
      return Array.isArray(upserted) ? upserted[0] : upserted;
    } catch (err) {
      console.error(`Supabase UPSERT error on ${table}:`, err);
      return null;
    }
  },

  // Insert Query
  async insert<T>(table: string, data: Record<string, any>): Promise<T | null> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.warn(`Supabase INSERT on ${table} returned status ${res.status}`);
        return null;
      }
      const inserted = await res.json();
      return Array.isArray(inserted) ? inserted[0] : inserted;
    } catch (err) {
      console.error(`Supabase INSERT error on ${table}:`, err);
      return null;
    }
  },

  // Update Query
  async update<T>(table: string, matchKey: string, matchValue: string, data: Record<string, any>): Promise<T | null> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchKey}=eq.${encodeURIComponent(matchValue)}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.warn(`Supabase UPDATE on ${table} returned status ${res.status}`);
        return null;
      }
      const updated = await res.json();
      return Array.isArray(updated) ? updated[0] : updated;
    } catch (err) {
      console.error(`Supabase UPDATE error on ${table}:`, err);
      return null;
    }
  },

  // Delete Query
  async delete(table: string, matchKey: string, matchValue: string): Promise<boolean> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchKey}=eq.${encodeURIComponent(matchValue)}`, {
        method: "DELETE",
        headers,
      });
      return res.ok;
    } catch (err) {
      console.error(`Supabase DELETE error on ${table}:`, err);
      return false;
    }
  },
};
