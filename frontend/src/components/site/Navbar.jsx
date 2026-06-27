import React, { useEffect, useState } from "react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Studio", href: "#how-it-works" },
  { label: "Services", href: "#features" },
  { label: "Industries", href: "#industries" },
  { label: "FAQ", href: "#faq" },
];

export const Navbar = ({ settings = {} }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logo = settings.logo_url ||
    "https://customer-assets.emergentagent.com/job_ai-plugin-builder-1/artifacts/mermnicj_Plugiins%20.png";

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/70 border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="Plugiins"
            className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-6"
          />
          <span className="font-display font-semibold text-[17px] tracking-tight">
            <span className="text-[#1ea7ff]">plug</span>
            <span className="text-[#FF5F15]">iins</span>
            <span className="text-[#FF5F15]">.</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="nav-link text-[13px] font-body text-zinc-400 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#cta"
            data-testid="nav-cta-talk"
            className="text-[13px] font-body text-zinc-300 hover:text-white transition-colors"
          >
            Talk to us
          </a>
          <a
            href="#cta"
            data-testid="nav-cta-start"
            className="btn-brand text-[13px] py-2.5 px-4"
          >
            Start a project
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          data-testid="nav-mobile-menu"
          className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-body text-zinc-300 hover:text-[#FF5F15]"
              >
                {l.label}
              </a>
            ))}
            <a href="#cta" onClick={() => setMobileOpen(false)} className="btn-brand mt-2 justify-center">
              Start a project
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
