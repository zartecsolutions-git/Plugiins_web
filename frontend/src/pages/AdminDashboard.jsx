import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useContent } from "@/lib/content";
import { toast } from "sonner";
import {
  SignOut, FloppyDisk, Plus, Trash, ArrowsClockwise,
  Image as ImageIcon, ArrowSquareOut, Envelope,
} from "@phosphor-icons/react";
import { ICON_KEYS } from "@/lib/icons";

const Field = ({ label, value, onChange, type = "text", testid, placeholder }) => (
  <div>
    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-2">
      / {label}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        data-testid={testid}
        className="w-full bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-3 py-2.5 text-sm text-white font-body placeholder:text-zinc-600 transition-colors resize-none"
      />
    ) : type === "select" ? (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testid}
        className="w-full bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-3 py-2.5 text-sm text-white font-body transition-colors"
      >
        {ICON_KEYS.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={testid}
        className="w-full bg-[#060606] border border-white/[0.08] focus:border-[#FF5F15]/50 focus:outline-none px-3 py-2.5 text-sm text-white font-body placeholder:text-zinc-600 transition-colors"
      />
    )}
  </div>
);

const SectionCard = ({ title, children, action }) => (
  <section className="plg-card p-6 lg:p-8">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-display text-xl text-white tracking-tight">{title}</h3>
      {action}
    </div>
    {children}
  </section>
);

const ListEditor = ({ items, onChange, fields, addLabel, testid }) => {
  const update = (i, key, v) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => {
    const blank = {};
    fields.forEach((f) => (blank[f.key] = f.default ?? ""));
    onChange([...(items || []), blank]);
  };
  return (
    <div className="space-y-4">
      {(items || []).map((it, i) => (
        <div key={i} className="border border-white/[0.06] p-4 bg-[#070707]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              / Item {String(i + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              data-testid={`${testid}-remove-${i}`}
              className="text-zinc-500 hover:text-red-400 transition-colors"
              aria-label="Remove"
            >
              <Trash size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                value={it[f.key]}
                type={f.type || "text"}
                placeholder={f.placeholder}
                testid={`${testid}-${f.key}-${i}`}
                onChange={(v) => update(i, f.key, v)}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        data-testid={`${testid}-add`}
        className="btn-ghost w-full justify-center text-[12px]"
      >
        <Plus size={14} weight="bold" /> {addLabel}
      </button>
    </div>
  );
};

const TABS = [
  { key: "settings", label: "Brand & Images" },
  { key: "hero", label: "Hero" },
  { key: "process", label: "Process" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Industries" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "cta", label: "CTA" },
  { key: "footer", label: "Footer" },
  { key: "leads", label: "Leads" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { content, fetchContent, saveContent } = useContent();
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("settings");
  const [saving, setSaving] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
    if (content) setDraft(JSON.parse(JSON.stringify(content)));
  }, [content]);

  const setPath = (path, value) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      const parts = path.split(".");
      let ref = next;
      for (let i = 0; i < parts.length - 1; i++) {
        ref[parts[i]] = ref[parts[i]] || {};
        ref = ref[parts[i]];
      }
      ref[parts.at(-1)] = value;
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveContent(draft);
      toast.success("Site content updated");
    } catch (e) {
      toast.error("Save failed: " + (e?.response?.data?.detail || e.message));
    } finally {
      setSaving(false);
    }
  };

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const { data } = await api.get("/admin/leads");
      setLeads(data);
    } catch (e) {
      toast.error("Failed to load leads");
    } finally {
      setLoadingLeads(false);
    }
  };

  const deleteLead = async (id) => {
    try {
      await api.delete(`/admin/leads/${id}`);
      setLeads((l) => l.filter((x) => x.id !== id));
      toast.success("Lead deleted");
    } catch {
      toast.error("Could not delete lead");
    }
  };

  useEffect(() => {
    if (tab === "leads") loadLeads();
  }, [tab]);

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          / loading studio
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#030303] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_ai-plugin-builder-1/artifacts/mermnicj_Plugiins%20.png"
              alt="Plugiins"
              className="h-8 w-8 object-contain"
            />
            <div>
              <div className="font-display font-semibold text-[15px] leading-none tracking-tight">
                <span className="text-[#1ea7ff]">plug</span>
                <span className="text-[#FF5F15]">iins</span>
                <span className="text-zinc-500 ml-1.5">/ studio</span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 mt-1">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              data-testid="admin-view-site"
              className="btn-ghost text-[12px] py-2 px-3"
            >
              <ArrowSquareOut size={13} weight="bold" /> View site
            </a>
            <button
              onClick={() => fetchContent()}
              data-testid="admin-refresh"
              className="btn-ghost text-[12px] py-2 px-3"
            >
              <ArrowsClockwise size={13} weight="bold" /> Reload
            </button>
            <button
              onClick={save}
              disabled={saving}
              data-testid="admin-save"
              className="btn-brand text-[12px] py-2 px-3 disabled:opacity-60"
            >
              <FloppyDisk size={14} weight="bold" />
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={logout}
              data-testid="admin-logout"
              className="btn-ghost text-[12px] py-2 px-3"
            >
              <SignOut size={13} weight="bold" /> Sign out
            </button>
          </div>
        </div>
        <div className="border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                data-testid={`admin-tab-${t.key}`}
                className={`relative font-mono text-[11px] uppercase tracking-[0.18em] py-3 px-4 transition-colors whitespace-nowrap ${
                  tab === t.key ? "text-[#FF5F15]" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5F15]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {tab === "settings" && (
          <SectionCard title="Brand & Images">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Company name"
                value={draft.settings?.company_name}
                testid="settings-company-name"
                onChange={(v) => setPath("settings.company_name", v)}
              />
              <Field
                label="Tagline"
                value={draft.settings?.tagline}
                testid="settings-tagline"
                onChange={(v) => setPath("settings.tagline", v)}
              />
              <Field
                label="Logo URL"
                value={draft.settings?.logo_url}
                testid="settings-logo-url"
                onChange={(v) => setPath("settings.logo_url", v)}
                placeholder="https://…/logo.png"
              />
              <Field
                label="Hero background URL"
                value={draft.settings?.hero_background_url}
                testid="settings-hero-bg"
                onChange={(v) => setPath("settings.hero_background_url", v)}
              />
              <Field
                label="Feature background URL"
                value={draft.settings?.feature_background_url}
                testid="settings-feature-bg"
                onChange={(v) => setPath("settings.feature_background_url", v)}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {["logo_url", "hero_background_url", "feature_background_url"].map((k) => (
                <div key={k} className="border border-white/[0.06] bg-[#070707] aspect-video flex items-center justify-center overflow-hidden">
                  {draft.settings?.[k] ? (
                    <img src={draft.settings[k]} alt={k} className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon size={20} className="text-zinc-700" />
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {tab === "hero" && (
          <>
            <SectionCard title="Hero copy">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={draft.hero?.eyebrow} testid="hero-eyebrow"
                  onChange={(v) => setPath("hero.eyebrow", v)} />
                <Field label="Headline (line A)" value={draft.hero?.headline_a} testid="hero-h-a"
                  onChange={(v) => setPath("hero.headline_a", v)} />
                <Field label="Headline (line B)" value={draft.hero?.headline_b} testid="hero-h-b"
                  onChange={(v) => setPath("hero.headline_b", v)} />
                <Field label="Headline highlight (gradient)" value={draft.hero?.headline_highlight} testid="hero-h-hi"
                  onChange={(v) => setPath("hero.headline_highlight", v)} />
                <Field label="Headline trailing" value={draft.hero?.headline_c} testid="hero-h-c"
                  onChange={(v) => setPath("hero.headline_c", v)} />
                <Field label="Primary CTA label" value={draft.hero?.primary_cta} testid="hero-cta-1"
                  onChange={(v) => setPath("hero.primary_cta", v)} />
                <Field label="Secondary CTA label" value={draft.hero?.secondary_cta} testid="hero-cta-2"
                  onChange={(v) => setPath("hero.secondary_cta", v)} />
              </div>
              <div className="mt-4">
                <Field label="Subtext" value={draft.hero?.subtext} type="textarea" testid="hero-subtext"
                  onChange={(v) => setPath("hero.subtext", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Hero stats">
              <ListEditor
                items={draft.hero?.stats || []}
                onChange={(v) => setPath("hero.stats", v)}
                addLabel="Add stat"
                testid="hero-stats"
                fields={[
                  { key: "value", label: "Value" },
                  { key: "label", label: "Label" },
                ]}
              />
            </SectionCard>
          </>
        )}

        {tab === "process" && (
          <>
            <SectionCard title="Process header">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={draft.process?.eyebrow} testid="proc-eyebrow"
                  onChange={(v) => setPath("process.eyebrow", v)} />
                <Field label="Title" value={draft.process?.title} testid="proc-title" type="textarea"
                  onChange={(v) => setPath("process.title", v)} />
              </div>
              <div className="mt-4">
                <Field label="Subtext" value={draft.process?.subtext} type="textarea" testid="proc-subtext"
                  onChange={(v) => setPath("process.subtext", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Process steps">
              <ListEditor
                items={draft.process?.steps || []}
                onChange={(v) => setPath("process.steps", v)}
                addLabel="Add step"
                testid="proc-steps"
                fields={[
                  { key: "n", label: "Number (e.g. 01)" },
                  { key: "icon", label: "Icon", type: "select", default: "chat" },
                  { key: "title", label: "Title" },
                  { key: "desc", label: "Description", type: "textarea" },
                ]}
              />
            </SectionCard>
          </>
        )}

        {tab === "services" && (
          <>
            <SectionCard title="Services header">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={draft.services?.eyebrow} testid="svc-eyebrow"
                  onChange={(v) => setPath("services.eyebrow", v)} />
                <Field label="Title" value={draft.services?.title} testid="svc-title" type="textarea"
                  onChange={(v) => setPath("services.title", v)} />
              </div>
              <div className="mt-4">
                <Field label="Subtext" value={draft.services?.subtext} type="textarea" testid="svc-subtext"
                  onChange={(v) => setPath("services.subtext", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Spotlight service">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={draft.services?.spotlight?.title} testid="svc-spot-title"
                  onChange={(v) => setPath("services.spotlight.title", v)} />
                <Field label="Description" value={draft.services?.spotlight?.desc} type="textarea" testid="svc-spot-desc"
                  onChange={(v) => setPath("services.spotlight.desc", v)} />
                <Field label="Tags (comma separated)"
                  value={(draft.services?.spotlight?.tags || []).join(", ")}
                  testid="svc-spot-tags"
                  onChange={(v) => setPath("services.spotlight.tags", v.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </div>
            </SectionCard>
            <SectionCard title="Service cards">
              <ListEditor
                items={draft.services?.cards || []}
                onChange={(v) => setPath("services.cards", v)}
                addLabel="Add service"
                testid="svc-cards"
                fields={[
                  { key: "icon", label: "Icon", type: "select", default: "shield" },
                  { key: "title", label: "Title" },
                  { key: "desc", label: "Description", type: "textarea" },
                ]}
              />
            </SectionCard>
          </>
        )}

        {tab === "industries" && (
          <>
            <SectionCard title="Industries header">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={draft.industries?.eyebrow} testid="ind-eyebrow"
                  onChange={(v) => setPath("industries.eyebrow", v)} />
                <Field label="Title" value={draft.industries?.title} testid="ind-title" type="textarea"
                  onChange={(v) => setPath("industries.title", v)} />
              </div>
              <div className="mt-4">
                <Field label="Subtext" value={draft.industries?.subtext} type="textarea" testid="ind-subtext"
                  onChange={(v) => setPath("industries.subtext", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Industries">
              <ListEditor
                items={draft.industries?.items || []}
                onChange={(v) => setPath("industries.items", v)}
                addLabel="Add industry"
                testid="ind-items"
                fields={[
                  { key: "icon", label: "Icon", type: "select", default: "shop" },
                  { key: "title", label: "Title" },
                  { key: "examples", label: "Examples", type: "textarea" },
                ]}
              />
            </SectionCard>
          </>
        )}

        {tab === "testimonials" && (
          <>
            <SectionCard title="Testimonials header">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={draft.testimonials?.eyebrow} testid="tst-eyebrow"
                  onChange={(v) => setPath("testimonials.eyebrow", v)} />
                <Field label="Title" value={draft.testimonials?.title} type="textarea" testid="tst-title"
                  onChange={(v) => setPath("testimonials.title", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Headline stats">
              <ListEditor
                items={draft.testimonials?.stats || []}
                onChange={(v) => setPath("testimonials.stats", v)}
                addLabel="Add stat"
                testid="tst-stats"
                fields={[
                  { key: "value", label: "Value" },
                  { key: "label", label: "Label" },
                ]}
              />
            </SectionCard>
            <SectionCard title="Quotes">
              <ListEditor
                items={draft.testimonials?.items || []}
                onChange={(v) => setPath("testimonials.items", v)}
                addLabel="Add testimonial"
                testid="tst-items"
                fields={[
                  { key: "quote", label: "Quote", type: "textarea" },
                  { key: "author", label: "Author" },
                  { key: "role", label: "Role · Company" },
                ]}
              />
            </SectionCard>
          </>
        )}

        {tab === "faq" && (
          <>
            <SectionCard title="FAQ header">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={draft.faq?.eyebrow} testid="faq-eyebrow"
                  onChange={(v) => setPath("faq.eyebrow", v)} />
                <Field label="Title" value={draft.faq?.title} testid="faq-title"
                  onChange={(v) => setPath("faq.title", v)} />
              </div>
              <div className="mt-4">
                <Field label="Subtext" value={draft.faq?.subtext} type="textarea" testid="faq-subtext"
                  onChange={(v) => setPath("faq.subtext", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Questions">
              <ListEditor
                items={draft.faq?.items || []}
                onChange={(v) => setPath("faq.items", v)}
                addLabel="Add question"
                testid="faq-items"
                fields={[
                  { key: "q", label: "Question" },
                  { key: "a", label: "Answer", type: "textarea" },
                ]}
              />
            </SectionCard>
          </>
        )}

        {tab === "cta" && (
          <SectionCard title="CTA / Lead capture">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Eyebrow" value={draft.cta?.eyebrow} testid="cta-eyebrow"
                onChange={(v) => setPath("cta.eyebrow", v)} />
              <Field label="Headline A" value={draft.cta?.headline_a} testid="cta-h-a"
                onChange={(v) => setPath("cta.headline_a", v)} />
              <Field label="Highlight (gradient)" value={draft.cta?.headline_highlight} testid="cta-h-hi"
                onChange={(v) => setPath("cta.headline_highlight", v)} />
              <Field label="Headline trailing" value={draft.cta?.headline_b} testid="cta-h-b"
                onChange={(v) => setPath("cta.headline_b", v)} />
              <Field label="Email placeholder" value={draft.cta?.form_email_placeholder} testid="cta-email-ph"
                onChange={(v) => setPath("cta.form_email_placeholder", v)} />
              <Field label="Submit button label" value={draft.cta?.form_submit} testid="cta-submit-label"
                onChange={(v) => setPath("cta.form_submit", v)} />
              <Field label="Idea label" value={draft.cta?.form_idea_label} testid="cta-idea-label"
                onChange={(v) => setPath("cta.form_idea_label", v)} />
              <Field label="Idea placeholder" value={draft.cta?.form_idea_placeholder} testid="cta-idea-ph"
                onChange={(v) => setPath("cta.form_idea_placeholder", v)} />
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Subtext" value={draft.cta?.subtext} type="textarea" testid="cta-subtext"
                onChange={(v) => setPath("cta.subtext", v)} />
              <Field label="Success message" value={draft.cta?.form_success} type="textarea" testid="cta-success-msg"
                onChange={(v) => setPath("cta.form_success", v)} />
              <Field label="Disclaimer" value={draft.cta?.form_disclaimer} testid="cta-disclaimer"
                onChange={(v) => setPath("cta.form_disclaimer", v)} />
            </div>
          </SectionCard>
        )}

        {tab === "footer" && (
          <>
            <SectionCard title="Footer tagline">
              <Field label="Tagline" value={draft.footer?.tagline} type="textarea" testid="footer-tagline"
                onChange={(v) => setPath("footer.tagline", v)} />
            </SectionCard>
            <SectionCard title="Footer columns">
              <div className="space-y-5">
                {(draft.footer?.columns || []).map((col, i) => (
                  <div key={i} className="border border-white/[0.06] p-4 bg-[#070707]">
                    <div className="flex items-center justify-between mb-3">
                      <Field
                        label={`Column ${i + 1} title`}
                        value={col.title}
                        testid={`footer-col-title-${i}`}
                        onChange={(v) => {
                          const cols = [...(draft.footer?.columns || [])];
                          cols[i] = { ...cols[i], title: v };
                          setPath("footer.columns", cols);
                        }}
                      />
                    </div>
                    <Field
                      label="Links (comma separated)"
                      value={(col.links || []).join(", ")}
                      testid={`footer-col-links-${i}`}
                      onChange={(v) => {
                        const cols = [...(draft.footer?.columns || [])];
                        cols[i] = {
                          ...cols[i],
                          links: v.split(",").map((s) => s.trim()).filter(Boolean),
                        };
                        setPath("footer.columns", cols);
                      }}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Brand marquee logos">
              <Field
                label="Logos (comma separated)"
                value={(draft.brand_logos || []).join(", ")}
                testid="brand-logos"
                onChange={(v) => setPath("brand_logos", v.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </SectionCard>
          </>
        )}

        {tab === "leads" && (
          <SectionCard
            title={`Leads (${leads.length})`}
            action={
              <button
                onClick={loadLeads}
                data-testid="leads-refresh"
                className="btn-ghost text-[12px] py-2 px-3"
              >
                <ArrowsClockwise size={13} weight="bold" /> Refresh
              </button>
            }
          >
            {loadingLeads ? (
              <div className="font-mono text-xs text-zinc-500 py-12 text-center">
                / loading leads
              </div>
            ) : leads.length === 0 ? (
              <div className="font-body text-sm text-zinc-500 py-12 text-center border border-dashed border-white/[0.06]">
                No leads yet. They will appear here as visitors submit the CTA form.
              </div>
            ) : (
              <div className="space-y-2">
                {leads.map((l) => (
                  <div
                    key={l.id}
                    data-testid={`lead-row-${l.id}`}
                    className="border border-white/[0.06] bg-[#070707] p-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto_auto] gap-3 items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm text-white font-body">
                        <Envelope size={14} className="text-[#FF5F15]" />
                        {l.email}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 mt-1">
                        {new Date(l.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="font-body text-sm text-zinc-400 leading-relaxed">
                      {l.idea || <span className="text-zinc-700">— no idea provided —</span>}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 self-center">
                      {l.source}
                    </span>
                    <button
                      onClick={() => deleteLead(l.id)}
                      data-testid={`lead-delete-${l.id}`}
                      className="text-zinc-500 hover:text-red-400 self-center"
                      aria-label="Delete lead"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}
      </main>
    </div>
  );
}
