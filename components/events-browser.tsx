"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/buttons";
import type { GameEvent } from "@/lib/events";
import { directionsUrl, site } from "@/lib/site";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Filter = "upcoming" | "past" | "all";
type EventView = GameEvent & { d: Date; upcoming: boolean };

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function longDate(d: Date) {
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
const noopSubscribe = () => () => {};

// "Today" is only known in the browser. During the server render it is null and
// every event counts as upcoming, which avoids a hydration mismatch.
function useToday() {
  const key = useSyncExternalStore(noopSubscribe, todayKey, () => null);
  return useMemo(() => (key ? parseDate(key) : null), [key]);
}

export function EventsBrowser({ events }: { events: GameEvent[] }) {
  const today = useToday();
  // null = follow today's month (or the first event's month before "today" is known).
  const [shownMonth, setShownMonth] = useState<{ year: number; month: number } | null>(null);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [openId, setOpenId] = useState<string | null>(null);

  const firstEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0];
  const fallback = today ?? (firstEvent ? parseDate(firstEvent.date) : new Date(2026, 0, 1));
  const view = shownMonth ?? { year: fallback.getFullYear(), month: fallback.getMonth() };

  const all = useMemo<EventView[]>(
    () =>
      events
        .map((e) => {
          const d = parseDate(e.date);
          return { ...e, d, upcoming: today ? d >= today : true };
        })
        .sort((a, b) => a.d.getTime() - b.d.getTime()),
    [events, today],
  );

  const lists: Record<Filter, EventView[]> = {
    upcoming: all.filter((e) => e.upcoming),
    past: all.filter((e) => !e.upcoming).reverse(),
    all,
  };
  const visible = lists[filter];
  const next = lists.upcoming[0];
  const open = all.find((e) => e.id === openId) ?? null;

  function shiftMonth(delta: number) {
    const d = new Date(view.year, view.month + delta, 1);
    setShownMonth({ year: d.getFullYear(), month: d.getMonth() });
  }

  return (
    <>
      <FilterTabs filter={filter} setFilter={setFilter} counts={{ upcoming: lists.upcoming.length, past: lists.past.length, all: all.length }} />

      <div className="flex flex-col gap-14 px-4 pt-10 pb-24 md:px-16 md:pt-14">
        <Calendar
          year={view.year}
          month={view.month}
          events={all}
          today={today}
          next={next}
          onShift={shiftMonth}
          onOpen={setOpenId}
        />

        <section className="flex flex-col gap-5" aria-labelledby="event-details-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="event-details-heading" className="m-0 font-display text-4xl font-black uppercase md:text-5xl">
              Event details
            </h2>
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
              Showing {visible.length} {filter === "all" ? "" : `${filter} `}
              {visible.length === 1 ? "event" : "events"}
            </span>
          </div>
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((e) => (
                <EventCard key={e.id} event={e} onOpen={() => setOpenId(e.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-line-soft p-12 text-center text-muted">
              No events here yet. Check back soon or follow us on Instagram for updates.
            </div>
          )}
        </section>
      </div>

      <EventDialog event={open} onClose={() => setOpenId(null)} />
    </>
  );
}

function FilterTabs({
  filter,
  setFilter,
  counts,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  counts: Record<Filter, number>;
}) {
  const tabs: [Filter, string][] = [
    ["upcoming", "Upcoming"],
    ["past", "Past"],
    ["all", "All"],
  ];
  return (
    <div className="px-4 pt-8 md:px-16">
      <div role="group" aria-label="Filter events" className="inline-flex gap-1 rounded-md border border-line bg-panel p-1">
        {tabs.map(([key, label]) => {
          const on = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(key)}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded px-[18px] font-display text-[17px] font-extrabold uppercase tracking-widest ${
                on ? "bg-accent text-ink" : "text-bone"
              }`}
            >
              {label} <span className="font-mono text-xs opacity-75">{counts[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Calendar({
  year,
  month,
  events,
  today,
  next,
  onShift,
  onOpen,
}: {
  year: number;
  month: number;
  events: EventView[];
  today: Date | null;
  next?: EventView;
  onShift: (delta: number) => void;
  onOpen: (id: string) => void;
}) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: first.getDay() });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const countdown = next && today ? Math.round((next.d.getTime() - today.getTime()) / 86_400_000) : null;

  const arrow = "flex size-12 shrink-0 cursor-pointer items-center justify-center rounded border border-line-soft";

  return (
    <section aria-label="Event calendar" className="flex flex-col gap-6 rounded-md border border-line bg-panel p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-full flex-wrap items-center gap-4 md:w-auto md:gap-5">
          <div className="flex w-full items-center gap-3 md:w-auto md:gap-5">
            <button type="button" aria-label="Previous month" onClick={() => onShift(-1)} className={arrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <h2 aria-live="polite" className="m-0 min-w-0 grow text-center font-display text-3xl font-black uppercase tracking-[0.04em] md:min-w-[300px] md:grow-0 md:text-[44px]">
              {MONTHS[month]} {year}
            </h2>
            <button type="button" aria-label="Next month" onClick={() => onShift(1)} className={arrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
          <div className="flex gap-4 text-sm text-muted md:ml-1">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-accent" />Game day</span>
            <span className="flex items-center gap-2"><span className="size-3.5 rounded-[3px] border-[1.5px] border-bone" />Today</span>
          </div>
        </div>
        {next && (
          <div className="flex items-center gap-4 rounded-md border border-line-soft bg-ink py-3 pr-3 pl-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                Next up{countdown === null ? "" : ` · ${countdown === 0 ? "Today" : countdown === 1 ? "Tomorrow" : `In ${countdown} days`}`}
              </span>
              <span className="font-display text-[22px] font-extrabold uppercase leading-none">
                {next.title} · {MONTHS[next.d.getMonth()].slice(0, 3)} {next.d.getDate()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpen(next.id)}
              className="flex h-11 cursor-pointer items-center rounded bg-accent px-5 font-display text-base font-extrabold uppercase tracking-widest text-ink"
            >
              View details
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 font-mono text-[11px] tracking-[0.12em] text-muted md:gap-2 md:text-xs">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-center md:pl-3 md:text-left">
            {w.slice(0, 3).toUpperCase()}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {blanks.map((_, i) => (
          <div key={`b${i}`} className="h-14 rounded bg-[#161812] md:h-28" />
        ))}
        {days.map((day) => {
          const date = new Date(year, month, day);
          const ev = events.find((e) => sameDay(e.d, date));
          const isToday = today ? sameDay(date, today) : false;
          const border = isToday
            ? "border-[1.5px] border-bone"
            : ev
              ? ev.upcoming
                ? "border border-accent/55"
                : "border border-accent/20"
              : "border border-[#23261e]";
          const cell = `flex h-14 flex-col justify-between gap-1.5 rounded p-1.5 text-left md:h-28 md:p-2.5 ${border} ${
            ev ? "cursor-pointer bg-[#20231a]" : "bg-[#181a14]"
          }`;
          const num = (
            <span className={`font-mono text-[13px] md:text-[15px] ${ev || isToday ? "text-white" : "text-sand"}`}>{day}</span>
          );

          if (!ev) {
            return (
              <div key={day} className={cell}>
                {num}
              </div>
            );
          }
          return (
            <button
              key={day}
              type="button"
              onClick={() => onOpen(ev.id)}
              aria-label={`${MONTHS[month]} ${day}, ${ev.title}. View details`}
              className={cell}
            >
              {num}
              {/* Small screens: a dot. Larger screens: a label with name and time. */}
              <span className={`size-2 rounded-full md:hidden ${ev.upcoming ? "bg-accent" : "bg-[#6b6a5e]"}`} />
              <span
                className={`hidden flex-col gap-[3px] rounded-[3px] px-[9px] py-[7px] md:flex ${
                  ev.upcoming ? "bg-accent text-ink" : "bg-[#34372c] text-sand"
                }`}
              >
                <span className="font-display text-base font-extrabold uppercase leading-[1.1] tracking-[0.04em]">{ev.title}</span>
                <span className="font-mono text-[11px] opacity-85">{ev.time}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EventCard({ event, onOpen }: { event: EventView; onOpen: () => void }) {
  const { d, upcoming } = event;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${event.title}, ${longDate(d)}. View details`}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-md border border-line bg-panel p-0 text-left transition-colors hover:border-accent/60 ${
        upcoming ? "" : "opacity-70"
      }`}
    >
      <div className="relative h-[200px] w-full overflow-hidden bg-[#39412c]">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${upcoming ? "" : "grayscale-[70%]"}`}
        />
        <div className="absolute top-4 left-4 flex w-16 flex-col items-center gap-0.5 rounded bg-ink py-2">
          <span className="font-mono text-[11px] tracking-[0.12em] text-accent">{MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}</span>
          <span className="font-display text-[34px] font-black leading-none text-white">{d.getDate()}</span>
        </div>
        <span
          className={`absolute top-4 right-4 rounded-[3px] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
            upcoming ? "bg-accent text-ink" : "bg-ink text-muted"
          }`}
        >
          {upcoming ? event.tag : "Completed"}
        </span>
      </div>
      <div className="flex flex-col gap-2.5 p-6">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
          {WEEKDAYS[d.getDay()]} · {event.time}
        </span>
        <span className="font-display text-[30px] font-extrabold uppercase leading-[1.05] text-white">{event.title}</span>
        <span className="text-base leading-normal text-sand">{event.blurb}</span>
        <span className="mt-1.5 flex items-center justify-between border-t border-line-soft pt-3.5">
          <span className="font-mono text-[13px] text-accent">{event.price}</span>
          <span className="font-display text-[17px] font-extrabold uppercase tracking-widest">View details →</span>
        </span>
      </div>
    </button>
  );
}

function EventDialog({ event, onClose }: { event: EventView | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  // Keep the native <dialog> in sync with the selected event. Using showModal()
  // gives focus trapping and Escape-to-close for free.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (event && !dialog.open) dialog.showModal();
    if (!event && dialog.open) dialog.close();
  }, [event]);

  const details = event
    ? [
        { label: "Time", value: event.time },
        { label: "Cost", value: event.price },
        { label: "Spots", value: event.spots },
        { label: "Location", value: site.address.join(", ") },
        { label: "Game type", value: event.gameType },
        { label: "Age", value: "[AGE POLICY]" },
      ]
    : [];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the dimmed backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={event?.title}
      className="m-auto w-[min(880px,calc(100%-2rem))] max-h-[calc(100%-2rem)] overflow-y-auto rounded-lg border border-line-soft bg-panel p-0 text-bone shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(6,7,5,0.78)]"
    >
      {event && (
        <>
          <div className="relative h-56 w-full bg-[#39412c] md:h-[300px]">
            <Image src={event.image} alt={event.imageAlt} fill sizes="880px" className="object-cover" />
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded border border-line-soft bg-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="flex flex-col gap-6 px-5 pt-8 pb-8 md:px-10 md:pt-9 md:pb-10">
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                {event.upcoming ? event.tag : "Completed"} · {longDate(event.d)}
              </span>
              <h2 className="m-0 font-display text-4xl font-black uppercase leading-[0.95] text-white md:text-[52px]">{event.title}</h2>
              <p className="m-0 text-lg leading-relaxed text-bone-dim">{event.description}</p>
            </div>
            <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line-soft py-6 md:grid-cols-3">
              {details.map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{item.label}</dt>
                  <dd className="m-0 text-[17px]">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">What to bring</span>
              <p className="m-0 text-[17px] leading-relaxed text-bone-dim">
                Eye protection (required at all times on the field) · [YOUR GEAR LIST] · Signed waiver
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {event.upcoming && <ButtonLink href={`mailto:${site.email}?subject=${encodeURIComponent(`RSVP: ${event.title}, ${longDate(event.d)}`)}`}>RSVP / Register</ButtonLink>}
              <ButtonLink href={directionsUrl} variant="outline" target="_blank" rel="noopener noreferrer">
                Get Directions
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
