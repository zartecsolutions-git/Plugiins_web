import React from "react";
import { XLogo, LinkedinLogo, GithubLogo, DiscordLogo } from "@phosphor-icons/react";

export const Footer = ({ footer = {}, settings = {} }) => {
  const columns = footer.columns || [];
  const logo = settings.logo_url ||
    "https://customer-assets.emergentagent.com/job_ai-plugin-builder-1/artifacts/mermnicj_Plugiins%20.png";

  return (
    <footer
      id="contact"
      data-testid="site-footer"
      className="relative border-t border-white/[0.06] bg-[#030303] pt-20 pb-10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logo} alt="Plugiins" className="h-9 w-9 object-contain" />
              <span className="font-display font-semibold text-[17px] tracking-tight text-white">
                <span className="text-[#1ea7ff]">plug</span>
                <span className="text-[#FF5F15]">iins</span>
                <span className="text-[#FF5F15]">.</span>
              </span>
            </div>
            <p className="font-body text-sm text-zinc-500 leading-relaxed max-w-xs">
              {footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: XLogo, label: "twitter" },
                { Icon: LinkedinLogo, label: "linkedin" },
                { Icon: GithubLogo, label: "github" },
                { Icon: DiscordLogo, label: "discord" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  data-testid={`footer-social-${label}`}
                  className="w-9 h-9 border border-white/[0.08] flex items-center justify-center hover:border-[#FF5F15]/50 hover:bg-[#FF5F15]/10 transition-colors"
                  aria-label={label}
                >
                  <Icon size={15} weight="bold" className="text-zinc-400" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c, ci) => (
            <div key={ci}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF5F15] mb-5">
                / {c.title}
              </h4>
              <ul className="space-y-3">
                {(c.links || []).map((l, li) => (
                  <li key={li}>
                    <a
                      href="#"
                      data-testid={`footer-link-${c.title.toLowerCase()}-${li}`}
                      className="font-body text-[13px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden border-t border-white/[0.06] pt-12 mb-10">
          <div
            data-testid="footer-wordmark"
            className="font-display font-semibold tracking-[-0.04em] leading-none select-none"
            style={{ fontSize: "clamp(64px, 16vw, 240px)" }}
          >
            <span className="text-[#1ea7ff]">plug</span>
            <span className="text-white">iins</span>
            <span className="text-[#FF5F15]">.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
            © {new Date().getFullYear()} plugiins.com · All systems operational
          </div>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Security", "Status"].map((l) => (
              <a
                key={l}
                href="#"
                data-testid={`footer-legal-${l.toLowerCase()}`}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-[#FF5F15]"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
