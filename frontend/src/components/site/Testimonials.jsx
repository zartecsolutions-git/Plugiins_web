import React from "react";
import { Quotes } from "@phosphor-icons/react";

const TESTIMONIALS = [
  {
    q: "We replaced a six-month roadmap with a four-day sprint. The AI didn't just write code — it asked sharper product questions than half my PMs.",
    author: "Mira Okafor",
    role: "Head of Product · Stellar Labs",
  },
  {
    q: "Our underwriting tool was live in 11 days. Compliance review was easier because plugiins generated the audit trail by default.",
    author: "Daniel Marchetti",
    role: "CTO · Forge & Sons",
  },
  {
    q: "I'm a non-technical founder. I shipped a B2B logistics dashboard that our largest customer pays six figures for. That was unimaginable last year.",
    author: "Anya Petrov",
    role: "Founder · Hydra OS",
  },
];

const STATS = [
  { v: "94%", l: "Faster time-to-market" },
  { v: "11×", l: "Reduction in engineering hours" },
  { v: "62%", l: "Lower total cost of ownership" },
];

export const Testimonials = () => {
  return (
    <section
      data-testid="testimonials-section"
      className="py-28 lg:py-36 relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-6">
            <span className="label-mono">/ Field reports</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              Teams that swapped backlogs for shipping velocity.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 self-end">
            <div className="grid grid-cols-3 gap-6">
              {STATS.map((s) => (
                <div key={s.l} className="border-l border-[#FF5F15]/40 pl-4">
                  <div className="font-display text-3xl text-white tracking-tight">
                    {s.v}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-2">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              data-testid={`testimonial-${i}`}
              className="plg-card p-8 lg:p-10 flex flex-col"
            >
              <Quotes
                size={28}
                weight="fill"
                className="text-[#FF5F15] mb-6"
              />
              <blockquote className="font-display text-[18px] leading-[1.5] text-white tracking-tight flex-1">
                &ldquo;{t.q}&rdquo;
              </blockquote>
              <figcaption className="mt-8 pt-5 border-t border-white/[0.06]">
                <div className="font-body font-medium text-sm text-white">
                  {t.author}
                </div>
                <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.16em] mt-1">
                  {t.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
