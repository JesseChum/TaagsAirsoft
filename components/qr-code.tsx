import Image from "next/image";
import type { PaymentMethod } from "@/lib/shop";

/** A payment QR code on a white tile, or a dashed placeholder until the image is added. */
export function QrCode({ method, size }: { method: PaymentMethod; size: number }) {
  return (
    <div className="box-border rounded-md bg-white p-3" style={{ width: size, height: size }}>
      {method.qr ? (
        <Image src={method.qr} alt={`${method.name} QR code`} width={size - 24} height={size - 24} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded border-2 border-dashed border-[#b8b4a4] text-center font-mono text-[11px] tracking-[0.08em] text-[#6b6858]">
          {method.qrPlaceholder}
        </div>
      )}
    </div>
  );
}

export function CashIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
