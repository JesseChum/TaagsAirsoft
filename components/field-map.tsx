"use client";

import Image from "next/image";
import { useRef } from "react";
import fieldMap from "@/public/images/field-map.jpg";

const alt =
  "Aerial map of the TAAGS field with main and side paths, spawns, towers, Town, the lake and the swamp, on a lettered A–J and numbered 1–6 grid";

export function FieldMap() {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label="Open the field map full size"
        className="group relative block cursor-zoom-in overflow-hidden rounded-md border border-line bg-panel p-0"
      >
        <Image src={fieldMap} alt={alt} placeholder="blur" sizes="(min-width: 768px) calc(100vw - 128px), 100vw" className="block h-auto w-full" />
        <span className="absolute right-5 bottom-5 flex h-11 items-center gap-2.5 rounded border border-line-soft bg-ink/85 px-4 font-display text-base font-extrabold uppercase tracking-widest">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          View full size
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label="Field map, full size"
        onClick={(e) => {
          // Clicking the dimmed backdrop closes it.
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto max-h-none w-[min(100%-1rem,1800px)] overflow-visible bg-transparent p-0 text-bone backdrop:bg-[rgba(6,7,5,0.92)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-2xl font-extrabold uppercase tracking-[0.06em]">TAAGS Field map</span>
          <button
            type="button"
            aria-label="Close map"
            onClick={() => dialog.current?.close()}
            className="flex size-11 cursor-pointer items-center justify-center rounded border border-line-soft bg-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <Image src={fieldMap} alt={alt} sizes="100vw" className="block h-auto w-full rounded-md border border-line-soft" />
      </dialog>
    </>
  );
}
