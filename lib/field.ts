// Content for /field: chrono limits, field rules and waiver links.
// Source: "TAAGS Field Rules - Updated 210315" and "Waiver - Updated 241230".

export const rulesUpdated = "Mar 15, 2021";
export const waiverUpdated = "Dec 30, 2024";

// Where people download or view the official waiver PDF.
export const waiverPdfUrl = "https://drive.google.com/file/d/1NHAYiaCqfNBuGdhTEERRQ4BXFsxn9r_S/view";

// ---- Chrono --------------------------------------------------------------

export const chronoLimits = {
  aeg: 2.0, // joules: AEG & semi-auto
  bolt: 3.0, // joules: bolt & pump action
};

export const bbWeights = [0.2, 0.23, 0.25, 0.28, 0.3, 0.33, 0.38, 0.43, 0.45]; // grams

export const chartFps = Array.from({ length: 26 }, (_, i) => 250 + i * 10); // 250–500

/** Muzzle energy in joules for a BB of `grams` at `fps`. */
export function joules(fps: number, grams: number) {
  const v = fps * 0.3048;
  return 0.5 * (grams / 1000) * v * v;
}

/** Highest whole FPS that stays within `limit` joules for a BB of `grams`. */
export function maxFps(limit: number, grams: number) {
  return Math.floor(Math.sqrt((2 * limit) / (grams / 1000)) / 0.3048);
}

// ---- Rules ---------------------------------------------------------------

export const topRules = [
  {
    title: "Eye protection on",
    text: "Full-seal goggles or a full face mask any time you are outside staging. Under 18? Full face protection.",
  },
  {
    title: "Call your hits",
    text: "This is an honor game. Hit? Call it, then walk off with your red dead rag showing.",
  },
  {
    title: "Staging is a safe zone",
    text: "No shooting or flagging people. Mag out, muzzle blocked, battery or air line disconnected.",
  },
];

export type Rule = { title: string; text?: string; removal?: boolean };

// `removal: true` marks a rule that gets a player removed from the field.
export const ruleCategories: { label: string; rules: Rule[] }[] = [
  {
    label: "Safety gear",
    rules: [
      { title: "Eye protection outside staging", text: "Full-seal glasses or a full face mask. Prescription glasses only if shatterproof with side shields." },
      { title: "Under 18: full face protection" },
      { title: "Plastic 6mm BBs only", text: "No other type of projectile is allowed." },
      { title: "Red lasers only" },
      { title: "No real weapons", text: "No real guns or knives. Rubber knives are OK; plastic knives are not." },
      { title: "Grenades must throw BBs", text: "No flash-bangs. Smoke: Enola Gaye cool-burn only." },
    ],
  },
  {
    label: "Gameplay",
    rules: [
      { title: "Line of sight, on your honor", text: "Call your hits and stop playing. Show your red dead rag while you leave the fight." },
      { title: "No minimum engagement distance" },
      { title: "Aim for center mass", text: "Head shots only when center mass is not available." },
      { title: "Blind firing is allowed", text: "Only if you know what is behind your target." },
    ],
  },
  {
    label: "Staging & safe zone",
    rules: [
      { title: "Staging is the safe zone", text: "Marked by caution tape, rope and fences." },
      { title: "No shooting or flagging", text: "Only sight in at the targets on the east side." },
      { title: "Make your gun safe", text: "Mag out, muzzle blocked, battery or air line disconnected." },
      { title: "Stay out of the parking lot", text: "No setting up, hanging out or walking there." },
      { title: "Fenced properties are off-limits", text: "Except the outhouse on the west side of staging." },
      { title: "Smoke only at the fire pit", text: "Put your butts in the pit." },
    ],
  },
  {
    label: "Structures",
    rules: [
      { title: "Don’t push on the plexiglass", text: "In Fort McFarland." },
      { title: "Follow posted max capacity" },
      { title: "Use care on the fire pole" },
      { title: "Connex boxes are off-limits", text: "No climbing them." },
    ],
  },
  {
    label: "Check-in",
    rules: [
      { title: "$20 entry fee", text: "Pay on arrival and get your wrist stamped. It funds field upkeep and new builds." },
      { title: "Everyone signs a waiver", text: "A parent or guardian signs for anyone under 18." },
      { title: "Chrono every gun", text: "At the rental station, after waiver and fee. Passing guns get a zip tie." },
    ],
  },
  {
    label: "Respect",
    rules: [
      { title: "Respect the field", text: "It belongs to a family. Damage it, or anyone’s gear, on purpose and you leave.", removal: true },
      { title: "No fighting", text: "Settle disputes calmly and at the lowest level possible.", removal: true },
      { title: "Respect other players’ gear", text: "Theft is not tolerated. Found something? Lost & Found is by the barn." },
    ],
  },
];

export const checkInSteps = [
  { title: "Sign the waiver", text: "Online below, every 12 months" },
  { title: "Pay $20 entry", text: "Get your wrist stamped" },
  { title: "Chrono every gun", text: "At the rental station, get a zip tie" },
  { title: "Gear up and play", text: "See you on the field" },
];
