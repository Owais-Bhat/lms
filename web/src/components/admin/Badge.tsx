import clsx from "clsx";

const tones: Record<string, string> = {
  neutral: "text-ink-soft",
  positive: "text-cocoa",
  negative: "text-red-700",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <span
      className={clsx(
        "neu-inset rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<string, "neutral" | "positive" | "negative"> = {
  Pending: "neutral",
  Confirmed: "positive",
  Baking: "positive",
  "Out for Delivery": "positive",
  Delivered: "positive",
  Cancelled: "negative",
  Paid: "positive",
  Refunded: "negative",
  COD: "neutral",
  Success: "positive",
  Active: "positive",
  Scheduled: "neutral",
  Draft: "neutral",
  Published: "positive",
  Approved: "positive",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone[status] ?? "neutral"}>{status}</Badge>;
}
