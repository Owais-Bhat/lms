import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
      <div>
        <div className="text-xs font-bold tracking-[0.15em] uppercase text-cocoa mb-2">
          {eyebrow}
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
