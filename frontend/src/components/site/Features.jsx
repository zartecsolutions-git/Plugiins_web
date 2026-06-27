import React from "react";
import { Cpu } from "@phosphor-icons/react";
import { Icon } from "@/lib/icons";

export const Features = ({ services = {}, settings = {} }) => {
  const cards = services.cards || [];
  const spotlight = services.spotlight || {};
  const bg = settings.feature_background_url ||
    "https://images.unsplash.com/photo-1708457753320-02e52a276a80";

  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative py-28 lg:py-36 bg-[#050505] border-y border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="label-mono">{services.eyebrow || "/ What we build"}</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              {services.title}
            </h2>
          </div>
          <p className="max-w-md font-body text-zinc-400 text-sm leading-relaxed">
            {services.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-px bg-white/[0.06] border border-white/[0.06]">
          <div
            data-testid="feature-spotlight"
            className="md:col-span-4 md:row-span-2 bg-[#0a0a0a] p-10 lg:p-12 relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] opacity-20 group-hover:opacity-30 transition-opacity">
              <img src={bg} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 max-w-lg">
              <Cpu size={32} weight="duotone" className="text-[#FF5F15]" />
              <h3 className="font-display text-3xl text-white mt-6 tracking-tight">
                {spotlight.title}
              </h3>
              <p className="font-body text-zinc-400 mt-3 leading-relaxed">{spotlight.desc}</p>
              {spotlight.tags && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {spotlight.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] tracking-[0.12em] uppercase text-zinc-400 border border-white/10 px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {cards.map((f, i) => (
            <div
              key={i}
              data-testid={`feature-card-${i}`}
              className="md:col-span-2 bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors group"
            >
              <Icon
                name={f.icon}
                size={26}
                weight="duotone"
                className="text-zinc-500 group-hover:text-[#FF5F15] transition-colors"
              />
              <h3 className="font-display text-lg text-white mt-5 tracking-tight">{f.title}</h3>
              <p className="font-body text-[13px] text-zinc-400 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
