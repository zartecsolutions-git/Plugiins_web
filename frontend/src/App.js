import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

import { SEO } from "@/components/seo/SEO";
import { ROUTES_SEO, SITE } from "@/lib/seo";
import { AuthProvider } from "@/lib/auth";
import { ContentProvider, useContent } from "@/lib/content";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Features } from "@/components/site/Features";
import { Industries } from "@/components/site/Industries";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: SITE.ogImage,
  description: SITE.defaultDescription,
};

const Landing = () => {
  const { content, loading } = useContent();

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          / loading plugiins
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={ROUTES_SEO.home.title}
        description={ROUTES_SEO.home.description}
        path={ROUTES_SEO.home.path}
        jsonLd={[homeJsonLd]}
      />
      <div data-testid="landing-page" className="grain relative">
        <Navbar settings={content.settings} />
        <main>
          <Hero hero={content.hero} settings={content.settings} />
          <LogoMarquee logos={content.brand_logos || []} />
          <HowItWorks process={content.process} />
          <Features services={content.services} settings={content.settings} />
          <Industries industries={content.industries} />
          <Testimonials testimonials={content.testimonials} />
          <FAQ faq={content.faq} />
          <CTA cta={content.cta} />
        </main>
        <Footer footer={content.footer} settings={content.settings} />
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
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#030303]">
      <span className="label-mono">/ Error 404</span>
      <h1 className="font-display text-5xl sm:text-7xl text-white mt-4 tracking-tighter">
        Lost in transit.
      </h1>
      <p className="font-body text-zinc-400 mt-4 max-w-md">
        The route you requested doesn&apos;t exist. Head back to the home page.
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
      <AuthProvider>
        <ContentProvider>
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster theme="dark" position="bottom-right" />
          </div>
        </ContentProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
