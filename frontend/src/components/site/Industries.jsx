import React from "react";
import { Icon } from "@/lib/icons";

export const Industries = ({ industries = {} }) => {
  const items = industries.items || [];
  return (
    <section id="industries" data-testid="industries-section" className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-7">
            <span className="label-mono">{industries.eyebrow || "/ Built for every business"}</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              {industries.title}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p className="font-body text-sm text-zinc-400 leading-relaxed">{industries.subtext}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((ind, i) => (
            <div
              key={i}
              data-testid={`industry-${(ind.title || "i").toLowerCase().replace(/\s+/g, "-")}`}
              className="plg-card p-6 lg:p-7"
            >
              <Icon name={ind.icon} size={26} weight="duotone" className="text-[#FF5F15]" />
              <h3 className="font-display text-lg text-white mt-5 tracking-tight">{ind.title}</h3>
              <p className="font-body text-[12px] text-zinc-500 mt-2 leading-relaxed">{ind.examples}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
