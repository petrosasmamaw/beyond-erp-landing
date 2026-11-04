"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Languages,
  RefreshCw,
  ShieldCheck,
  Users,
  Wifi,
  Package,
  Receipt,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Lock,
  Globe2,
} from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Palette
  const pageBg = dark ? "#070b14" : "#e8edf7";
  const cardBg = dark ? "#0d1422" : "#fbfaf6";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const surfaceSoft = dark ? "#0a1220" : "#f4f6fb";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const borderSoft = dark ? "#16243a" : "#eef1f7";
  const ink = dark ? "#e8eef9" : "#0b1220";
  const inkSoft = dark ? "#cbd5e1" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#64748b";
  const blue = "#2563eb";
  const blueDeep = "#1e3a8a";

  const spotlight = sectorDefinitions[0];
  const restSectors = sectorDefinitions.slice(1);

  return (
    <main className="landing-shell">

      <div className="landing-card">
        {/* ============= NAV ============= */}
        <nav className="landing-nav">
          <a className="nav-brand" href="#" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img
                src="/logo.png"
                alt="Beyond ERP"
                width={34}
                height={34}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            </div>
            <span style={{ color: dark ? "#ffffff" : "#2563eb", fontWeight: 800, transition: "color 0.15s ease" }}>Beyond ERP</span>
          </a>

          <div className="nav-links">
            <a className="nav-link" href="#sectors">Sectors</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#start">Pricing</a>
            <a className="nav-link" href="#start">Contact</a>
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <button type="button" className="nav-signin" onClick={() => router.push("/login")}>
              Log in
            </button>
            <button type="button" className="nav-cta" onClick={() => router.push("/register")}>
              Sign up
            </button>
          </div>
        </nav>

        {/* ============= HERO ============= */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">ENTERPRISE OPERATING SYSTEM</div>
            <h1 className="hero-title" style={{ color: dark ? "#ffffff" : "#1d4ed8" }}>
              ከዛሬ ጀምሮ ፣<br />
              ንግድዎን በቀላሉ<br />
              ያስተዳድሩ
            </h1>
            <p className="hero-copy">
              The unified ERP &amp; CRM platform for modern businesses. Automated tax filing, compliance-ready ledgers, seamless payments, and offline-first workflows.
            </p>

            <div className="hero-actions">
              <button type="button" className="btn-primary" onClick={() => router.push("/register")}>
                Start Free Trial
                <ArrowRight size={16} />
              </button>
              <button type="button" className="btn-link" onClick={() => router.push("/login")}>
                Explore Modules
              </button>
            </div>

            <div className="hero-proof">
              <span className="proof-logo">
                <ShieldCheck size={16} /> Audit Ready
              </span>
              <span className="proof-logo">
                <Languages size={16} /> Amharic · English
              </span>
              <span className="proof-logo">
                <Wifi size={16} /> Offline-First Sync
              </span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card-container">
              <img
                src="/hero-preview.webp"
                alt="Beyond ERP Suite Tablet & Mobile Workflows"
                className="hero-card-img"
                width={1275}
                height={1297}
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ============= SECTORS — EDITORIAL ============= */}
        <section id="sectors" className="sectors-band">
          <div className="sectors-inner">
            <div className="sectors-top">
              <div>
                <div className="hero-eyebrow">Operating Models</div>
                <h2>
                  Choose the way<br />
                  your <em>company</em> works.
                </h2>
              </div>
              <div className="sectors-top-right">
                <p>
                  Pick a sector and Beyond opens with the modules, defaults, KPIs, and reports that fit your business from day one. No setup wizards, no empty dashboards.
                </p>
                <div className="sectors-stats">
                  <div>
                    <div className="stat-num">{sectorDefinitions.length}</div>
                    <div className="stat-label">Sectors</div>
                  </div>
                  <div>
                    <div className="stat-num">15%</div>
                    <div className="stat-label">VAT ready</div>
                  </div>
                  <div>
                    <div className="stat-num">∞</div>
                    <div className="stat-label">Offline days</div>
                  </div>
                </div>
              </div>
            </div>

            {spotlight && (
              <div className="sectors-feature">
                <button
                  type="button"
                  className="spotlight-card"
                  onClick={() => router.push(`/register?sectorId=${spotlight.id}`)}
                >
                  <div>
                    <span className="spotlight-tag">
                      <Sparkles size={12} />
                      Featured · Most popular
                    </span>
                    <h3>{spotlight.name}</h3>
                    <p>{spotlight.description}</p>
                    <div className="spotlight-modules">
                      <span className="spotlight-module">Sales</span>
                      <span className="spotlight-module">Stock</span>
                      <span className="spotlight-module">Finance</span>
                      <span className="spotlight-module">Payroll</span>
                      <span className="spotlight-module">Reports</span>
                    </div>
                  </div>
                  <span className="spotlight-go">
                    Configure workspace
                    <ArrowUpRight size={15} />
                  </span>
                </button>

                <div className="sectors-side">
                  {restSectors.slice(0, 2).map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      className="sector-card"
                      onClick={() => router.push(`/register?sectorId=${sector.id}`)}
                    >
                      <div
                        className="sector-icon"
                        style={{
                          background: dark ? `${sector.color}22` : sector.tint,
                          color: sector.color,
                        }}
                      >
                        <i className={sector.icon} />
                      </div>
                      <div>
                        <h3>{sector.name}</h3>
                        <p>{sector.description}</p>
                      </div>
                      <div className="sector-arrow">
                        <ArrowRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {restSectors.length > 2 && (
              <div className="sectors-rest">
                {restSectors.slice(2).map((sector) => (
                  <button
                    key={sector.id}
                    type="button"
                    className="sector-card"
                    onClick={() => router.push(`/register?sectorId=${sector.id}`)}
                  >
                    <div
                      className="sector-icon"
                      style={{
                        background: dark ? `${sector.color}22` : sector.tint,
                        color: sector.color,
                      }}
                    >
                      <i className={sector.icon} />
                    </div>
                    <div>
                      <h3>{sector.name}</h3>
                      <p>{sector.description}</p>
                    </div>
                    <div className="sector-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============= FEATURES — BENTO ============= */}
        <section id="features" className="features-band">
          <div className="features-inner">
            <div className="features-head">
              <div>
                <div className="hero-eyebrow">Core Features</div>
                <h2>
                  Built for the <em>real</em><br />
                  workday.
                </h2>
              </div>
              <p>
                Fast sales, clean ledgers, controlled permissions, and reliable sync — for teams that repeat these workflows every day.
              </p>
            </div>

            <div className="bento">
              <div className="bento-card bento-large">
                <span className="spotlight-tag">
                  <Wifi size={12} />
                  Always available
                </span>
                <h3>Offline-first by design.<br />Sync when ready.</h3>
                <p>
                  Transactions, invoices, and stock movements queue locally on every device. When the network returns, everything reconciles in order — no lost work, no duplicate records.
                </p>
                <div className="bento-visual">
                  <span className="bento-pill">
                    <CheckCircle2 size={12} /> 12 queued
                  </span>
                  <span className="bento-pill">
                    <RefreshCw size={12} /> Auto-sync
                  </span>
                  <span className="bento-pill">
                    <Lock size={12} /> Encrypted
                  </span>
                </div>
              </div>

              <div className="bento-card bento-medium">
                <div className="bento-icon" style={{ background: "#0f766e18", color: "#0f766e" }}>
                  <FileText size={20} />
                </div>
                <h3>VAT-ready receipts</h3>
                <p>Invoices, receipts, and tax reports stay connected to the ledger.</p>
              </div>

              <div className="bento-card bento-medium">
                <div className="bento-icon" style={{ background: "#7c3aed18", color: "#7c3aed" }}>
                  <Users size={20} />
                </div>
                <h3>Team controls</h3>
                <p>Roles, permissions, payroll, and approvals stay structured.</p>
              </div>

              <div className="bento-card bento-wide">
                <div className="bento-icon" style={{ background: `${blue}18`, color: blue }}>
                  <BarChart3 size={20} />
                </div>
                <h3>Reports that read themselves</h3>
                <p>Daily, weekly, monthly. Sales, stock, finance — all in one workspace, in Amharic, English, or Afan Oromo.</p>
              </div>

              <div className="bento-card bento-wide">
                <div className="bento-icon" style={{ background: "#f9731618", color: "#f97316" }}>
                  <Globe2 size={20} />
                </div>
                <h3>Three languages, one team</h3>
                <p>Amharic, English, and Afan Oromo at the interface level. Switch per user, not per company.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============= CTA ============= */}
        <section id="start" className="cta-band">
          <div className="cta-card">
            <div className="cta-left">
              <div className="hero-eyebrow">Start workspace</div>
              <h2>
                Set up your ERP<br />
                in <em>minutes.</em>
              </h2>
              <p>
                Choose your sector, send company details, and your approved workspace opens with the right modules first.
              </p>
              <div className="cta-actions">
                <button type="button" className="btn-primary" onClick={() => router.push("/register")}>
                  Create workspace
                  <ArrowRight size={16} />
                </button>
                <button type="button" className="btn-link" onClick={() => router.push("/login")}>
                  Talk to us
                </button>
              </div>
            </div>

            <div className="cta-right">
              <div className="cta-steps">
                <div className="cta-step">
                  <div className="cta-step-num">1</div>
                  <div className="cta-step-content">
                    <h4>Pick your sector</h4>
                    <p>Retail, services, manufacturing, or hospitality — your defaults follow.</p>
                  </div>
                </div>
                <div className="cta-step">
                  <div className="cta-step-num">2</div>
                  <div className="cta-step-content">
                    <h4>Submit company details</h4>
                    <p>TIN, VAT, branches, and team size. We handle compliance from there.</p>
                  </div>
                </div>
                <div className="cta-step">
                  <div className="cta-step-num">3</div>
                  <div className="cta-step-content">
                    <h4>Approved and live</h4>
                    <p>Your workspace opens with the right modules, KPIs, and reports.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= FOOTER ============= */}
        <footer className="footer">
          <div className="footer-main">
            <div className="footer-brand-side">
              <div className="footer-brand-header">
                <img
                  src="/logo.png"
                  alt="Beyond ERP Logo"
                  width={36}
                  height={36}
                  style={{ borderRadius: "50%", flexShrink: 0, display: "block", objectFit: "contain" }}
                />
                <span className="footer-brand-name">
                  <span style={{ color: dark ? "#ffffff" : "#0f172a", fontWeight: 800, transition: "color 0.15s ease" }}>Beyond</span>{" "}
                  <span style={{ color: "#2563eb", fontWeight: 800 }}>ERP</span>
                </span>
              </div>
              <p className="footer-tagline">
                Mobile-first ERP &amp; CRM for Ethiopian businesses.
              </p>
              <div className="footer-powered">
                Powered by <strong>beyond.et</strong>
              </div>
            </div>

            <div className="footer-contact-side">
              <span className="footer-contact-title">Contact &amp; Location</span>
              <div className="footer-contact-item">
                <strong>Contact:</strong>
                <a href="tel:+251939048523">+251 939 048 523</a>
                <span style={{ opacity: 0.4 }}>/</span>
                <a href="tel:+251928151599">+251 928 151 599</a>
              </div>
              <div className="footer-contact-item">
                <strong>Email:</strong>
                <a href="mailto:beyondsolutionsupport@gmail.com">beyondsolutionsupport@gmail.com</a>
              </div>
              <div className="footer-contact-item">
                <strong>Office:</strong>
                <span>Addis Ababa ,22 bata complex 3rd floor .</span>
              </div>
            </div>

            <div className="footer-nav-side">
              <span className="footer-contact-title">Navigation</span>
              <div className="footer-nav-links">
                <a href="#sectors">Sectors</a>
                <a href="#features">Features</a>
                <a href="#start">Pricing</a>
                <a href="#start">Contact</a>
                <a href="/login">Sign In</a>
                <a href="/register">Get Started</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-meta">
              <span>&copy; {new Date().getFullYear()} <span style={{ color: dark ? "#ffffff" : "#2563eb", fontWeight: 700 }}>Beyond</span> <span style={{ color: "#3b82f6", fontWeight: 700 }}>ERP</span>. All rights reserved.</span>
              <span className="footer-dot">&middot;</span>
              <span>Amharic &middot; English &middot; Afan Oromo</span>
              <span className="footer-dot">&middot;</span>
              <span>Addis Ababa, Ethiopia</span>
            </div>
            <div className="footer-power-badge">
              <Sparkles size={13} className="footer-power-icon" />
              <span>Best ERP Provider in Ethiopia</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}