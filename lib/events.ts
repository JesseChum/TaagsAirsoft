import type { StaticImageData } from "next/image";
import hero1 from "@/public/images/hero/hero-1.jpg";
import hero2 from "@/public/images/hero/hero-2.jpg";
import hero3 from "@/public/images/hero/hero-3.jpg";
import hero4 from "@/public/images/hero/hero-4.jpg";

// Events shown on /events. Add a new object to schedule an event; it moves to
// "Past" automatically the day after its date. Bracketed values are placeholders.
//
// `image` is the card thumbnail and the photo in the details window. Import a
// file from /public/images (like the ones above) or use a path string.

export type GameEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  tag: string;
  gameType: string;
  time: string;
  price: string;
  spots: string;
  blurb: string; // one line for the card
  description: string; // shown in the details window
  image: StaticImageData | string;
  imageAlt: string;
};

export const events: GameEvent[] = [
  {
    id: "2026-10-10",
    date: "2026-10-10",
    title: "Monthly Game Day",
    tag: "Open play",
    gameType: "Realistic milsim",
    time: "[START] – [END]",
    price: "[PRICE]",
    spots: "130 players max",
    blurb: "Our October Saturday op. Walk-ons and squads welcome.",
    description:
      "[Describe the day: scenario, teams, check-in time, chrono, and anything new for this month.]",
    image: hero2,
    imageAlt: "A squad of players posing on the field in front of tall evergreens",
  },
  {
    id: "2026-11-14",
    date: "2026-11-14",
    title: "Monthly Game Day",
    tag: "Open play",
    gameType: "Realistic milsim",
    time: "[START] – [END]",
    price: "[PRICE]",
    spots: "130 players max",
    blurb: "[Short teaser for the November game day.]",
    description:
      "[Describe the day: scenario, teams, check-in time, chrono, and anything new for this month.]",
    image: hero3,
    imageAlt: "Players moving through a wooden structure on the field",
  },
  {
    id: "2026-12-12",
    date: "2026-12-12",
    title: "Monthly Game Day",
    tag: "Open play",
    gameType: "Realistic milsim",
    time: "[START] – [END]",
    price: "[PRICE]",
    spots: "130 players max",
    blurb: "[Short teaser for the December game day.]",
    description:
      "[Describe the day: scenario, teams, check-in time, chrono, and anything new for this month.]",
    image: hero4,
    imageAlt: "Two teams lining up for a game briefing",
  },
  {
    id: "2026-09-12",
    date: "2026-09-12",
    title: "Monthly Game Day",
    tag: "Open play",
    gameType: "Realistic milsim",
    time: "[START] – [END]",
    price: "[PRICE]",
    spots: "130 players max",
    blurb: "[Recap of the September game day.]",
    description: "[Recap: how the day went, winning team, photos from the field.]",
    image: hero1,
    imageAlt: "Four players in different camo loadouts posing in the woods",
  },
];
