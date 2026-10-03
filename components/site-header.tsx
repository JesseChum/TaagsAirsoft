import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { MainNav, MobileNav } from "@/components/main-nav";
import { SocialLinks } from "@/components/social-links";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-24 items-center justify-between border-b border-bone/15 px-4 md:px-16">
      <Link href="/" aria-label="T.A.A.G.S. home" className="flex h-[84px] items-center">
        <Image
          src="/taags-patch.png"
          alt="T.A.A.G.S. Kent, WA patch logo"
          width={82}
          height={84}
          priority
          className="h-[72px] w-auto md:h-[84px]"
        />
      </Link>
      <MainNav />
      <div className="flex items-center gap-5">
        <div className="hidden lg:block">
          <SocialLinks />
        </div>
        <ButtonLink href="/#contact" className="hidden h-12 px-[26px] text-lg md:inline-flex">
          Contact
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </ButtonLink>
        <MobileNav />
      </div>
    </header>
  );
}
