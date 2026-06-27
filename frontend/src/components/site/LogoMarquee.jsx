import React from "react";

export const LogoMarquee = ({ logos = [] }) => {
  const items = [...logos, ...logos];
  return (
    <section
      data-testid="logo-marquee"
      className="border-y border-white/[0.05] bg-[#060606] py-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 flex items-center justify-between">
        <span className="label-mono">/ Trusted by founders &amp; teams</span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600">
          Across 38 countries
        </span>
      </div>
      <div className="relative">
        <div className="marquee-track flex gap-16 whitespace-nowrap w-max">
          {items.map((label, i) => (
            <span
              key={i}
              className="font-display font-medium text-2xl text-zinc-600 hover:text-white transition-colors duration-300 tracking-tight"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#060606] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#060606] to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
