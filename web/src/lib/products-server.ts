import { getProductBySlug, type Product } from "@/lib/data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aecllrspvhgmkpfdwrpf.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_BUh1el6-52mkLOUOr-rshg_y314W6dT";

function rowToProduct(row: Record<string, any>): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description || "",
    flavor: row.flavor || "Vanilla",
    price: Number(row.price),
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 1),
    eggless: Boolean(row.eggless),
    glutenFree: Boolean(row.gluten_free),
    weights: typeof row.weights === "string" ? JSON.parse(row.weights) : row.weights || [],
    illustration: row.illustration || "tart",
    image: row.image || "/images/products/wedding-tiered-elegance.jpg",
  };
}

// Server-side lookup used at request time for products added via the admin
// panel after build — they won't be in the static seed data or
// generateStaticParams, so we fall back to a direct Supabase REST call.
export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const seeded = getProductBySlug(slug);

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        // A Supabase row exists for this slug (either an admin-added product,
        // or a seed product that's been edited/toggled) — it's authoritative.
        if (rows[0].active === false) return null;
        return rowToProduct(rows[0]);
      }
    }
  } catch {
    // fall through to the static seed below
  }

  return seeded ?? null;
}
