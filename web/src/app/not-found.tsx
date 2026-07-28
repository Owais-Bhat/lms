import Link from "next/link";
import CakeIllustration from "@/components/CakeIllustration";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-base">
      <div className="neu-inset-lg rounded-full w-40 h-40 p-6 mb-6">
        <CakeIllustration variant="cookie" className="w-full h-full opacity-70" />
      </div>
      <h1 className="font-serif text-3xl text-ink mb-2">Oops, this slice is missing.</h1>
      <p className="text-ink-soft mb-6">The page you&apos;re looking for got eaten before we could serve it.</p>
      <div className="flex gap-3">
        <LinkButton href="/">Back Home</LinkButton>
        <Link href="/shop" className="neu-flat rounded-full px-6 py-3 text-sm font-semibold text-cocoa flex items-center">
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
