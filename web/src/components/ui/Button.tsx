import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "icon";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full neu-pressable select-none disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variants: Record<Variant, string> = {
  primary: "neu-raised-sm bg-cocoa text-[#fff6ec] hover:brightness-110",
  ghost: "neu-flat text-cocoa border border-cocoa/15",
  icon: "neu-raised-sm rounded-full !p-0 aspect-square text-cocoa",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={clsx(base, sizes[size], variants[variant], className)}>
      {children}
    </Link>
  );
}
