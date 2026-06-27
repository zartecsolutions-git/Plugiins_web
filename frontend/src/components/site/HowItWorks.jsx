import React from "react";
import {
  ChatCircleDots,
  Brain,
  PaintBrush,
  RocketLaunch,
} from "@phosphor-icons/react";

const STEPS = [
  {
    n: "01",
    icon: ChatCircleDots,
    title: "Describe the idea",
    desc: "Open a conversation. Tell our agent what your business needs to ship — a feature, a product, or an end-to-end solution.",
  },
  {
    n: "02",
    icon: Brain,
    title: "AI architects the blueprint",
    desc: "Plugiins maps user flows, picks the right stack, scaffolds the database, and proposes an interface — in a single pass.",
  },
  {
    n: "03",
    icon: PaintBrush,
    title: "Refine in the studio",
    desc: "Tweak copy, swap components, plug in integrations and brand the experience. Every change is reflected in real-time.",
  },
  {
    n: "04",
    icon: RocketLaunch,
    title: "Ship to production",
    desc: "Push to a managed cloud or export the source. Monitoring, scaling and CI/CD are wired up the moment you deploy.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <span className="label-mono">/ The flow</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              Four steps between a&nbsp;napkin sketch and a live product.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="font-body text-zinc-400 leading-relaxed">
              Plugiins compresses months of discovery, design, engineering and
              DevOps into a single, collaborative session — without giving up
              the rigor your business demands.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/[0.06]">
          {STEPS.map((s, i) => {
            const Ico = s.icon;
            return (
              <div
                key={s.n}
                data-testid={`step-${s.n}`}
                className={`p-8 lg:p-10 group transition-colors duration-300 hover:bg-[#0c0c0c] ${
                  i < STEPS.length - 1 ? "lg:border-r border-white/[0.06]" : ""
                } ${
                  i < 2 ? "md:border-r md:border-b lg:border-b-0" : ""
                } ${i >= 2 ? "md:border-b-0" : ""} border-b md:border-b-0`}
              >
                <div className="flex items-start justify-between mb-10">
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#FF5F15]">
                    {s.n}
                  </span>
                  <Ico
                    size={28}
                    weight="duotone"
                    className="text-zinc-500 group-hover:text-[#FF5F15] transition-colors"
                  />
                </div>
                <h3 className="font-display text-2xl text-white tracking-tight mb-3">
                  {s.title}
                </h3>
                <p className="font-body text-sm text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
