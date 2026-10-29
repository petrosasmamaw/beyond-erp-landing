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
    <main className="landing-shell" style={{ background: pageBg, color: ink }}>
      <style jsx>{`
        .landing-shell {
          min-height: 100vh;
          font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
          padding: 18px;
        }

        .landing-card {
          max-width: 1320px;
          margin: 0 auto;
          background: ${cardBg};
          border-radius: 22px;
          overflow: hidden;
          box-shadow: ${dark
            ? "0 30px 80px rgba(0,0,0,0.45)"
            : "0 30px 80px rgba(30,58,138,0.10)"};
        }

        /* ===== NAV ===== */
        .landing-nav {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          padding: 22px 36px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${ink};
          font-family: "Instrument Serif", Georgia, serif;
          font-size: 26px;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .nav-brand .dot {
          color: ${blue};
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
          justify-self: center;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-link {
          color: ${inkSoft};
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: ${blue};
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-self: end;
        }

        .nav-signin {
          background: none;
          border: 0;
          color: ${ink};
          font-size: 14px;
          font-weight: 600;
          padding: 8px 14px;
          cursor: pointer;
        }

        .nav-cta {
          background: ${ink};
          color: ${cardBg};
          border: 0;
          border-radius: 999px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.15s ease;
        }

        .nav-cta:hover {
          transform: translateY(-1px);
        }

        /* ===== HERO (unchanged) ===== */
        .hero {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 0;
          padding: 0 0 0 36px;
          position: relative;
          min-height: 580px;
        }

        .hero-left {
          padding: 30px 40px 60px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          color: ${blue};
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .hero-eyebrow::before {
          content: "";
          width: 22px;
          height: 1.5px;
          background: ${blue};
        }

        .hero-title {
          margin: 0;
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: clamp(44px, 5.4vw, 72px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: ${ink};
        }

        .hero-title em {
          font-style: italic;
          color: ${blue};
        }

        .hero-copy {
          margin: 26px 0 0;
          max-width: 480px;
          color: ${muted};
          font-size: 15px;
          line-height: 1.65;
        }

        .hero-actions {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: ${blue};
          color: white;
          border: 0;
          border-radius: 10px;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);
        }

        .btn-link {
          background: none;
          border: 0;
          color: ${ink};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 4px;
          border-bottom: 1.5px solid ${ink};
        }

        .hero-proof {
          margin-top: 48px;
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
          color: ${muted};
        }

        .proof-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .proof-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 15px;
          opacity: 0.7;
        }

        .hero-right {
          position: relative;
          background: linear-gradient(160deg, ${blueDeep} 0%, #1d4ed8 55%, #0f172a 100%);
          border-top-left-radius: 28px;
          border-bottom-left-radius: 28px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 18px 0 18px 18px;
        }

        .hero-right::before {
          content: "";
          position: absolute;
          top: -80px;
          right: -80px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147, 197, 253, 0.18) 0%, transparent 70%);
        }

        .hero-right::after {
          content: "";
          position: absolute;
          bottom: -60px;
          left: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
        }

        .floating-badge {
          position: absolute;
          top: 28px;
          left: 28px;
          background: ${ink};
          color: ${cardBg};
          border-radius: 999px;
          padding: 8px 14px 8px 8px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 700;
          z-index: 3;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        .floating-badge .avatars {
          display: flex;
        }

        .avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid ${ink};
          margin-left: -8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 9px;
          font-weight: 800;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .mockup {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 460px;
          background: ${surface};
          border-radius: 18px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
          overflow: hidden;
        }

        .mockup-top {
          padding: 16px 18px;
          border-bottom: 1px solid ${borderSoft};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mockup-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mockup-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .mockup-body {
          padding: 20px;
          display: grid;
          gap: 14px;
        }

        .mockup-metric-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .mockup-metric {
          background: ${surfaceSoft};
          border-radius: 12px;
          padding: 14px;
          border: 1px solid ${borderSoft};
        }

        .mockup-metric-label {
          color: ${muted};
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mockup-metric-value {
          color: ${ink};
          font-size: 20px;
          font-weight: 700;
          margin-top: 6px;
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .mockup-metric-delta {
          color: #10b981;
          font-size: 11px;
          font-weight: 700;
        }

        .mockup-chart {
          background: ${surfaceSoft};
          border-radius: 12px;
          border: 1px solid ${borderSoft};
          padding: 14px;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 70px;
          margin-top: 10px;
        }

        .chart-bar {
          flex: 1;
          background: ${blue};
          border-radius: 4px 4px 0 0;
          opacity: 0.85;
        }

        .mockup-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-top: 1px solid ${borderSoft};
        }

        .mockup-list-item:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .floating-card {
          position: absolute;
          bottom: 40px;
          right: -10px;
          z-index: 3;
          background: ${cardBg};
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 200px;
        }

        .floating-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #dcfce7;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== SECTORS — EDITORIAL ===== */
        .sectors-band {
          padding: 110px 36px 90px;
          border-top: 1px solid ${borderSoft};
          position: relative;
        }

        .sectors-band::before {
          content: "002";
          position: absolute;
          top: 40px;
          right: 36px;
          font-family: "Instrument Serif", Georgia, serif;
          font-size: 110px;
          color: ${dark ? "rgba(37,99,235,0.06)" : "rgba(37,99,235,0.05)"};
          line-height: 1;
          letter-spacing: -0.02em;
          pointer-events: none;
        }

        .sectors-inner {
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }

        .sectors-top {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 56px;
          align-items: end;
          margin-bottom: 56px;
        }

        .sectors-top h2 {
          margin: 14px 0 0;
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: ${ink};
        }

        .sectors-top h2 em {
          font-style: italic;
          color: ${blue};
        }

        .sectors-top-right {
          padding-bottom: 12px;
        }

        .sectors-top-right p {
          margin: 0 0 20px;
          color: ${muted};
          font-size: 15px;
          line-height: 1.65;
        }

        .sectors-stats {
          display: flex;
          gap: 32px;
          padding-top: 20px;
          border-top: 1px solid ${border};
        }

        .stat-num {
          font-family: "Instrument Serif", Georgia, serif;
          font-size: 36px;
          line-height: 1;
          color: ${ink};
          margin-bottom: 4px;
        }

        .stat-label {
          color: ${muted};
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sectors-feature {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .spotlight-card {
          background: linear-gradient(160deg, ${blueDeep} 0%, #1d4ed8 60%, #0f172a 100%);
          border-radius: 20px;
          padding: 36px;
          color: white;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          min-height: 360px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.25s ease;
          border: 0;
          text-align: left;
        }

        .spotlight-card:hover {
          transform: translateY(-3px);
        }

        .spotlight-card::after {
          content: "";
          position: absolute;
          top: -100px;
          right: -80px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147, 197, 253, 0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        .spotlight-tag {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          align-self: flex-start;
        }

        .spotlight-card h3 {
          position: relative;
          margin: 22px 0 14px;
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: 40px;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .spotlight-card p {
          position: relative;
          margin: 0 0 28px;
          color: rgba(219, 234, 254, 0.85);
          font-size: 14px;
          line-height: 1.6;
          max-width: 380px;
        }

        .spotlight-modules {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 26px;
        }

        .spotlight-module {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(219, 234, 254, 0.95);
        }

        .spotlight-go {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: white;
          padding-bottom: 4px;
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.4);
          align-self: flex-start;
        }

        .sectors-side {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
        }

        .sector-card {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 20px;
          padding: 28px;
          text-align: left;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          position: relative;
        }

        .sector-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.12);
          border-color: ${blue};
        }

        .sector-card:hover .sector-arrow {
          background: ${blue};
          color: white;
          transform: rotate(-45deg);
        }

        .sector-icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .sector-card h3 {
          margin: 0 0 4px;
          font-size: 17px;
          font-weight: 700;
          color: ${ink};
        }

        .sector-card p {
          margin: 0;
          color: ${muted};
          font-size: 13px;
          line-height: 1.5;
        }

        .sector-arrow {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${surfaceSoft};
          color: ${ink};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .sectors-rest {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ===== FEATURES — BENTO ===== */
        .features-band {
          padding: 110px 36px;
          background: ${dark ? "#0a1220" : "#f4f6fb"};
          position: relative;
        }

        .features-band::before {
          content: "003";
          position: absolute;
          top: 40px;
          left: 36px;
          font-family: "Instrument Serif", Georgia, serif;
          font-size: 110px;
          color: ${dark ? "rgba(37,99,235,0.06)" : "rgba(37,99,235,0.05)"};
          line-height: 1;
          letter-spacing: -0.02em;
          pointer-events: none;
        }

        .features-inner {
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }

        .features-head {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: end;
          margin-bottom: 48px;
        }

        .features-head h2 {
          margin: 14px 0 0;
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: ${ink};
        }

        .features-head h2 em {
          font-style: italic;
          color: ${blue};
        }

        .features-head p {
          margin: 0;
          color: ${muted};
          font-size: 15px;
          line-height: 1.65;
          padding-bottom: 12px;
        }

        .bento {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: minmax(180px, auto);
          gap: 16px;
        }

        .bento-card {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .bento-large {
          grid-column: span 4;
          grid-row: span 2;
          background: linear-gradient(160deg, ${blueDeep} 0%, #1d4ed8 60%, #0f172a 100%);
          color: white;
          border-color: transparent;
        }

        .bento-large::after {
          content: "";
          position: absolute;
          bottom: -120px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147, 197, 253, 0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        .bento-medium {
          grid-column: span 2;
          grid-row: span 1;
        }

        .bento-wide {
          grid-column: span 3;
          grid-row: span 1;
        }

        .bento-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .bento-card h3 {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.25;
        }

        .bento-card p {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
        }

        .bento-large h3 {
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: 32px;
          line-height: 1.05;
          margin: 24px 0 12px;
          letter-spacing: -0.01em;
        }

        .bento-large p {
          color: rgba(219, 234, 254, 0.85);
          font-size: 14px;
          line-height: 1.6;
          max-width: 380px;
        }

        .bento-visual {
          margin-top: auto;
          position: relative;
          z-index: 2;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 28px;
        }

        .bento-pill {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* ===== CTA ===== */
        .cta-band {
          padding: 36px;
        }

        .cta-card {
          background: ${cardBg};
          border: 1px solid ${border};
          border-radius: 24px;
          padding: 0;
          color: ${ink};
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 380px;
        }

        .cta-left {
          padding: 60px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cta-left h2 {
          margin: 14px 0 0;
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: clamp(38px, 4.8vw, 58px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: ${ink};
        }

        .cta-left h2 em {
          font-style: italic;
          color: ${blue};
        }

        .cta-left p {
          margin: 22px 0 32px;
          color: ${muted};
          font-size: 15px;
          line-height: 1.6;
          max-width: 440px;
        }

        .cta-right {
          background: linear-gradient(160deg, ${blueDeep} 0%, #1d4ed8 60%, #0f172a 100%);
          padding: 50px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cta-right::before {
          content: "";
          position: absolute;
          top: -100px;
          right: -50px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147, 197, 253, 0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-steps {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .cta-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          color: white;
        }

        .cta-step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .cta-step-content h4 {
          margin: 6px 0 4px;
          font-size: 15px;
          font-weight: 700;
        }

        .cta-step-content p {
          margin: 0;
          color: rgba(219, 234, 254, 0.78);
          font-size: 13px;
          line-height: 1.5;
        }

        .cta-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        /* ===== FOOTER ===== */
        .footer {
          padding: 48px 36px 36px;
          border-top: 1px solid ${borderSoft};
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-brand-block h3 {
          margin: 14px 0 12px;
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: 28px;
          line-height: 1.1;
          color: ${ink};
          max-width: 280px;
        }

        .footer-brand-block p {
          margin: 0;
          color: ${muted};
          font-size: 13px;
          line-height: 1.55;
          max-width: 280px;
        }

        .footer-col h4 {
          margin: 0 0 16px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${muted};
        }

        .footer-col a {
          display: block;
          color: ${ink};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 10px;
          transition: color 0.15s ease;
        }

        .footer-col a:hover {
          color: ${blue};
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid ${borderSoft};
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          color: ${muted};
          font-size: 13px;
          font-weight: 500;
        }

        .admin-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid ${border};
          border-radius: 999px;
          background: ${surface};
          color: ${ink};
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        .admin-link .sa-tag {
          background: ${blue};
          color: white;
          border-radius: 999px;
          padding: 2px 7px;
          font-size: 10px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1080px) {
          .sectors-top,
          .sectors-feature,
          .features-head,
          .cta-card {
            grid-template-columns: 1fr;
          }
          .sectors-side {
            grid-template-rows: auto;
            grid-template-columns: 1fr 1fr;
          }
          .sectors-rest {
            grid-template-columns: repeat(2, 1fr);
          }
          .bento {
            grid-template-columns: repeat(4, 1fr);
          }
          .bento-large {
            grid-column: span 4;
          }
          .bento-medium {
            grid-column: span 2;
          }
          .bento-wide {
            grid-column: span 2;
          }
          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 880px) {
          .landing-shell {
            padding: 10px;
          }
          .nav-links {
            display: none;
          }
          .landing-nav {
            grid-template-columns: 1fr auto;
            padding: 18px 22px;
          }
          .hero {
            grid-template-columns: 1fr;
            padding: 0 22px;
            min-height: auto;
          }
          .hero-left {
            padding: 30px 0 20px;
          }
          .hero-right {
            margin: 0 0 22px;
            border-radius: 22px;
            min-height: 440px;
          }
          .floating-card {
            right: 10px;
          }
          .sectors-band,
          .features-band {
            padding: 72px 22px;
          }
          .sectors-band::before,
          .features-band::before {
            display: none;
          }
          .cta-left,
          .cta-right {
            padding: 40px 28px;
          }
        }

        @media (max-width: 560px) {
          .sectors-side,
          .sectors-rest {
            grid-template-columns: 1fr;
          }
          .bento {
            grid-template-columns: 1fr;
          }
          .bento-large,
          .bento-medium,
          .bento-wide {
            grid-column: span 1;
          }
          .footer-top {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .hero-proof {
            gap: 18px;
          }
          .nav-signin {
            display: none;
          }
        }
      `}</style>

      <div className="landing-card">
        {/* ============= NAV ============= */}
        <nav className="landing-nav">
          <a className="nav-brand" href="#" style={{ textDecoration: "none" }}>
            <LogoTile tileSize={32} iconSize={20} background={blue} />
            Beyond<span className="dot">.</span>
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

        {/* ============= HERO (UNCHANGED) ============= */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">Beyond ERP · Ethiopia</div>
            <h1 className="hero-title">
              Empower Your<br />
              Business with<br />
              <em>Modern</em> Solutions
            </h1>
            <p className="hero-copy">
              A sector-aware ERP workspace for sales, stock, payroll, finance, and reports. NBE compliant, 15% VAT built in, and offline-first for the days the network drops.
            </p>

            <div className="hero-actions">
              <button type="button" className="btn-primary" onClick={() => router.push("/register")}>
                Get Started
                <ArrowRight size={16} />
              </button>
              <button type="button" className="btn-link" onClick={() => router.push("/login")}>
                Explore Modules
              </button>
            </div>

            <div className="hero-proof">
              <span className="proof-label">Trusted by</span>
              <span className="proof-logo">
                <ShieldCheck size={16} /> NBE Ready
              </span>
              <span className="proof-logo">
                <Languages size={16} /> Amharic · Oromo
              </span>
              <span className="proof-logo">
                <Wifi size={16} /> Offline-first
              </span>
            </div>
          </div>

          <div className="hero-right">
            <div className="floating-badge">
              <div className="avatars">
                <span className="avatar" style={{ background: "#f97316" }}>A</span>
                <span className="avatar" style={{ background: "#7c3aed" }}>M</span>
                <span className="avatar" style={{ background: "#0f766e" }}>T</span>
              </div>
              <span>Live · 12 teams online</span>
            </div>

            <div className="mockup">
              <div className="mockup-top">
                <div className="mockup-top-left">
                  <span className="mockup-dot" style={{ background: "#ef4444" }} />
                  <span className="mockup-dot" style={{ background: "#f59e0b" }} />
                  <span className="mockup-dot" style={{ background: "#10b981" }} />
                </div>
                <span style={{ color: muted, fontSize: 11, fontWeight: 600 }}>
                  beyond-erp.app
                </span>
              </div>

              <div className="mockup-body">
                <div className="mockup-metric-row">
                  <div className="mockup-metric">
                    <div className="mockup-metric-label">Revenue</div>
                    <div className="mockup-metric-value">
                      ETB 428k
                      <span className="mockup-metric-delta">+12%</span>
                    </div>
                  </div>
                  <div className="mockup-metric">
                    <div className="mockup-metric-label">Orders</div>
                    <div className="mockup-metric-value">
                      1,284
                      <span className="mockup-metric-delta">+8%</span>
                    </div>
                  </div>
                </div>

                <div className="mockup-chart">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: ink, fontSize: 12, fontWeight: 700 }}>Weekly sales</span>
                    <span style={{ color: muted, fontSize: 10, fontWeight: 600 }}>This week</span>
                  </div>
                  <div className="chart-bars">
                    {[40, 65, 50, 80, 45, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="chart-bar"
                        style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.55 }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mockup-list-item">
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: `${blue}18`, color: blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Receipt size={14} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: ink, fontSize: 12, fontWeight: 600 }}>Invoice #4821</div>
                      <div style={{ color: muted, fontSize: 11 }}>VAT receipt issued</div>
                    </div>
                    <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>Paid</span>
                  </div>
                  <div className="mockup-list-item">
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: "#f9731618", color: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={14} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: ink, fontSize: 12, fontWeight: 600 }}>Stock sync</div>
                      <div style={{ color: muted, fontSize: 11 }}>12 items queued</div>
                    </div>
                    <span style={{ color: blue, fontSize: 11, fontWeight: 700 }}>Syncing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card">
              <div className="floating-card-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ color: ink, fontSize: 12, fontWeight: 700 }}>VAT filed</div>
                <div style={{ color: muted, fontSize: 11 }}>Ready for export</div>
              </div>
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
                <h3 style={{ color: ink }}>VAT-ready receipts</h3>
                <p style={{ color: muted }}>Invoices, receipts, and tax reports stay connected to the ledger.</p>
              </div>

              <div className="bento-card bento-medium">
                <div className="bento-icon" style={{ background: "#7c3aed18", color: "#7c3aed" }}>
                  <Users size={20} />
                </div>
                <h3 style={{ color: ink }}>Team controls</h3>
                <p style={{ color: muted }}>Roles, permissions, payroll, and approvals stay structured.</p>
              </div>

              <div className="bento-card bento-wide">
                <div className="bento-icon" style={{ background: `${blue}18`, color: blue }}>
                  <BarChart3 size={20} />
                </div>
                <h3 style={{ color: ink }}>Reports that read themselves</h3>
                <p style={{ color: muted }}>Daily, weekly, monthly. Sales, stock, finance — all in one workspace, in Amharic or English.</p>
              </div>

              <div className="bento-card bento-wide">
                <div className="bento-icon" style={{ background: "#f9731618", color: "#f97316" }}>
                  <Globe2 size={20} />
                </div>
                <h3 style={{ color: ink }}>Three languages, one team</h3>
                <p style={{ color: muted }}>Amharic, Oromo, and Tigrinya at the interface level. Switch per user, not per company.</p>
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
          <div className="footer-top">
            <div className="footer-brand-block">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoTile tileSize={32} iconSize={20} background={blue} />
                <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, color: ink }}>
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
              <a href="#sectors">Sectors</a>
              <a href="#features">Features</a>
              <a href="#start">Pricing</a>
              <a href="/register">Get access</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="#start">About</a>
              <a href="#start">Contact</a>
              <a href="#start">Careers</a>
              <a href="/login">Sign in</a>
            </div>

            <div className="footer-col">
              <h4>Compliance</h4>
              <a href="#start">NBE compliance</a>
              <a href="#start">15% VAT</a>
              <a href="#start">Data security</a>
              <a href="#start">Privacy</a>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-meta">
              <span>&copy; {new Date().getFullYear()} Beyond ERP Ethiopia</span>
              <span>Built in Addis Ababa</span>
            </div>
            <a href="/sa" className="admin-link" aria-label="Open system admin">
              Admin
              <span className="sa-tag">SA</span>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============ HELPERS ============ */

function LogoTile({
  tileSize,
  iconSize,
  background,
  border = "none",
}: {
  tileSize: number;
  iconSize: number;
  background: string;
  border?: string;
}) {
  return (
    <span
      style={{
        width: tileSize,
        height: tileSize,
        borderRadius: Math.max(8, Math.round(tileSize * 0.28)),
        background,
        border,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: iconSize,
          height: iconSize,
          display: "block",
          background: 'url("/beyond.ico") center / contain no-repeat',
        }}
      />
    </span>
  );
}