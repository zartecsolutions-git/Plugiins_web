import React from "react";
import { ArrowRight, Sparkle, Lightning } from "@phosphor-icons/react";

export const Hero = () => {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1489648022186-8f49310909a0"
          alt="Orange digital streaks"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#030303]" />
        <div className="absolute inset-0 tech-grid opacity-[0.35]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] radial-glow blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* Left: Headline */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-7 fade-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF5F15] opacity-75 pulse-dot" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5F15]" />
              </span>
              <span className="label-mono">
                / AI Studio · v3.1 — Now in public beta
              </span>
            </div>

            <h1
              data-testid="hero-headline"
              className="font-display font-semibold text-white text-5xl sm:text-6xl lg:text-[88px] leading-[0.95] tracking-tighter fade-up"
            >
              Turn any idea<br />
              into a shipping app{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#FF5F15] via-[#FF7A3D] to-[#FFD700] bg-clip-text text-transparent">
                  in minutes
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="10"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 75 0 150 5 T 300 5"
                    stroke="#FF5F15"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              </span>
              .
            </h1>

            <p
              data-testid="hero-subtext"
              className="mt-8 max-w-2xl font-body text-base sm:text-lg text-zinc-400 leading-relaxed fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Plugiins is the AI-native delivery studio for every kind of
              business. Describe a problem — we architect, build and deploy a
              tailored product across web, mobile and integrations. No
              boilerplate. No bottlenecks.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-4 fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <a href="#cta" data-testid="hero-cta-primary" className="btn-brand">
                Start your build
                <ArrowRight size={16} weight="bold" />
              </a>
              <a href="#how-it-works" data-testid="hero-cta-secondary" className="btn-ghost">
                <Lightning size={16} weight="duotone" />
                See how it works
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-14 grid grid-cols-3 gap-6 sm:gap-10 max-w-xl">
              {[
                { v: "12k+", l: "Apps shipped" },
                { v: "48hr", l: "Avg. delivery" },
                { v: "99.9%", l: "Uptime SLA" },
              ].map((s) => (
                <div key={s.l} className="border-l border-white/10 pl-4">
                  <div className="font-display text-2xl sm:text-3xl text-white font-medium">
                    {s.v}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mini console card */}
          <div className="lg:col-span-4">
            <div
              data-testid="hero-console"
              className="plg-card p-6 lg:p-7 relative fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F15]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  plg.console
                </span>
              </div>

              <div className="font-mono text-[12px] leading-relaxed text-zinc-400 space-y-1.5">
                <p>
                  <span className="text-[#FF5F15]">$</span> plg create
                  --idea
                </p>
                <p className="text-white">
                  &gt; &quot;A logistics dashboard for SMBs&quot;
                </p>
                <p className="text-zinc-500">
                  · parsing intent ........... <span className="text-[#FFD700]">ok</span>
                </p>
                <p className="text-zinc-500">
                  · architecting stack ....... <span className="text-[#FFD700]">ok</span>
                </p>
                <p className="text-zinc-500">
                  · generating UI ............ <span className="text-[#FFD700]">ok</span>
                </p>
                <p className="text-zinc-500">
                  · wiring integrations ...... <span className="text-[#FFD700]">ok</span>
                </p>
                <p className="text-zinc-500">
                  · deploying preview ........{" "}
                  <span className="text-[#FF5F15] inline-flex items-center gap-1">
                    live
                    <Sparkle size={11} weight="fill" />
                  </span>
                </p>
                <p className="pt-3 text-white">
                  → app.plugiins.com/p/lgst-7f3a
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                    Build time
                  </div>
                  <div className="font-display text-xl text-white">
                    00:04:21
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                    Confidence
                  </div>
                  <div className="font-display text-xl text-[#FF5F15]">
                    98.4%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
