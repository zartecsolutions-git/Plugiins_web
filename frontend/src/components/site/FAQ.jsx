import React, { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";

export const FAQ = ({ faq = {} }) => {
  const items = faq.items || [];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" data-testid="faq-section" className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="label-mono">{faq.eyebrow || "/ FAQ"}</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              {faq.title}
            </h2>
            <p className="font-body text-sm text-zinc-400 mt-5 leading-relaxed">{faq.subtext}</p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-white/[0.06]">
              {items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} data-testid={`faq-item-${i}`} className="border-b border-white/[0.06]">
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
