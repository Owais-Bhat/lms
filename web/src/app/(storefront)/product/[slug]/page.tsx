import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { getProductBySlugServer } from "@/lib/products-server";
import { ProductDetailClient } from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Products added via the admin panel after build won't have a static
// param, so allow Next.js to render them on demand instead of 404-ing.
export const dynamicParams = true;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugServer(slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
