import { Gift, Share2, Star } from "lucide-react";
import { IconBubble } from "@/components/ui/IconBubble";

export default function RewardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="neu-raised rounded-3xl p-8 text-center">
        <IconBubble icon={Gift} size={64} className="mx-auto mb-4" />
        <div className="text-3xl font-bold text-ink mb-1">240 points</div>
        <div className="text-sm text-ink-soft">= $2.40 towards your next order</div>
      </div>

      <div className="neu-raised rounded-3xl p-6">
        <div className="text-sm font-bold text-ink mb-3">How to Earn</div>
        <ul className="text-sm text-ink-soft flex flex-col gap-2">
          <li className="flex items-center gap-2">
            <Star size={14} className="text-cocoa" /> Earn 1 point for every $1 spent
          </li>
          <li className="flex items-center gap-2">
            <Star size={14} className="text-cocoa" /> 50 bonus points on your birthday month
          </li>
          <li className="flex items-center gap-2">
            <Star size={14} className="text-cocoa" /> 100 points for every friend you refer
          </li>
        </ul>
      </div>

      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-ink mb-2">
          <Share2 size={14} /> Refer a Friend
        </div>
        <div className="neu-inset rounded-full px-4 py-3 text-sm text-ink-soft flex items-center justify-between">
          <span>bakestudio.com/r/ananya240</span>
          <button className="text-cocoa font-semibold text-xs">Copy</button>
        </div>
      </div>
    </div>
  );
}
