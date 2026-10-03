import Link from "next/link";
import { ButtonLink, Eyebrow, SectionTitle } from "@/components/buttons";
import { directionsUrl, site } from "@/lib/site";

// Replace each color with a photo, e.g. { image: "/hero/field.jpg" }.
// The last slide must repeat the first so the loop is seamless.
const heroSlides = [
  { color: "#39412c", label: "PHOTO 01 · [REPLACE WITH FIELD PHOTO]" },
  { color: "#3b3d38", label: "PHOTO 02 · [REPLACE WITH ACTION SHOT]" },
  { color: "#4d4231", label: "PHOTO 03 · [REPLACE WITH TEAM PHOTO]" },
  { color: "#2d383c", label: "PHOTO 04 · [REPLACE WITH GEAR PHOTO]" },
  { color: "#39412c", label: "PHOTO 01 · [REPLACE WITH FIELD PHOTO]" },
];

const stats = [
  { value: "[5]", label: "Acres of play area" },
  { value: "[2011]", label: "Established" },
  { value: "[Realistic Milsim]", label: "Game modes" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeRun />
      <About />
      <Contact />
    </>
  );
}

function Hero() {
  return (
    <section className="relative h-[680px] overflow-hidden bg-panel md:h-[800px]">
      <div className="hero-track absolute inset-y-0 left-0 flex w-[500%]">
        {heroSlides.map((slide, i) => (
          <div key={i} className="relative h-full w-1/5 shrink-0" style={{ background: slide.color }}>
            <span className="absolute right-4 bottom-24 z-10 font-mono text-xs tracking-widest text-stone md:right-16">
              {slide.label}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0" style={{ background: "rgba(10, 11, 8, var(--hero-overlay))" }} />

      <div className="absolute top-40 left-4 right-4 z-10 flex max-w-[820px] flex-col gap-7 md:top-[250px] md:left-16">
        <div className="flex items-center gap-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          <span className="h-0.5 w-10 bg-accent" />
          <span>[{site.city}] · T.A.A.G.S Outdoor Airsoft Field</span>
        </div>
        <h1 className="m-0 font-display text-7xl font-black uppercase leading-[0.88] tracking-[0.01em] text-white md:text-[128px]">
          Gear up.
          <br />
          Move out.
        </h1>
        <p className="m-0 max-w-[560px] text-lg leading-relaxed text-bone-dim md:text-xl">
          
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          <ButtonLink href="/events">Book a Game</ButtonLink>
          <ButtonLink href="/events" variant="outline">View Events</ButtonLink>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-10 z-10 flex items-center justify-between font-mono text-xs tracking-[0.12em] text-stone md:inset-x-16">
        <div className="flex items-center gap-2.5">
          <span className="h-[3px] w-12 bg-accent" />
          <span className="h-[3px] w-6 bg-bone/35" />
          <span className="h-[3px] w-6 bg-bone/35" />
          <span className="h-[3px] w-6 bg-bone/35" />
        </div>
        <span>SCROLL ↓</span>
      </div>
    </section>
  );
}

function WhatWeRun() {
  return (
    <section className="flex flex-col gap-14 px-4 pt-20 pb-24 md:px-16 md:pt-28 md:pb-30">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3.5">
          <SectionTitle>Pick your mission</SectionTitle>
        </div>
        <Link href="/events" className="border-b-2 border-accent pb-1.5 font-display text-lg font-extrabold uppercase tracking-widest">
          All events →
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border border-line bg-panel">
        <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
          <h3 className="m-0 font-display text-4xl font-extrabold uppercase md:text-[40px]">Rental Packages</h3>
          <p className="m-0 max-w-[520px] text-lg leading-relaxed text-sand">
            First time? Rent a replica, eye protection and BBs on site. [WHAT&apos;S INCLUDED]
          </p>
          <span className="font-mono text-sm text-accent">FROM [PRICE]</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="flex flex-col gap-12 border-t border-line bg-panel px-4 py-20 md:px-16 md:py-28 lg:flex-row lg:items-center lg:gap-20">
      <div className="flex h-72 w-full shrink-0 items-end rounded-md bg-[#39412c] p-6 font-mono text-xs tracking-widest text-stone md:h-[460px] lg:w-[600px]">
        [ABOUT PHOTO · FIELD OR CREW]
      </div>
      <div className="flex grow flex-col gap-6">
        <SectionTitle>About T.A.A.G.S Airsoft</SectionTitle>
        <p className="m-0 text-[19px] leading-relaxed text-bone-dim">
          [Tell your story: when you opened, who runs the field, what makes your games different, and how you keep play fair and safe.]
        </p>
        <p className="m-0 text-[19px] leading-relaxed text-bone-dim">
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 border-t border-line-soft pt-7 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5">
              <span className="font-display text-5xl font-black text-white">{stat.value}</span>
              <span className="text-[15px] text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const details = [
    { label: "Address", value: site.address.map((line) => <span key={line} className="block">{line}</span>) },
    { label: "Game Days", value: site.gameDays },
    { label: "Phone", value: <a href={`tel:${site.phone.replace(/\D/g, "")}`}>{site.phone}</a> },
    { label: "Email", value: <a href={`mailto:${site.email}`} className="break-all">{site.email}</a> },
  ];

  return (
    <section id="contact" className="flex scroll-mt-4 flex-col gap-16 px-4 py-20 md:px-16 md:py-28 lg:flex-row">
      <div className="flex shrink-0 flex-col gap-9 lg:w-[560px]">
        <div className="flex flex-col gap-3.5">
          <SectionTitle>Get in touch</SectionTitle>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {details.map((d) => (
            <div key={d.label} className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{d.label}</span>
              <span className="text-lg leading-normal">{d.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href={`mailto:${site.email}`}>Send a Message</ButtonLink>
          <ButtonLink href={directionsUrl} variant="outline" target="_blank" rel="noopener noreferrer">
            Get Directions
          </ButtonLink>
        </div>
      </div>
      <div className="flex h-80 grow items-center justify-center rounded-md border border-line bg-panel-alt font-mono text-xs tracking-[0.12em] text-muted md:h-[480px]">
        [MAP EMBED]
      </div>
    </section>
  );
}
