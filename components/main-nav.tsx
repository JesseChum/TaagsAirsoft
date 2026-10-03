"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { mainNav } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-9 font-display text-lg font-extrabold uppercase tracking-widest lg:flex">
      {mainNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 py-2.5 ${active ? "border-accent text-white" : "border-transparent"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Uses <details> so the menu still opens before JavaScript loads.
export function MobileNav() {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="group lg:hidden">
      <summary aria-label="Menu" className="flex size-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path className="group-open:hidden" d="M4 7h16M4 12h16M4 17h16" />
          <path className="hidden group-open:block" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </summary>
      <nav className="absolute inset-x-0 top-24 flex flex-col border-b border-line bg-ink-deep px-4 py-2 font-display text-xl font-extrabold uppercase tracking-widest">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`py-3 ${isActive(pathname, item.href) ? "text-accent" : ""}`}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/#contact" className="py-3">
          Contact
        </Link>
      </nav>
    </details>
  );
}
