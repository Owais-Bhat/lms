import { Suspense } from "react";
import { ShopClient } from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="px-4 md:px-8 py-16 text-center text-ink-soft">Loading menu…</div>}>
      <ShopClient />
    </Suspense>
  );
}
