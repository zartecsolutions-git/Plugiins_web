import React, { useState } from "react";
import { Check, ArrowRight } from "@phosphor-icons/react";

const PLANS = [
  {
    name: "Starter",
    tagline: "For solo founders validating an idea.",
    price: { monthly: 29, annual: 23 },
    features: [
      "1 active workspace",
      "Up to 3 AI-generated apps",
      "Community support",
      "Plugiins-hosted preview",
      "Export to GitHub",
    ],
    cta: "Start free trial",
    highlight: false,
    testid: "plan-starter",
  },
  {
    name: "Pro",
    tagline: "For teams shipping in production.",
    price: { monthly: 89, annual: 71 },
    features: [
      "5 workspaces · unlimited apps",
      "Multi-model AI (Claude · GPT · Gemini)",
      "Priority chat + 24h response",
      "Managed cloud + custom domains",
      "Stripe, Twilio, OAuth pre-built",
      "Versioning, rollbacks, audit log",
    ],
    cta: "Build with Pro",
    highlight: true,
    testid: "plan-pro",
  },
  {
    name: "Enterprise",
    tagline: "For regulated and scaled operations.",
    price: { monthly: "Custom", annual: "Custom" },
    features: [
      "Unlimited everything",
      "SSO, SCIM, SOC-2 reports",
      "Dedicated solutions engineer",
      "Self-hosted + private models",
      "99.99% uptime SLA",
      "Custom integrations + data residency",
    ],
    cta: "Talk to sales",
    highlight: false,
    testid: "plan-enterprise",
  },
];

export const Pricing = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="py-28 lg:py-36 bg-[#050505] border-y border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <span className="label-mono">/ Pricing</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              Pay for outcomes, not seats.
            </h2>
            <p className="font-body text-zinc-400 mt-5 max-w-xl leading-relaxed">
              Every plan ships with the full AI core. Scale up only when your
              business is ready.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex lg:justify-end self-end">
            <div
              data-testid="pricing-toggle"
              className="inline-flex items-center border border-white/10 p-1"
            >
              <button
                data-testid="toggle-monthly"
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 text-[12px] font-mono uppercase tracking-[0.18em] transition-colors ${
                  !annual
                    ? "bg-[#FF5F15] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                data-testid="toggle-annual"
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 text-[12px] font-mono uppercase tracking-[0.18em] transition-colors ${
                  annual
                    ? "bg-[#FF5F15] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Annual · −20%
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p) => {
            const price = annual ? p.price.annual : p.price.monthly;
            return (
              <div
                key={p.name}
                data-testid={p.testid}
                className={`relative p-8 lg:p-10 flex flex-col transition-all duration-300 ${
                  p.highlight
                    ? "bg-[#0c0c0c] border border-[#FF5F15]/40 glow-orange"
                    : "bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-8 bg-[#FF5F15] text-black font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                    Most chosen
                  </span>
                )}
                <h3 className="font-display text-2xl text-white tracking-tight">
                  {p.name}
                </h3>
                <p className="font-body text-sm text-zinc-400 mt-2 leading-relaxed">
                  {p.tagline}
                </p>

                <div className="mt-8 flex items-baseline gap-2">
                  {typeof price === "number" ? (
                    <>
                      <span className="font-display text-5xl text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                        / mo
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-5xl text-white tracking-tight">
                      {price}
                    </span>
                  )}
                </div>

                <ul className="mt-8 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-zinc-300 font-body"
                    >
                      <Check
                        size={16}
                        weight="bold"
                        className="text-[#FF5F15] mt-0.5 flex-shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  data-testid={`${p.testid}-cta`}
                  className={`mt-10 inline-flex items-center justify-center gap-2 py-3 px-5 text-[13px] font-body font-medium transition-all duration-200 ${
                    p.highlight
                      ? "btn-brand justify-center w-full"
                      : "border border-white/10 hover:border-[#FF5F15]/50 text-white hover:bg-[#FF5F15]/10 w-full"
                  }`}
                >
                  {p.cta}
                  <ArrowRight size={14} weight="bold" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
