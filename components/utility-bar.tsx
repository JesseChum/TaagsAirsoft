import Link from "next/link";
import { site, utilityLinks } from "@/lib/site";

export function UtilityBar() {
  return (
    <div className="flex h-10 items-center justify-between border-b border-line bg-ink-deep px-4 font-mono text-xs uppercase tracking-[0.08em] text-muted md:px-16">
      <div className="flex items-center gap-3">
        <span className="size-2 rounded-full bg-accent" />
        <span>Next game day: {site.nextGameDay}</span>
      </div>
      <div className="hidden items-center gap-7 md:flex">
        {utilityLinks.map((link) => (
          <Link key={link.label} href={link.href} className="text-muted">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
