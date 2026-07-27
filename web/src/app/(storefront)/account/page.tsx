import Link from "next/link";
import { Gift, Package, Star } from "lucide-react";
import { orderHistory } from "@/lib/data";
import { IconBubble } from "@/components/ui/IconBubble";

export default function AccountOverviewPage() {
  const latest = orderHistory[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="neu-raised rounded-3xl p-6">
        <h2 className="font-serif text-2xl text-ink mb-1">Welcome back, Ananya 👋</h2>
        <p className="text-sm text-ink-soft">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="neu-raised rounded-3xl p-6">
          <IconBubble icon={Gift} size={44} className="mb-3" />
          <div className="text-2xl font-bold text-ink">240 pts</div>
          <div className="text-xs text-ink-soft">Loyalty Points Balance</div>
        </div>
        <div className="neu-raised rounded-3xl p-6">
          <IconBubble icon={Package} size={44} className="mb-3" />
          <div className="text-2xl font-bold text-ink">{orderHistory.length}</div>
          <div className="text-xs text-ink-soft">Total Orders</div>
        </div>
        <div className="neu-raised rounded-3xl p-6">
          <IconBubble icon={Star} size={44} className="mb-3" />
          <div className="text-2xl font-bold text-ink">Gold</div>
          <div className="text-xs text-ink-soft">Member Tier</div>
        </div>
      </div>

      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-ink">Latest Order</div>
          <Link href="/account/orders" className="text-xs font-semibold text-cocoa">
            View all
          </Link>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-semibold text-ink">{latest.id}</div>
            <div className="text-xs text-ink-soft">{latest.date}</div>
          </div>
          <span className="neu-inset rounded-full px-3 py-1 text-xs font-semibold text-cocoa">
            {latest.status}
          </span>
          <div className="font-bold text-ink">${latest.total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
