import type { StaticImageData } from "next/image";

// Content for /shop. Bracketed values are placeholders still to confirm.

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: number | null; // dollars, or null while the price isn't set ([PRICE] shows)
};

export type ProductCategory = { id: string; label: string; note: string; items: Product[] };

export const shopCategories: ProductCategory[] = [
  {
    id: "rentals",
    label: "Rentals",
    note: "Pick up at the rental station",
    items: [
      { id: "rental-package", name: "Rental package", desc: "Replica, eye protection and BBs. [Confirm what is included.]", price: 30 },
      { id: "rental-replica", name: "Rental replica only", desc: "[Rifle or pistol. Bring your own eye protection.]", price: null },
      { id: "rental-mask", name: "Full-face mask", desc: "Required for players under 18.", price: null },
    ],
  },
  {
    id: "pyro",
    label: "Smoke & grenades",
    note: "Field-approved only",
    items: [
      { id: "smoke", name: "Smoke grenade", desc: "Enola Gaye cool-burn. The only smoke allowed on the field.", price: null },
      { id: "bb-grenade", name: "BB grenade", desc: "Must expel BBs. No flash-bangs. [Brand / type]", price: null },
    ],
  },
  {
    id: "food",
    label: "Food & drinks",
    note: "[Served from — set the time]",
    items: [
      { id: "meal", name: "[Lunch item]", desc: "[What is on the menu]", price: null },
      { id: "snack", name: "[Snack]", desc: "[Chips, bars, etc.]", price: null },
      { id: "water", name: "Water", desc: "[Bottle size]", price: null },
      { id: "soda", name: "[Soda / energy drink]", desc: "[Options]", price: null },
    ],
  },
];

export type PaymentMethod = {
  id: string;
  name: string;
  handle: string;
  /** QR code image: import it from /public/images (e.g. `import paypalQr from "@/public/images/qr/paypal.png"`) or use a path string. */
  qr?: StaticImageData | string;
  qrPlaceholder: string;
};

// Apps paid by scanning a QR code. Add each `qr` image when you have it.
export const qrMethods: PaymentMethod[] = [
  { id: "paypal", name: "PayPal", handle: "[@your-paypal]", qrPlaceholder: "[PAYPAL QR CODE]" },
  { id: "zelle", name: "Zelle", handle: "[email or phone]", qrPlaceholder: "[ZELLE QR CODE]" },
  { id: "cashapp", name: "Cash App", handle: "[$yourcashtag]", qrPlaceholder: "[CASH APP QR CODE]" },
  { id: "venmo", name: "Venmo", handle: "[@your-venmo]", qrPlaceholder: "[VENMO QR CODE]" },
];

export function formatMoney(n: number) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
