import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export function IconBubble({
  icon: Icon,
  size = 48,
  pressed = false,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center text-cocoa shrink-0",
        pressed ? "neu-inset" : "neu-raised-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.42} strokeWidth={1.75} />
    </div>
  );
}
