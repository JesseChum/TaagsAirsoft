"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/buttons";
import { site } from "@/lib/site";

const topics = ["General question", "Game days & events", "Rentals", "Partnerships", "Other"];

const empty = { name: "", email: "", phone: "", topic: topics[0], message: "" };

const inputClass =
  "w-full rounded border border-line-soft bg-ink px-4 text-[17px] text-bone placeholder:text-muted/70 [color-scheme:dark]";
const labelClass = "font-mono text-[11px] uppercase tracking-[0.1em] text-muted";

// There is no email backend yet, so sending opens the visitor's email app with
// the message filled in. To send from the site instead (e.g. with Resend), swap
// this for a server action and keep the form as is.
function openEmail(form: typeof empty) {
  const subject = `${form.topic} · ${form.name}`;
  const signature = [form.name, form.email, form.phone].filter(Boolean).join("\n");
  const body = `${form.message.trim()}\n\n—\n${signature}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactButton({ children = "Send a Message" }: { children?: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);
  const id = useId();

  const set = (key: keyof typeof empty) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function open() {
    setSent(false);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    openEmail(form);
    setSent(true);
  }

  return (
    <>
      <button type="button" onClick={open} className={buttonClasses()}>
        {children}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        onClick={(e) => {
          // Clicking the dimmed backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[min(640px,calc(100%-2rem))] max-h-[calc(100%-2rem)] overflow-y-auto rounded-lg border border-line-soft bg-panel p-0 text-bone shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(6,7,5,0.78)]"
      >
        <div className="flex flex-col gap-7 px-5 pt-7 pb-8 md:px-9 md:pt-8 md:pb-9">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 id={`${id}-title`} className="m-0 font-display text-4xl font-black uppercase leading-[0.95] text-white md:text-[44px]">
                {sent ? "Almost done" : "Send a message"}
              </h2>
              <p className="m-0 text-base leading-relaxed text-bone-dim">
                {sent ? "Your email app should now be open with your message ready. Hit send there to reach us." : "Questions about game days, rentals or anything else? We'll get back to you by email."}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded border border-line-soft bg-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col gap-5">
              <p className="m-0 text-base leading-relaxed text-sand">
                Nothing opened? Email us directly at{" "}
                <a href={`mailto:${site.email}`} className="text-bone underline">
                  {site.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="text-bone underline">
                  {site.phone}
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setForm(empty);
                    close();
                  }}
                  className={buttonClasses()}
                >
                  Done
                </button>
                <button type="button" onClick={() => setSent(false)} className={buttonClasses("outline")}>
                  Edit message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field id={`${id}-name`} label="Name *">
                  <input id={`${id}-name`} required type="text" autoComplete="name" value={form.name} onChange={set("name")} className={`${inputClass} h-[52px]`} />
                </Field>
                <Field id={`${id}-email`} label="Email *">
                  <input id={`${id}-email`} required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={`${inputClass} h-[52px]`} />
                </Field>
                <Field id={`${id}-phone`} label="Phone (optional)">
                  <input id={`${id}-phone`} type="tel" autoComplete="tel" placeholder="(000) 000-0000" value={form.phone} onChange={set("phone")} className={`${inputClass} h-[52px]`} />
                </Field>
                <Field id={`${id}-topic`} label="Topic">
                  <select id={`${id}-topic`} value={form.topic} onChange={set("topic")} className={`${inputClass} h-[52px]`}>
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field id={`${id}-message`} label="Message *">
                <textarea id={`${id}-message`} required rows={5} value={form.message} onChange={set("message")} className={`${inputClass} resize-y py-3 leading-relaxed`} />
              </Field>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <span className="text-sm text-muted">Opens your email app with this message filled in.</span>
                <button type="submit" className={buttonClasses()}>
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
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
