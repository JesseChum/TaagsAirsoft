"use client";

import { useId, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { waiverPdfUrl } from "@/lib/field";

/** Everything the online waiver collects. This is the shape to store in the database. */
export type WaiverSubmission = {
  name: string;
  dob: string; // YYYY-MM-DD
  emergencyName: string;
  emergencyPhone: string;
  signature: string; // PNG data URL of the drawn signature
  signedAt: string; // ISO timestamp
  validUntil: string; // ISO timestamp, 12 months after signing
  minor: boolean;
  guardianName?: string;
  guardianSignature?: string; // PNG data URL
};

// TODO: send the waiver to the database (e.g. POST to an /api/waivers route).
// Until that exists, submitting only shows the confirmation on the page.
async function saveWaiver(data: WaiverSubmission) {
  void data;
}

const empty = { name: "", dob: "", emergencyName: "", emergencyPhone: "", minor: false, guardianName: "", agree: false };

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const inputClass =
  "h-[52px] w-full rounded border border-line-soft bg-panel px-4 text-[17px] text-bone placeholder:text-muted/70 [color-scheme:dark]";
const labelClass = "font-mono text-[11px] uppercase tracking-[0.1em] text-muted";

export function WaiverForm() {
  const [form, setForm] = useState(empty);
  const [signature, setSignature] = useState<string | null>(null);
  const [guardianSignature, setGuardianSignature] = useState<string | null>(null);
  const [padKey, setPadKey] = useState(0); // bump to reset the signature pads
  const [done, setDone] = useState<WaiverSubmission | null>(null);
  const [saving, setSaving] = useState(false);
  const id = useId();

  const set = (key: keyof typeof empty) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const missing: string[] = [];
  if (!form.name.trim()) missing.push("name");
  if (!form.dob) missing.push("date of birth");
  if (!form.emergencyName.trim() || !form.emergencyPhone.trim()) missing.push("emergency contact");
  if (!signature) missing.push("signature");
  if (form.minor && (!form.guardianName.trim() || !guardianSignature)) missing.push("guardian name & signature");
  if (!form.agree) missing.push("agreement");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (missing.length || !signature) return;
    const now = new Date();
    const validUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const data: WaiverSubmission = {
      name: form.name.trim(),
      dob: form.dob,
      emergencyName: form.emergencyName.trim(),
      emergencyPhone: form.emergencyPhone.trim(),
      signature,
      signedAt: now.toISOString(),
      validUntil: validUntil.toISOString(),
      minor: form.minor,
      ...(form.minor ? { guardianName: form.guardianName.trim(), guardianSignature: guardianSignature ?? undefined } : {}),
    };
    setSaving(true);
    try {
      await saveWaiver(data);
      setDone(data);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setForm(empty);
    setSignature(null);
    setGuardianSignature(null);
    setPadKey((k) => k + 1);
    setDone(null);
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col gap-6 rounded-md border border-accent/35 bg-ink px-6 py-10 md:flex-row md:items-center md:gap-8 md:px-10 md:py-12">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-accent">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#12140f" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
        <div className="flex grow flex-col gap-2">
          <span className="font-display text-[44px] font-black uppercase leading-none text-white">Waiver signed</span>
          <span className="text-lg leading-relaxed text-bone-dim">
            Thanks, {done.name}. Your waiver is on file and good until{" "}
            <strong className="text-white">{formatDate(new Date(done.validUntil))}</strong>. Just give your name at check-in.
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="h-12 shrink-0 cursor-pointer self-start rounded border-[1.5px] border-bone/60 px-5 font-display text-[17px] font-extrabold uppercase tracking-widest md:self-auto"
        >
          Sign another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-label="Sign the waiver online" className="flex flex-col gap-9 rounded-md border border-line-soft bg-ink p-5 md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#23261e] pb-6">
        <h3 className="m-0 font-display text-[40px] font-black uppercase leading-none">Sign online</h3>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">About 2 minutes · * required</span>
      </div>

      {/* A. Read */}
      <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
        <Legend letter="A">Read the waiver</Legend>
        {/* Live preview of the waiver PDF. Google Drive files can be embedded with their /preview URL. */}
        <iframe
          src={waiverPdfUrl.replace(/\/view.*$/, "/preview")}
          title="Waiver PDF"
          loading="lazy"
          className="h-[420px] w-full rounded border border-line-soft bg-panel"
        />
        <a href={waiverPdfUrl} target="_blank" rel="noopener noreferrer" className="self-start text-sm text-sand underline">
          Open the waiver in a new tab
        </a>
      </fieldset>

      {/* B. Details */}
      <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
        <Legend letter="B">Your details</Legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field id={`${id}-name`} label="Printed name *">
            <input id={`${id}-name`} type="text" autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
          </Field>
          <Field id={`${id}-dob`} label="Date of birth *">
            <input id={`${id}-dob`} type="date" autoComplete="bday" value={form.dob} onChange={set("dob")} className={inputClass} />
          </Field>
          <Field id={`${id}-ecn`} label="Emergency contact *">
            <input id={`${id}-ecn`} type="text" placeholder="Name" value={form.emergencyName} onChange={set("emergencyName")} className={inputClass} />
          </Field>
          <Field id={`${id}-ecp`} label="Emergency contact phone *">
            <input id={`${id}-ecp`} type="tel" placeholder="(000) 000-0000" value={form.emergencyPhone} onChange={set("emergencyPhone")} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      {/* C. Sign */}
      <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
        <Legend letter="C">Sign</Legend>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SignaturePad key={`p${padKey}`} label="Participant signature * · draw with finger or mouse" onChange={setSignature} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Date</span>
              <span suppressHydrationWarning className="flex h-[52px] items-center rounded border border-line-soft bg-panel px-4 text-[17px] text-sand">
                {formatDate(new Date())}
              </span>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded border border-line-soft px-4 py-3.5 text-base">
              <input
                type="checkbox"
                checked={form.minor}
                onChange={() => setForm((f) => ({ ...f, minor: !f.minor }))}
                className="size-5 accent-accent"
              />
              Participant is under 18
            </label>
          </div>
        </div>
      </fieldset>

      {/* D. Parental consent */}
      {form.minor && (
        <fieldset className="m-0 flex flex-col gap-3.5 rounded-md border border-accent/35 bg-accent/[0.08] p-6">
          <Legend letter="D">Parental consent</Legend>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
            <Field id={`${id}-gname`} label="Parent / guardian name *">
              <input id={`${id}-gname`} type="text" value={form.guardianName} onChange={set("guardianName")} className={`${inputClass} bg-ink`} />
            </Field>
            <div className="lg:col-span-2">
              <SignaturePad key={`g${padKey}`} label="Parent / guardian signature *" onChange={setGuardianSignature} compact />
            </div>
          </div>
        </fieldset>
      )}

      {/* Agree + submit */}
      <div className="flex flex-col justify-between gap-6 border-t border-[#23261e] pt-7 lg:flex-row lg:items-center lg:gap-8">
        <label className="flex max-w-[620px] cursor-pointer items-start gap-3 text-base leading-normal">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={() => setForm((f) => ({ ...f, agree: !f.agree }))}
            className="mt-0.5 size-5 shrink-0 accent-accent"
          />
          <span>I have read this waiver, understand it, and agree to its terms and the TAAGS field rules. *</span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <span className="text-sm text-muted sm:text-right" aria-live="polite">
            {missing.length ? `Still needed: ${missing.join(", ")}` : "Ready to submit"}
          </span>
          <button
            type="submit"
            disabled={missing.length > 0 || saving}
            className="h-14 shrink-0 cursor-pointer rounded bg-accent px-[30px] font-display text-xl font-extrabold uppercase tracking-widest text-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-[#7d7b6c]"
          >
            {saving ? "Saving…" : "Sign & submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Legend({ letter, children }: { letter: string; children: React.ReactNode }) {
  return (
    <legend className="mb-3.5 flex items-center gap-3 p-0 font-display text-[22px] font-extrabold uppercase tracking-[0.04em]">
      <span className="font-mono text-xs text-accent">{letter}</span>
      {children}
    </legend>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

/** A drawing pad for signatures. Reports a PNG data URL after each stroke, or null when cleared. */
function SignaturePad({ label, onChange, compact = false }: { label: string; onChange: (dataUrl: string | null) => void; compact?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const labelId = useId();

  function point(e: PointerEvent<HTMLCanvasElement>) {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
  }

  function down(e: PointerEvent<HTMLCanvasElement>) {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ece8dc";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    if (canvas.current) onChange(canvas.current.toDataURL("image/png"));
  }

  function clear() {
    const c = canvas.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span id={labelId} className={labelClass}>
          {label}
        </span>
        <button type="button" onClick={clear} className="h-8 cursor-pointer px-2 font-mono text-[11px] uppercase tracking-[0.1em] text-sand underline">
          Clear
        </button>
      </div>
      <div className="relative">
        <canvas
          ref={canvas}
          role="img"
          aria-labelledby={labelId}
          width={1600}
          height={compact ? 260 : 300}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className={`block w-full cursor-crosshair touch-none rounded border border-line-soft bg-panel ${compact ? "h-[130px]" : "h-[150px]"}`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute right-6 bottom-[34px] left-6 h-px bg-[#3a3e32]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-10 left-6 text-lg text-[#5d6150]">
          ✕
        </span>
      </div>
    </div>
  );
}
