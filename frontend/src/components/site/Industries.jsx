import React from "react";
import {
  ShoppingBagOpen,
  Heartbeat,
  Bank,
  GraduationCap,
  Buildings,
  TruckTrailer,
  AirplaneTakeoff,
  FilmSlate,
} from "@phosphor-icons/react";

const INDUSTRIES = [
  {
    icon: ShoppingBagOpen,
    title: "Commerce",
    examples: "Storefronts · loyalty · inventory · pricing engines",
  },
  {
    icon: Heartbeat,
    title: "Health & Wellness",
    examples: "Telehealth · patient portals · scheduling · EHR",
  },
  {
    icon: Bank,
    title: "Financial Services",
    examples: "Onboarding · KYC · ledgers · trading dashboards",
  },
  {
    icon: GraduationCap,
    title: "Education",
    examples: "LMS · cohort tools · AI tutors · certifications",
  },
  {
    icon: Buildings,
    title: "Real Estate",
    examples: "Listings · CRMs · virtual tours · valuation",
  },
  {
    icon: TruckTrailer,
    title: "Logistics",
    examples: "Fleet ops · tracking · routing · freight booking",
  },
  {
    icon: AirplaneTakeoff,
    title: "Travel & Hospitality",
    examples: "Booking flows · concierge · loyalty · revenue ops",
  },
  {
    icon: FilmSlate,
    title: "Media & Creators",
    examples: "Storefronts · paywalls · communities · analytics",
  },
];

export const Industries = () => {
  return (
    <section
      id="industries"
      data-testid="industries-section"
      className="py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-7">
            <span className="label-mono">/ Built for every business</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-5 leading-[1.05] tracking-tight font-medium">
              From a single founder to a Fortune 500 — plugiins ships the
              product you&apos;d hire a team of 30 to build.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p className="font-body text-sm text-zinc-400 leading-relaxed">
              Pre-trained on hundreds of vertical patterns, the AI delivers
              opinionated starting points — then bends to your exact playbook.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind) => {
            const Ico = ind.icon;
            return (
              <div
                key={ind.title}
                data-testid={`industry-${ind.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="plg-card p-6 lg:p-7"
              >
                <Ico size={26} weight="duotone" className="text-[#FF5F15]" />
                <h3 className="font-display text-lg text-white mt-5 tracking-tight">
                  {ind.title}
                </h3>
                <p className="font-body text-[12px] text-zinc-500 mt-2 leading-relaxed">
                  {ind.examples}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
