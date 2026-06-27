import React from "react";
import { ArrowRight, Lightning, Sparkle } from "@phosphor-icons/react";

export const Hero = ({ hero = {}, settings = {} }) => {
  const stats = hero.stats || [];
  const bg = settings.hero_background_url ||
    "https://images.unsplash.com/photo-1489648022186-8f49310909a0";
  const logo = settings.logo_url ||
    "https://customer-assets.emergentagent.com/job_ai-plugin-builder-1/artifacts/mermnicj_Plugiins%20.png";

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <img src={bg} alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#030303]" />
        <div className="absolute inset-0 tech-grid opacity-[0.35]" />
        <div className="absolute -top-40 left-1/4 -translate-x-1/2 w-[700px] h-[700px] radial-glow blur-3xl" />
        <div
          className="absolute top-20 right-0 w-[520px] h-[520px] blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, rgba(30,167,255,0.18) 0%, transparent 60%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-7 fade-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF5F15] opacity-75 pulse-dot" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5F15]" />
              </span>
              <span className="label-mono">{hero.eyebrow || "/ Software Solutions Studio"}</span>
            </div>

            <h1
              data-testid="hero-headline"
              className="font-display font-semibold text-white text-5xl sm:text-6xl lg:text-[88px] leading-[0.95] tracking-tighter fade-up"
            >
              {hero.headline_a || "We turn your"}
              <br />
              {hero.headline_b || "business idea"}{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#FF5F15] via-[#FFD700] to-[#1ea7ff] bg-clip-text text-transparent">
                  {hero.headline_highlight || "into shipping software"}
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 75 0 150 5 T 300 5" stroke="#FF5F15" strokeWidth="1.5" fill="none" opacity="0.6" />
                </svg>
              </span>
              {hero.headline_c || "."}
            </h1>

            <p
              data-testid="hero-subtext"
              className="mt-8 max-w-2xl font-body text-base sm:text-lg text-zinc-400 leading-relaxed fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              {hero.subtext}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 fade-up" style={{ animationDelay: "0.2s" }}>
              <a href="#cta" data-testid="hero-cta-primary" className="btn-brand">
                {hero.primary_cta || "Start a project"}
                <ArrowRight size={16} weight="bold" />
              </a>
              <a href="#how-it-works" data-testid="hero-cta-secondary" className="btn-ghost">
                <Lightning size={16} weight="duotone" />
                {hero.secondary_cta || "See our process"}
              </a>
            </div>

            {stats.length > 0 && (
              <div className="mt-14 grid grid-cols-3 gap-6 sm:gap-10 max-w-xl">
                {stats.map((s, i) => (
                  <div key={i} className="border-l border-white/10 pl-4">
                    <div className="font-display text-2xl sm:text-3xl text-white font-medium">{s.value}</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 relative">
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="absolute -top-16 -right-6 w-40 h-40 object-contain opacity-30 blur-[1px] pointer-events-none select-none rotate-12"
            />
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
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">plg.studio</span>
              </div>

              <div className="font-mono text-[12px] leading-relaxed text-zinc-400 space-y-1.5">
                <p><span className="text-[#FF5F15]">$</span> plg new-project</p>
                <p className="text-white">&gt; &quot;Logistics dashboard for SMBs&quot;</p>
                <p className="text-zinc-500">· discovery call .......... <span className="text-[#FFD700]">done</span></p>
                <p className="text-zinc-500">· solution architecture ... <span className="text-[#FFD700]">done</span></p>
                <p className="text-zinc-500">· sprint 01 .............. <span className="text-[#FFD700]">done</span></p>
                <p className="text-zinc-500">· client review ........... <span className="text-[#FFD700]">done</span></p>
                <p className="text-zinc-500">
                  · production deploy .....{" "}
                  <span className="text-[#FF5F15] inline-flex items-center gap-1">
                    live <Sparkle size={11} weight="fill" />
                  </span>
                </p>
                <p className="pt-3 text-white">→ app.client.com/lgst-7f3a</p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Delivery</div>
                  <div className="font-display text-xl text-white">11 days</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Client NPS</div>
                  <div className="font-display text-xl text-[#FF5F15]">+72</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
