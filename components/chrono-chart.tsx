"use client";

import { useState } from "react";
import { bbWeights, chartFps, chronoLimits, joules, maxFps } from "@/lib/field";

const tones = {
  ok: "bg-[#2e3d22] text-[#d3e6bd]",
  bolt: "bg-[#4a3f1c] text-[#f0dc9c]",
  over: "bg-[#3a1915] text-[#e7a297]",
};

function tone(j: number) {
  if (j <= chronoLimits.aeg) return tones.ok;
  if (j <= chronoLimits.bolt) return tones.bolt;
  return tones.over;
}

export function ChronoChart() {
  const [selected, setSelected] = useState(0);
  const grams = bbWeights[selected];

  return (
    <div className="flex flex-col gap-10">
      {/* Quick check */}
      <div className="flex flex-col justify-between gap-6 rounded-md border border-accent/35 bg-ink p-6 lg:flex-row lg:items-center lg:gap-8 lg:px-7">
        <div className="flex flex-col gap-3">
          <span className="font-display text-2xl font-extrabold uppercase">Quick check: what BB weight do you use?</span>
          <div role="group" aria-label="BB weight" className="flex flex-wrap gap-1.5">
            {bbWeights.map((g, i) => (
              <button
                key={g}
                type="button"
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
                className={`h-11 min-w-16 cursor-pointer rounded border px-2.5 font-mono text-sm ${
                  i === selected ? "border-accent bg-accent text-ink" : "border-line-soft bg-panel text-bone"
                }`}
              >
                {g.toFixed(2)}g
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-10" aria-live="polite">
          {[
            { label: "AEG / semi max", value: maxFps(chronoLimits.aeg, grams) },
            { label: "Bolt / pump max", value: maxFps(chronoLimits.bolt, grams) },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{stat.label}</span>
              <span className="font-display text-5xl font-black leading-none text-white">
                {stat.value} <span className="text-xl text-sand">FPS</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <h3 className="m-0 font-display text-[28px] font-extrabold uppercase">Joules by FPS and BB weight</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-sand">
            <span className="flex items-center gap-2"><span className="size-4 rounded-[3px] border border-[#5d7a3e] bg-[#2e3d22]" />Legal for all ({chronoLimits.aeg.toFixed(1)} J or less)</span>
            <span className="flex items-center gap-2"><span className="size-4 rounded-[3px] border border-[#9c8330] bg-[#4a3f1c]" />Bolt / pump only (up to {chronoLimits.bolt.toFixed(1)} J)</span>
            <span className="flex items-center gap-2"><span className="size-4 rounded-[3px] border border-[#a3443a] bg-[#4a1f1a]" />Over the limit</span>
          </div>
        </div>
        <div className="overflow-x-auto rounded-md border border-line-soft">
          <table className="w-full min-w-[760px] border-collapse font-mono text-[13px]">
            <caption className="sr-only">Muzzle energy in joules for each FPS reading and BB weight</caption>
            <thead>
              <tr className="bg-ink-deep">
                <th scope="col" className="h-11 w-[120px] pl-4 text-left text-xs font-medium tracking-[0.1em] text-muted">FPS ↓ · BB →</th>
                {bbWeights.map((g, i) => (
                  <th key={g} scope="col" className={`h-11 font-medium ${i === selected ? "bg-accent/20 text-white" : "text-sand"}`}>
                    {g.toFixed(2)}g
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartFps.map((fps) => (
                <tr key={fps} className="border-t border-[#1d2018]">
                  <th scope="row" className="h-8 bg-ink pl-4 text-left font-medium text-white">{fps}</th>
                  {bbWeights.map((g, i) => {
                    const j = joules(fps, g);
                    return (
                      <td
                        key={g}
                        className={`h-8 border-l border-ink text-center ${tone(j)} ${
                          i === selected ? "font-semibold shadow-[inset_2px_0_0_var(--color-accent),inset_-2px_0_0_var(--color-accent)]" : ""
                        }`}
                      >
                        {j.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
