import type { Metadata } from "next";
import { Eyebrow, SectionTitle } from "@/components/buttons";
import { CashIcon, QrCode } from "@/components/qr-code";
import { ShopBrowser } from "@/components/shop-browser";
import { qrMethods } from "@/lib/shop";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop",
  description: `Rentals, smoke, grenades and food at T.A.A.G.S. Airsoft in ${site.city}. Pay by QR code or cash at the front.`,
};

const steps = ["Pick your items", "Pay by QR", "Show it at check-in"];

export default function ShopPage() {
  return (
    // pt-24 clears the floating site header (this page has no hero behind it).
    <div className="flex flex-col pt-24">
      <section className="flex flex-col justify-between gap-8 border-b border-line px-4 pt-16 pb-12 md:px-16 md:pt-22 lg:flex-row lg:items-end lg:gap-12">
        <div className="flex flex-col gap-4">
          <Eyebrow>{site.city} · Order ahead</Eyebrow>
          <h1 className="m-0 font-display text-7xl font-black uppercase leading-[0.9] text-white md:text-[112px]">Shop</h1>
          <p className="m-0 max-w-[560px] text-lg leading-relaxed text-bone-dim md:text-[19px]">
            Rentals, smoke, grenades and food. Build your order, pay with a QR code, and show your payment at check-in.
          </p>
        </div>
        <ol className="m-0 flex list-none flex-wrap gap-3 p-0">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3 rounded-md border border-line-soft bg-panel px-4.5 py-3.5 text-[15px]">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent font-display text-base font-black text-ink">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <ShopBrowser />

      <WaysToPay />
    </div>
  );
}

function WaysToPay() {
  return (
    <section id="pay" className="flex scroll-mt-8 flex-col gap-10 border-t border-line bg-panel px-4 py-20 md:px-16 md:py-24">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
        <div className="flex flex-col gap-3.5">
          <Eyebrow>Payment</Eyebrow>
          <SectionTitle>Ways to pay</SectionTitle>
        </div>
        <p className="m-0 max-w-[460px] text-[17px] leading-relaxed text-bone-dim">
          Scan with your phone&apos;s camera or the payment app. Always add your name in the note so we can match your payment at check-in.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {qrMethods.map((m) => (
          <div key={m.id} className="flex flex-col items-center gap-4 rounded-md border border-line-soft bg-ink p-6">
            <span className="self-stretch font-display text-3xl font-black uppercase text-white">{m.name}</span>
            <QrCode method={m} size={220} />
            <span className="self-stretch border-t border-[#23261e] pt-3.5 font-mono text-[15px] text-sand">{m.handle}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 rounded-md border border-line-soft bg-ink px-7 py-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/[0.12] text-accent">
          <CashIcon />
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-display text-3xl font-black uppercase text-white">Cash</span>
          <span className="text-[17px] text-sand">Paying cash? Pay in person at the front desk when you check in.</span>
        </div>
      </div>
    </section>
  );
}
