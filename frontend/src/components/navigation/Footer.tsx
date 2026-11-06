"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface FooterProps {
  inApp?: boolean;
}

export function Footer({ inApp = false }: FooterProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const ink = dark ? "#e8eef9" : "#0b1220";
  const border = dark ? "#1a2d42" : "#eef1f7";
  const blue = "#2563eb";

  return (
    <footer
      className="footer"
      style={{
        padding: inApp ? "36px 24px 28px" : "48px 36px 36px",
        borderTop: `1px solid ${border}`,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="footer-top">
        <div className="footer-brand-block">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: blue,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 20,
                  height: 20,
                  display: "block",
                  background: 'url("/logo.png") center / cover no-repeat',
                }}
              />
            </span>
            <span
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 22,
                color: ink,
              }}
            >
              Beyond<span style={{ color: blue }}>.</span>
            </span>
          </div>
          <h3>The operating system for Ethiopian companies.</h3>
          <p>
            Built in Addis Ababa for sales, stock, payroll, finance, and reports — online or off.
          </p>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <a href="/#sectors">Sectors</a>
          <a href="/#features">Features</a>
          <a href="/#start">Pricing</a>
          <a href="/register">Get access</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="/#start">About</a>
          <a href="/#start">Contact</a>
          <a href="/#start">Careers</a>
          <a href="/register">Start trial</a>
        </div>

        <div className="footer-col">
          <h4>Compliance</h4>
          <a href="/#start">NBE compliance</a>
          <a href="/#start">15% VAT</a>
          <a href="/#start">Data security</a>
          <a href="/#start">Privacy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Beyond ERP Ethiopia</span>
          <span>Built in Addis Ababa</span>
        </div>
        <Link href="/sa" aria-label="Open system admin" className="admin-link">
          Admin<span className="sa-tag">SA</span>
        </Link>
      </div>
    </footer>
  );
}
