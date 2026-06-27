import React, { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";

const QA = [
  {
    q: "Do I need to know how to code to use plugiins?",
    a: "No. Plugiins is designed for both technical and non-technical builders. You describe the outcome you want and our AI handles the architecture, code, and deployment. Engineers can drop into the source any time to extend.",
  },
  {
    q: "Which AI models power the platform?",
    a: "We route between Claude Sonnet 4.5, GPT 5.2, Gemini 3 Pro and a few specialist open-weights models based on the task — code synthesis, planning, image generation, or evals. The right model for the right step.",
  },
  {
    q: "Can I export the code my project generates?",
    a: "Always. Every workspace includes one-click export to a GitHub repository. You own the code, the database schema and the deployment artifacts. No proprietary runtime.",
  },
  {
    q: "Is plugiins safe for regulated industries?",
    a: "Yes. We support SOC-2 reporting, granular RBAC, audit logs, regional data residency and private model deployments for healthcare, fintech and public-sector workloads.",
  },
  {
    q: "How is pricing calculated?",
    a: "All plans include the full AI core. You're charged on a flat monthly subscription that scales with workspaces and infrastructure usage. Annual billing saves 20%.",
  },
  {
    q: "Do you support custom integrations?",
    a: "Out of the box we ship 150+ integrations. Custom APIs, internal services and legacy systems can be wired in via our connector SDK — or our team can build it for you on Enterprise plans.",
  },
];

export const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" data-testid="faq-section" className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="label-mono">/ FAQ</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              Questions, answered.
            </h2>
            <p className="font-body text-sm text-zinc-400 mt-5 leading-relaxed">
              Still curious? Drop us a note — a solutions engineer (not a
              chatbot) will reply within one business day.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-white/[0.06]">
              {QA.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={i}
                    data-testid={`faq-item-${i}`}
                    className="border-b border-white/[0.06]"
                  >
                    <button
                      data-testid={`faq-toggle-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between text-left py-6 group"
                    >
                      <span className="font-display text-lg sm:text-xl text-white tracking-tight pr-8 group-hover:text-[#FF5F15] transition-colors">
                        {item.q}
                      </span>
                      <span className="flex-shrink-0 w-9 h-9 border border-white/10 flex items-center justify-center group-hover:border-[#FF5F15]/40 transition-colors">
                        {isOpen ? (
                          <Minus size={14} className="text-[#FF5F15]" />
                        ) : (
                          <Plus size={14} className="text-zinc-400 group-hover:text-[#FF5F15]" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-6 pr-12 font-body text-sm text-zinc-400 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
