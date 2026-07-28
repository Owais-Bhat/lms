import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import clsx from "clsx";

export function StatCard({
  icon: Icon,
  label,
  value,
  changePct,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  changePct?: number;
}) {
  const positive = (changePct ?? 0) >= 0;
  return (
    <div className="neu-raised rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center text-cocoa">
          <Icon size={18} />
        </div>
        {changePct !== undefined && (
          <span
            className={clsx(
              "flex items-center gap-1 text-xs font-bold",
              positive ? "text-cocoa" : "text-red-700"
            )}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(changePct)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs text-ink-soft mt-1">{label}</div>
    </div>
  );
}
