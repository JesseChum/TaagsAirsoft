"use client";

import { useState } from "react";
import { CashIcon, QrCode } from "@/components/qr-code";
import { formatMoney, qrMethods, shopCategories, type Product } from "@/lib/shop";

type Cart = Record<string, number>;
const allProducts: Product[] = shopCategories.flatMap((c) => c.items);
const payOptions = [...qrMethods.map((m) => ({ id: m.id, name: m.name })), { id: "cash", name: "Cash" }];

export function ShopBrowser() {
  const [tab, setTab] = useState("all");
  const [cart, setCart] = useState<Cart>({});
  const [methodId, setMethodId] = useState(qrMethods[0].id);

  function setQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  const tabs = [{ id: "all", label: "All" }, ...shopCategories.map((c) => ({ id: c.id, label: c.label }))];
  const groups = shopCategories.filter((c) => tab === "all" || tab === c.id);

  const lines = allProducts.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const total = lines.reduce((sum, l) => sum + (l.price ?? 0) * l.qty, 0);
  const hasUnpriced = lines.some((l) => l.price === null);
  const isCash = methodId === "cash";
  const method = qrMethods.find((m) => m.id === methodId) ?? qrMethods[0];

  return (
    <section className="flex flex-col items-start gap-10 px-4 pt-12 pb-24 md:px-16 lg:flex-row">
      {/* Products */}
      <div className="flex w-full min-w-0 grow flex-col gap-10">
        <div role="group" aria-label="Filter products" className="flex flex-wrap gap-1 self-start rounded-md border border-line bg-panel p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`h-11 cursor-pointer rounded px-[18px] font-display text-[17px] font-extrabold uppercase tracking-[0.08em] ${
                tab === t.id ? "bg-accent text-ink" : "text-bone"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {groups.map((g) => (
          <div key={g.id} className="flex flex-col gap-4.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-accent pb-3">
              <h2 className="m-0 font-display text-[40px] font-black uppercase">{g.label}</h2>
              <span className="text-[15px] text-muted">{g.note}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((item) => (
                <ProductCard key={item.id} item={item} qty={cart[item.id] ?? 0} onQty={(q) => setQty(item.id, q)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <aside aria-label="Your order" className="flex w-full shrink-0 flex-col gap-5.5 rounded-md border border-line bg-panel p-7 lg:sticky lg:top-6 lg:w-[400px]">
        <div className="flex items-baseline justify-between">
          <h2 className="m-0 font-display text-[34px] font-black uppercase">Your order</h2>
          {lines.length > 0 && (
            <button type="button" onClick={() => setCart({})} className="h-8 cursor-pointer px-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-sand underline">
              Clear
            </button>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="rounded border border-dashed border-line-soft px-4 py-7 text-center text-[15px] text-muted">
            Nothing here yet. Tap + on an item to add it.
          </div>
        ) : (
          <>
            <ul className="m-0 flex list-none flex-col p-0">
              {lines.map((l) => (
                <li key={l.id} className="flex justify-between gap-3 border-b border-[#23261e] py-3 text-base">
                  <span>
                    <span className="font-mono text-accent">{l.qty}×</span> {l.name}
                  </span>
                  <span className="font-mono">{l.price === null ? "[PRICE]" : formatMoney(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between" aria-live="polite">
              <span className="font-mono text-xs tracking-[0.12em] text-muted">TOTAL</span>
              <span className="font-display text-[44px] font-black leading-none text-white">{formatMoney(total)}</span>
            </div>
            {hasUnpriced && <span className="text-[13px] text-muted">Some items don&apos;t have a price yet and aren&apos;t in the total.</span>}
          </>
        )}

        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <span className="font-mono text-xs tracking-[0.12em] text-muted">PAY WITH</span>
          <div role="group" aria-label="Payment method" className="grid grid-cols-2 gap-1.5">
            {payOptions.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={methodId === m.id}
                onClick={() => setMethodId(m.id)}
                className={`h-11 cursor-pointer rounded border font-display text-[17px] font-extrabold uppercase tracking-[0.06em] ${
                  m.id === "cash" ? "col-span-2" : ""
                } ${methodId === m.id ? "border-accent bg-accent text-ink" : "border-line-soft bg-ink text-bone"}`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {isCash ? (
            <>
              <div className="flex flex-col items-center gap-3.5 rounded-md border border-line-soft bg-ink px-5 py-7 text-center">
                <span className="flex size-[72px] items-center justify-center rounded-full border border-accent/40 bg-accent/[0.12] text-accent">
                  <CashIcon size={34} />
                </span>
                <span className="font-display text-2xl font-extrabold uppercase">Pay cash at the front</span>
                <span className="text-[15px] leading-normal text-sand">Cash is paid in person at the front desk when you check in.</span>
              </div>
              <p className="m-0 text-[15px] leading-normal text-bone-dim">
                Bring <strong className="text-white">{formatMoney(total)}</strong> in cash and pay at the front when you arrive. Tell them it&apos;s for your
                shop order.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 rounded-md border border-line-soft bg-ink p-5">
                <QrCode method={method} size={200} />
                <span className="font-display text-[22px] font-extrabold uppercase">
                  {method.name} · <span className="font-mono text-[15px] font-medium normal-case text-sand">{method.handle}</span>
                </span>
              </div>
              <p className="m-0 text-[15px] leading-normal text-bone-dim">
                Send <strong className="text-white">{formatMoney(total)}</strong> and put <strong className="text-white">your name + &quot;TAAGS&quot;</strong>{" "}
                in the payment note. Show the payment screen at check-in.
              </p>
            </>
          )}
        </div>
      </aside>
    </section>
  );
}

function ProductCard({ item, qty, onQty }: { item: Product; qty: number; onQty: (qty: number) => void }) {
  return (
    <div
      className={`flex min-h-[200px] flex-col justify-between gap-4.5 rounded-md border bg-panel p-5.5 ${qty > 0 ? "border-accent" : "border-line"}`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="font-display text-2xl font-extrabold uppercase leading-[1.05] text-white">{item.name}</span>
        <span className="text-[15px] leading-snug text-sand">{item.desc}</span>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-3.5">
        <span className="font-display text-[30px] font-black text-accent">{item.price === null ? "[PRICE]" : formatMoney(item.price)}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Remove one ${item.name}`}
            onClick={() => onQty(qty - 1)}
            disabled={qty === 0}
            className="flex size-10 cursor-pointer items-center justify-center rounded border border-line-soft bg-ink text-xl leading-none disabled:cursor-default disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-8 text-center font-mono text-base" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label={`Add one ${item.name}`}
            onClick={() => onQty(qty + 1)}
            className="flex size-10 cursor-pointer items-center justify-center rounded bg-accent text-xl leading-none text-ink"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
