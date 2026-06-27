import React, { useState } from "react";
import axios from "axios";
import { ArrowRight, CheckCircle, Warning } from "@phosphor-icons/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CTA = () => {
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [state, setState] = useState({ loading: false, success: false, error: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setState({ loading: false, success: false, error: "Enter a valid email." });
      return;
    }
    setState({ loading: true, success: false, error: "" });
    try {
      await axios.post(`${API}/leads`, {
        email,
        idea: idea || "",
        source: "homepage_cta",
      });
      setState({ loading: false, success: true, error: "" });
      setEmail("");
      setIdea("");
    } catch (err) {
      setState({
        loading: false,
        success: false,
        error: "Something went wrong. Try again.",
      });
    }
  };

  return (
    <section
      id="cta"
      data-testid="cta-section"
      className="relative py-28 lg:py-36 bg-[#050505] border-t border-white/[0.05]"
    >
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] radial-glow blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="label-mono">/ Begin building</span>
          <h2 className="font-display text-4xl sm:text-6xl text-white mt-5 leading-[1.02] tracking-tighter font-semibold max-w-3xl mx-auto">
            What will your business{" "}
            <span className="bg-gradient-to-r from-[#FF5F15] via-[#FFD700] to-[#1ea7ff] bg-clip-text text-transparent">
              ship next
            </span>
            ?
          </h2>
          <p className="font-body text-zinc-400 mt-6 max-w-xl mx-auto leading-relaxed">
            Drop your idea below. We&apos;ll show you a working prototype within 24
            hours — at zero cost, no commitment.

          </p>
        </div>

        <form
          data-testid="cta-form"
          onSubmit={onSubmit}
          className="plg-card p-6 lg:p-8 max-w-3xl mx-auto"
        >
          <label
            htmlFor="idea"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-2"
          >
            / Describe your idea (optional)
          </label>
          <textarea
            id="idea"
            data-testid="cta-idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
            placeholder="A platform for indie retailers to manage cross-channel inventory…"
            className="w-full bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-4 py-3 text-sm text-white font-body placeholder:text-zinc-600 resize-none transition-colors"
          />

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              data-testid="cta-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="flex-1 bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-4 py-3 text-sm text-white font-body placeholder:text-zinc-600 transition-colors"
            />
            <button
              type="submit"
              data-testid="cta-submit-button"
              disabled={state.loading}
              className="btn-brand justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state.loading ? "Submitting…" : "Get my prototype"}
              {!state.loading && <ArrowRight size={16} weight="bold" />}
            </button>
          </div>

          {state.success && (
            <div
              data-testid="cta-success"
              className="mt-5 flex items-start gap-3 border border-[#FF5F15]/30 bg-[#FF5F15]/[0.06] px-4 py-3"
            >
              <CheckCircle size={18} weight="fill" className="text-[#FF5F15] mt-0.5" />
              <div className="font-body text-sm text-zinc-200">
                You&apos;re in. A plugiins engineer will be in touch within 24 hours.
              </div>
            </div>
          )}

          {state.error && (
            <div
              data-testid="cta-error"
              className="mt-5 flex items-start gap-3 border border-red-500/30 bg-red-500/[0.06] px-4 py-3"
            >
              <Warning size={18} weight="fill" className="text-red-400 mt-0.5" />
              <div className="font-body text-sm text-zinc-200">{state.error}</div>
            </div>
          )}

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            / No credit card · No spam · Unsubscribe in one click
          </p>
        </form>
      </div>
    </section>
  );
};
