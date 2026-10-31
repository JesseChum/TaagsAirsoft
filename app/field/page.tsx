import type { Metadata } from "next";
import { Eyebrow, SectionTitle } from "@/components/buttons";
import { ChronoChart } from "@/components/chrono-chart";
import { FieldMap } from "@/components/field-map";
import { WaiverForm } from "@/components/waiver-form";
import { checkInSteps, chronoLimits, ruleCategories, rulesUpdated, topRules, waiverPdfUrl, waiverUpdated } from "@/lib/field";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Field",
  description: `Field map, chrono limits, rules and waiver for T.A.A.G.S. Airsoft in ${site.city}.`,
};

const jumpLinks = [
  { href: "#map", n: "01", label: "Field map" },
  { href: "#chrono", n: "02", label: "Chrono limits" },
  { href: "#rules", n: "03", label: "Field rules" },
  { href: "#waiver", n: "04", label: "Waiver" },
];

export default function FieldPage() {
  return (
    // pt-24 clears the floating site header (this page has no hero behind it).
    <div className="flex flex-col pt-24">
      <Intro />
      <MapSection />
      <ChronoSection />
      <RulesSection />
      <WaiverSection />
    </div>
  );
}

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
      <div className="flex flex-col gap-3.5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionTitle>{title}</SectionTitle>
      </div>
      {children}
    </div>
  );
}

function Check() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function Intro() {
  return (
    <section className="flex flex-col gap-8 border-b border-line px-4 pt-16 pb-12 md:px-16 md:pt-22">
      <div className="flex flex-col gap-4">
        <Eyebrow>{site.city} · Know before you go</Eyebrow>
        <h1 className="m-0 font-display text-7xl font-black uppercase leading-[0.9] text-white md:text-[112px]">The Field</h1>
        <p className="m-0 max-w-[620px] text-lg leading-relaxed text-bone-dim md:text-[19px]">
          Everything you need before game day: the field layout, chrono limits, the rules and the waiver.
        </p>
      </div>
      <nav aria-label="On this page" className="flex flex-wrap gap-3">
        {jumpLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex h-12 items-center gap-3 rounded border border-line-soft bg-panel px-5 font-display text-lg font-extrabold uppercase tracking-widest"
          >
            <span className="font-mono text-xs text-accent">{l.n}</span>
            {l.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

function MapSection() {
  const legend = [
    { label: "Main path", swatch: <span className="h-1 w-7 rounded-sm bg-[#c0392b]" /> },
    { label: "Side path", swatch: <span className="h-1 w-7 rounded-sm bg-[#6b7fd7]" /> },
    { label: "Point of interest", swatch: <span className="size-4 rounded-full border-2 border-bone" /> },
  ];
  return (
    <section id="map" className="flex scroll-mt-8 flex-col gap-8 px-4 py-20 md:px-16 md:py-24">
      <SectionHead eyebrow="01 · Field map" title="Know the ground">
        <div className="flex flex-wrap items-center gap-6 text-[15px] text-sand">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-2.5">
              {item.swatch}
              {item.label}
            </span>
          ))}
        </div>
      </SectionHead>
      <FieldMap />
      <p className="m-0 text-[15px] text-muted">
        Some paths may be inaccessible, obstructed or unmarked. The staging area is just off the west edge of the field, near grid A4.
      </p>
    </section>
  );
}

function ChronoSection() {
  const facts = [
    <>Every gun is chrono&apos;d at the rental station and gets a <strong className="text-white">zip tie</strong> when it passes</>,
    <><strong className="text-white">Plastic 6mm BBs only</strong>. No other projectiles</>,
    <><strong className="text-white">No minimum engagement distance</strong></>,
  ];
  const limits = [
    { label: "AEG & semi-auto", value: chronoLimits.aeg, text: "Electric and gas guns that fire with each trigger pull or on full auto." },
    { label: "Bolt & pump action", value: chronoLimits.bolt, text: "Bolt-action and pump-action rifles and shotguns." },
  ];

  return (
    <section id="chrono" className="flex scroll-mt-8 flex-col gap-10 border-y border-line bg-panel px-4 py-20 md:px-16 md:py-24">
      <SectionHead eyebrow="02 · Chronograph" title="Chrono limits">
        <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-bone-dim">
          Our limits are set in <strong className="text-white">joules</strong> (energy), not FPS. Heavier BBs carry more energy at the same speed, so find
          your BB weight in the chart below.
        </p>
      </SectionHead>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {limits.map((l) => (
          <div key={l.label} className="flex flex-col gap-3.5 rounded-md border border-line-soft bg-ink p-7">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{l.label}</span>
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[88px] font-black leading-[0.85] text-accent">{l.value.toFixed(1)}</span>
              <span className="font-display text-[28px] font-extrabold uppercase text-white">Joules max</span>
            </div>
            <span className="text-base leading-normal text-sand">{l.text}</span>
          </div>
        ))}
        <ul className="m-0 flex list-none flex-col justify-center gap-4 rounded-md border border-line-soft bg-ink p-7">
          {facts.map((fact, i) => (
            <li key={i} className="flex items-start gap-3.5 text-[17px] leading-snug">
              <Check />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      <ChronoChart />
    </section>
  );
}

function RulesSection() {
  return (
    <section id="rules" className="flex scroll-mt-8 flex-col gap-10 px-4 py-20 md:px-16 md:py-24">
      <SectionHead eyebrow="03 · Field rules" title="Play safe. Play fair.">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Rules updated · {rulesUpdated}</span>
      </SectionHead>

      {/* The three must-knows */}
      <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
        {topRules.map((r, i) => (
          <li key={r.title} className="flex items-start gap-5 rounded-md border border-accent/35 bg-accent/[0.08] p-7">
            <span className="font-display text-[56px] font-black leading-[0.8] text-accent">{i + 1}</span>
            <div className="flex flex-col gap-2">
              <span className="font-display text-[26px] font-extrabold uppercase leading-[1.05] text-white">{r.title}</span>
              <span className="text-base leading-normal text-bone-dim">{r.text}</span>
            </div>
          </li>
        ))}
      </ol>

      {/* Everything else, grouped by topic */}
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ruleCategories.map((cat) => (
          <section key={cat.label} aria-label={cat.label} className="flex flex-col rounded-md border border-line bg-panel px-7 pt-7 pb-3">
            <div className="flex items-center justify-between border-b-2 border-accent pb-4">
              <h3 className="m-0 font-display text-[26px] font-extrabold uppercase tracking-[0.04em]">{cat.label}</h3>
              <span className="font-mono text-xs text-muted">{cat.rules.length} RULES</span>
            </div>
            <ul className="m-0 list-none p-0">
              {cat.rules.map((rule) => (
                <li key={rule.title} className="flex flex-col gap-1 border-b border-[#23261e] py-4 last:border-b-0">
                  <span className="flex items-center gap-2.5 text-[17px] font-semibold leading-snug text-white">
                    {rule.title}
                    {rule.removal && <RemovalBadge />}
                  </span>
                  {rule.text && <span className="text-[15px] leading-normal text-sand">{rule.text}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="m-0 flex items-center gap-3 text-[15px] text-muted">
        <RemovalBadge /> Breaking these gets you removed from the field immediately.
      </p>
    </section>
  );
}

function RemovalBadge() {
  return (
    <span className="shrink-0 rounded-[3px] border border-[#a3443a] bg-[#4a1f1a] px-[7px] py-[3px] font-mono text-[10px] tracking-[0.1em] text-[#f0b0a6]">
      REMOVAL
    </span>
  );
}

function WaiverSection() {
  return (
    <section id="waiver" className="flex scroll-mt-8 flex-col gap-10 border-t border-line bg-panel px-4 pt-20 pb-24 md:px-16 md:pt-24 md:pb-28">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end lg:gap-12">
        <div className="flex max-w-[720px] flex-col gap-4">
          <Eyebrow>04 · Waiver &amp; check-in</Eyebrow>
          <SectionTitle>Sign before you play</SectionTitle>
          <p className="m-0 text-lg leading-relaxed text-bone-dim">
            Every player signs a waiver. It is good for <strong className="text-white">12 months</strong> from the day you sign. Players under 18 need a
            parent or legal guardian to sign too.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <a
            href={waiverPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[52px] items-center gap-2.5 self-start rounded border-[1.5px] border-bone/60 px-6 font-display text-lg font-extrabold uppercase tracking-widest lg:self-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
            Download waiver PDF
          </a>
          <span className="text-sm text-muted">Prefer paper? Print it and bring it to check-in.</span>
        </div>
      </div>

      <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {checkInSteps.map((step, i) => (
          <li key={step.title} className="flex items-center gap-4 rounded-md border border-line-soft bg-ink p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xl font-black text-ink">{i + 1}</span>
            <span className="text-base leading-snug">
              <strong className="block text-white">{step.title}</strong>
              <span className="text-sand">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>

      <WaiverForm />

      <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Waiver last updated · {waiverUpdated}</span>
    </section>
  );
}
