import React from "react";
import { Icon } from "@/lib/icons";

export const HowItWorks = ({ process = {} }) => {
  const steps = process.steps || [];
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <span className="label-mono">{process.eyebrow || "/ The process"}</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              {process.title}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="font-body text-zinc-400 leading-relaxed">{process.subtext}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/[0.06]">
          {steps.map((s, i) => (
            <div
              key={i}
              data-testid={`step-${s.n || i}`}
              className={`p-8 lg:p-10 group transition-colors duration-300 hover:bg-[#0c0c0c] ${
                i < steps.length - 1 ? "lg:border-r border-white/[0.06]" : ""
              } ${i < 2 ? "md:border-r md:border-b lg:border-b-0" : ""} ${
                i >= 2 ? "md:border-b-0" : ""
              } border-b md:border-b-0`}
            >
              <div className="flex items-start justify-between mb-10">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#FF5F15]">
                  {s.n}
                </span>
                <Icon
                  name={s.icon}
                  size={28}
                  weight="duotone"
                  className="text-zinc-500 group-hover:text-[#FF5F15] transition-colors"
                />
              </div>
              <h3 className="font-display text-2xl text-white tracking-tight mb-3">{s.title}</h3>
              <p className="font-body text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
