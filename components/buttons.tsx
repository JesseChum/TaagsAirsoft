import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex h-14 items-center justify-center gap-2.5 rounded px-8 font-display text-xl font-extrabold uppercase tracking-widest";

const variants = {
  primary: "bg-accent text-ink hover:text-ink hover:brightness-110",
  outline: "border-[1.5px] border-bone/60 text-bone",
};

type Props = ComponentProps<"a"> & { href: string; variant?: keyof typeof variants };

// Internal paths use next/link; mailto:, tel: and external URLs use a plain <a>.
export function ButtonLink({ variant = "primary", className = "", href, ...props }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href.startsWith("/")) return <Link href={href} className={classes} {...props} />;
  return <a href={href} className={classes} {...props} />;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">{children}</span>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="m-0 font-display text-5xl font-black uppercase leading-[0.95] md:text-7xl">
      {children}
    </h2>
  );
}
