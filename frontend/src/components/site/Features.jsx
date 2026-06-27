import React from "react";
import {
  Cpu,
  ShieldCheck,
  Stack,
  PlugsConnected,
  ChartLineUp,
  GitBranch,
  Lock,
  Globe,
} from "@phosphor-icons/react";

export const Features = () => {
  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative py-28 lg:py-36 bg-[#050505] border-y border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="label-mono">/ Capabilities</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              An engineering team in a single platform.
            </h2>
          </div>
          <p className="max-w-md font-body text-zinc-400 text-sm leading-relaxed">
            Plugiins ships with every primitive a serious product needs —
            architecture, security, observability and a multi-model AI core.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-px bg-white/[0.06] border border-white/[0.06]">
          {/* Large primary card */}
          <div
            data-testid="feature-blueprint"
            className="md:col-span-4 md:row-span-2 bg-[#0a0a0a] p-10 lg:p-12 relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] opacity-20 group-hover:opacity-30 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1708457753320-02e52a276a80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 max-w-lg">
              <Cpu size={32} weight="duotone" className="text-[#FF5F15]" />
              <h3 className="font-display text-3xl text-white mt-6 tracking-tight">
                AI Blueprint Engine
              </h3>
              <p className="font-body text-zinc-400 mt-3 leading-relaxed">
                A multi-agent reasoning core decomposes your idea into
                data models, services, screens and integration contracts. It
                then writes production code across React, FastAPI and
                MongoDB — and keeps it consistent as you iterate.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Claude Sonnet 4.5",
                  "GPT 5.2",
                  "Gemini 3 Pro",
                  "Llama 4",
                ].map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] tracking-[0.12em] uppercase text-zinc-400 border border-white/10 px-2.5 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Smaller cards */}
          {[
            {
              icon: ShieldCheck,
              title: "Security baked in",
              desc: "SOC-2 ready scaffolds, secret rotation, encrypted at rest and in transit. Zero-trust by default.",
              testid: "feature-security",
            },
            {
              icon: Stack,
              title: "Composable stacks",
              desc: "React, Next, FastAPI, Node, MongoDB, Postgres — choose your foundation, we wire the glue.",
              testid: "feature-stacks",
            },
            {
              icon: PlugsConnected,
              title: "150+ integrations",
              desc: "Stripe, Twilio, Resend, Slack, OAuth providers — pre-connected and one-click to enable.",
              testid: "feature-integrations",
            },
            {
              icon: ChartLineUp,
              title: "Built to scale",
              desc: "Auto-scaling infra, observability dashboards, and SLAs that match enterprise workloads.",
              testid: "feature-scale",
            },
            {
              icon: GitBranch,
              title: "Own your source",
              desc: "Export the entire codebase to GitHub or self-host. No lock-in, no proprietary runtime.",
              testid: "feature-source",
            },
            {
              icon: Lock,
              title: "Role-based access",
              desc: "Granular permissions across workspaces, environments and deployments out of the box.",
              testid: "feature-rbac",
            },
            {
              icon: Globe,
              title: "Edge by default",
              desc: "Global CDN, regional databases and low-latency rendering — every project, every plan.",
              testid: "feature-edge",
            },
          ].map((f) => {
            const Ico = f.icon;
            return (
              <div
                key={f.title}
                data-testid={f.testid}
                className="md:col-span-2 bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors group"
              >
                <Ico
                  size={26}
                  weight="duotone"
                  className="text-zinc-500 group-hover:text-[#FF5F15] transition-colors"
                />
                <h3 className="font-display text-lg text-white mt-5 tracking-tight">
                  {f.title}
                </h3>
                <p className="font-body text-[13px] text-zinc-400 mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
