import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Lock, Warning } from "@phosphor-icons/react";

const formatErr = (detail) => {
  if (!detail) return "Login failed. Try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d?.msg || JSON.stringify(d)).join(" ");
  return String(detail);
};

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (e) {
      setErr(formatErr(e?.response?.data?.detail) || e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      className="min-h-screen flex items-center justify-center bg-[#030303] grain relative px-6"
    >
      <div className="absolute inset-0 -z-0 tech-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] radial-glow blur-3xl" />

      <form
        onSubmit={onSubmit}
        data-testid="admin-login-form"
        className="relative w-full max-w-md plg-card p-8 lg:p-10"
      >
        <a href="/" className="flex items-center gap-2.5 mb-8" data-testid="admin-login-logo">
          <img
            src="https://customer-assets.emergentagent.com/job_ai-plugin-builder-1/artifacts/mermnicj_Plugiins%20.png"
            alt="Plugiins"
            className="h-9 w-9 object-contain"
          />
          <span className="font-display font-semibold text-[17px] tracking-tight">
            <span className="text-[#1ea7ff]">plug</span>
            <span className="text-[#FF5F15]">iins</span>
            <span className="text-[#FF5F15]">.</span>
          </span>
        </a>

        <span className="label-mono">/ Studio access</span>
        <h1 className="font-display text-3xl text-white mt-2 tracking-tight">
          Sign in to the CMS
        </h1>
        <p className="font-body text-sm text-zinc-500 mt-2 leading-relaxed">
          Manage site content, hero imagery and inbound leads.
        </p>

        <div className="mt-7 space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-2">
              / Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="webadmin@plugiins.com"
              data-testid="admin-login-email"
              className="w-full bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-4 py-3 text-sm text-white font-body placeholder:text-zinc-600 transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-2">
              / Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              data-testid="admin-login-password"
              className="w-full bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-4 py-3 text-sm text-white font-body placeholder:text-zinc-600 transition-colors"
            />
          </div>
        </div>

        {err && (
          <div
            data-testid="admin-login-error"
            className="mt-5 flex items-start gap-3 border border-red-500/30 bg-red-500/[0.06] px-4 py-3"
          >
            <Warning size={18} weight="fill" className="text-red-400 mt-0.5" />
            <div className="font-body text-sm text-zinc-200">{err}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          data-testid="admin-login-submit"
          className="btn-brand w-full justify-center mt-7 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Lock size={14} weight="bold" />
          {busy ? "Signing in…" : "Sign in"}
          {!busy && <ArrowRight size={14} weight="bold" />}
        </button>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 text-center">
          / Plugiins Studio · Authorised personnel only
        </p>
      </form>
    </div>
  );
}
