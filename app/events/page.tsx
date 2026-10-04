import type { Metadata } from "next";
import { Eyebrow } from "@/components/buttons";
import { EventsBrowser } from "@/components/events-browser";
import { events } from "@/lib/events";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description: `Upcoming and past airsoft game days at T.A.A.G.S. in ${site.city}.`,
};

export default function EventsPage() {
  return (
    // pt-24 clears the floating site header (this page has no hero behind it).
    <div className="flex flex-col pt-24">
      <section className="flex flex-col gap-4 border-b border-line px-4 pt-16 pb-12 md:px-16 md:pt-22 md:pb-14">
        <Eyebrow>{site.city} · Field schedule</Eyebrow>
        <h1 className="m-0 font-display text-7xl font-black uppercase leading-[0.9] text-white md:text-[112px]">Events</h1>
        <p className="m-0 max-w-[560px] text-lg leading-relaxed text-bone-dim md:text-[19px]">
          Game days run once a month on a Saturday. Pick a date on the calendar or open a card for more details.
        </p>
      </section>
      <EventsBrowser events={events} />
    </div>
  );
}
