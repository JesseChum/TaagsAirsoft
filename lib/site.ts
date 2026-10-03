// Site-wide content the client may change. Bracketed values are placeholders
// from the design mockup that still need confirming with the client.

export const site = {
  name: "T.A.A.G.S. Airsoft",
  legalName: "Tactical Assault Airsoft Gaming Squad (T.A.A.G.S.)",
  city: "Kent, WA",
  address: ["27830 108th Ave SE", "Kent, WA"],
  phone: "(206) 353-3599",
  email: "taagsairsoft11b@gmail.com",
  gameDays: "Once a month, Saturday",
  nextGameDay: "[DATE] · [TIME]",
};

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/game-modes", label: "Game Modes" },
  { href: "/rentals", label: "Rentals" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
];

export const utilityLinks = [
  { href: "#", label: "Community marketplace" },
  { href: "#", label: "Intheater Airsoft" },
  { href: "#", label: "SIGMA Airsoft" },
];

export const socials = {
  instagram: "#",
  youtube: "#",
  facebook: "#",
};

export const footerLinks = [
  { href: "/field-rules", label: "Field Rules" },
  { href: "/waiver", label: "Waiver" },
  { href: "/privacy", label: "Privacy" },
];

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.address.join(", "),
)}`;
