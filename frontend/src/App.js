import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

import { SEO } from "@/components/seo/SEO";
import { ROUTES_SEO, SITE } from "@/lib/seo";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Features } from "@/components/site/Features";
import { Industries } from "@/components/site/Industries";
import { Pricing } from "@/components/site/Pricing";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: SITE.ogImage,
  description: SITE.defaultDescription,
  sameAs: [
    "https://twitter.com/plugiins",
    "https://www.linkedin.com/company/plugiins",
    "https://github.com/plugiins",
  ],
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Plugiins",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "29",
    highPrice: "Custom",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "184",
  },
};

const Landing = () => {
  return (
    <>
      <SEO
        title={ROUTES_SEO.home.title}
        description={ROUTES_SEO.home.description}
        path={ROUTES_SEO.home.path}
        jsonLd={[homeJsonLd, softwareJsonLd]}
      />
      <div data-testid="landing-page" className="grain relative">
        <Navbar />
        <main>
          <Hero />
          <LogoMarquee />
          <HowItWorks />
          <Features />
          <Industries />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

const NotFound = () => (
  <>
    <SEO
      title="404 — Page not found · Plugiins"
      description="The page you're looking for doesn't exist."
      path="/404"
      noindex
    />
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <span className="label-mono">/ Error 404</span>
      <h1 className="font-display text-5xl sm:text-7xl text-white mt-4 tracking-tighter">
        Lost in transit.
      </h1>
      <p className="font-body text-zinc-400 mt-4 max-w-md">
        The route you requested doesn&apos;t exist. Head back to the home page
        and we&apos;ll get you building.
      </p>
      <a href="/" className="btn-brand mt-8" data-testid="404-home-link">
        Back to home
      </a>
    </div>
  </>
);

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </HelmetProvider>
  );
}

export default App;
