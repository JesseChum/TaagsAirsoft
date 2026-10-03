import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { footerLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-6 border-t border-line bg-ink-deep px-4 py-10 md:flex-row md:items-center md:justify-between md:px-16">
      <div className="flex items-center gap-8">
        <Link href="/" aria-label="T.A.A.G.S. home" className="shrink-0">
          <Image src="/taags-patch.png" alt="T.A.A.G.S. Kent, WA patch logo" width={70} height={72} className="h-[72px] w-auto" />
        </Link>
        <span className="text-sm text-muted">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-7 text-[15px]">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="text-sand">
            {link.label}
          </Link>
        ))}
        <div className="text-sand">
          <SocialLinks size={18} />
        </div>
      </div>
    </footer>
  );
}
