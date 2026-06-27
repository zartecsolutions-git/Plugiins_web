import React from "react";
import { Quotes } from "@phosphor-icons/react";

export const Testimonials = ({ testimonials = {} }) => {
  const items = testimonials.items || [];
  const stats = testimonials.stats || [];
  return (
    <section data-testid="testimonials-section" className="py-28 lg:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-6">
            <span className="label-mono">{testimonials.eyebrow || "/ Field reports"}</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              {testimonials.title}
            </h2>
          </div>
          {stats.length > 0 && (
            <div className="lg:col-span-5 lg:col-start-8 self-end">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="border-l border-[#FF5F15]/40 pl-4">
                    <div className="font-display text-3xl text-white tracking-tight">{s.value}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-2">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <figure key={i} data-testid={`testimonial-${i}`} className="plg-card p-8 lg:p-10 flex flex-col">
              <Quotes size={28} weight="fill" className="text-[#FF5F15] mb-6" />
              <blockquote className="font-display text-[18px] leading-[1.5] text-white tracking-tight flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 pt-5 border-t border-white/[0.06]">
                <div className="font-body font-medium text-sm text-white">{t.author}</div>
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
