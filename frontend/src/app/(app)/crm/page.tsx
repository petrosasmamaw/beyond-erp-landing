"use client";

import { useState } from "react";
import {
  Briefcase,
  Plus,
  DollarSign,
  Building,
  Phone,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addDeal,
  updateDealStage,
  deleteDeal,
  type Deal,
  type DealStage,
} from "@/store/slices/crmSlice";
import { SECTORS_CATALOG } from "@/store/initialData";
import { useTheme } from "@/contexts/ThemeContext";

const STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: "PROSPECT", label: "Prospect", color: "#64748b" },
  { key: "CONTACTED", label: "Contacted", color: "#0284c7" },
  { key: "PROPOSAL", label: "Proposal", color: "#f59e0b" },
  { key: "NEGOTIATION", label: "Negotiation", color: "#0891b2" },
  { key: "WON", label: "Closed Won", color: "#10b981" },
  { key: "LOST", label: "Closed Lost", color: "#ef4444" },
];

export default function CrmPage() {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.crm.deals);
  const activeSectorId = useAppSelector((state) => state.sectors.activeSectorId);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [filterSector, setFilterSector] = useState<string>("ALL");
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPhone, setNewPhone] = useState("+251 9");
  const [newValue, setNewValue] = useState("");
  const [newStage, setNewStage] = useState<DealStage>("PROSPECT");
  const [newSector, setNewSector] = useState(activeSectorId);
  const [newDate, setNewDate] = useState("2026-12-01");
  const [newNotes, setNewNotes] = useState("");

  const filteredDeals = deals.filter((deal) => {
    if (filterSector === "ALL") return true;
    if (filterSector === "CURRENT") return deal.sectorId === activeSectorId;
    return deal.sectorId === filterSector;
  });

  const totalPipeline = filteredDeals.reduce((sum, d) => sum + d.valueETB, 0);
  const wonDeals = filteredDeals.filter((d) => d.stage === "WON");
  const wonTotal = wonDeals.reduce((sum, d) => sum + d.valueETB, 0);
  const activeCount = filteredDeals.filter((d) => d.stage !== "WON" && d.stage !== "LOST").length;
  const winRate =
    filteredDeals.length > 0 ? ((wonDeals.length / filteredDeals.length) * 100).toFixed(0) : "0";

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    dispatch(
      addDeal({
        title: newTitle.trim(),
        company: newCompany.trim(),
        contactPerson: newContact.trim() || "Operations Manager",
        phone: newPhone.trim() || "+251 911 000 000",
        valueETB: Number(newValue) || 100000,
        stage: newStage,
        sectorId: newSector || activeSectorId,
        notes: newNotes.trim(),
        expectedCloseDate: newDate,
      })
    );

    setIsNewDealOpen(false);
    setNewTitle("");
    setNewCompany("");
    setNewContact("");
    setNewPhone("+251 9");
    setNewValue("");
    setNewNotes("");
  };

  const moveStage = (deal: Deal, direction: "prev" | "next") => {
    const currentIdx = STAGES.findIndex((s) => s.key === deal.stage);
    if (direction === "next" && currentIdx < STAGES.length - 1) {
      dispatch(updateDealStage({ id: deal.id, stage: STAGES[currentIdx + 1].key }));
    } else if (direction === "prev" && currentIdx > 0) {
      dispatch(updateDealStage({ id: deal.id, stage: STAGES[currentIdx - 1].key }));
    }
  };

  const colors = {
    bg: "var(--bg-canvas)",
    cardBg: "var(--bg-surface)",
    cardBorder: "var(--border-line)",
    ink: "var(--text-primary)",
    muted: "var(--text-muted)",
    columnBg: dark ? "rgba(15, 23, 42, 0.6)" : "var(--bg-subtle)",
    dealBg: "var(--bg-surface)",
    dealBorder: "var(--border-line)",
  };

  return (
    <div style={{ padding: "20px 24px", color: colors.ink }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(37, 99, 235, 0.15)",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={16} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>
              Commercial Operations
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 800, letterSpacing: "-0.01em" }}>
            CRM &amp; Sales Pipeline
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.muted }}>
            Track client opportunities, institutional contracts, and B2B deals across Ethiopian sectors.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Sector filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} style={{ color: colors.muted }} />
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 9,
                border: `1px solid ${colors.cardBorder}`,
                backgroundColor: colors.cardBg,
                color: colors.ink,
                fontSize: 12.5,
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Sectors</option>
              <option value="CURRENT">Active Sector Only</option>
              {SECTORS_CATALOG.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsNewDealOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 10,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus size={16} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>
            Total Pipeline
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "#2563eb" }}>
            {totalPipeline.toLocaleString()} ETB
          </div>
          <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
            {filteredDeals.length} total opportunities
          </div>
        </div>

        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>
            Closed Won Revenue
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "#10b981" }}>
            {wonTotal.toLocaleString()} ETB
          </div>
          <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
            {wonDeals.length} won contracts
          </div>
        </div>

        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>
            Active Negotiations
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "#f59e0b" }}>
            {activeCount} deals
          </div>
          <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>In progress</div>
        </div>

        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>
            Win Rate
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "#2563eb" }}>
            {winRate}%
          </div>
          <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>Conversion efficiency</div>
        </div>
      </div>

      {/* 6-Stage Kanban Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          alignItems: "flex-start",
          overflowX: "auto",
          paddingBottom: 20,
        }}
      >
        {STAGES.map((stg, stageIdx) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stg.key);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.valueETB, 0);

          return (
            <div
              key={stg.key}
              style={{
                backgroundColor: colors.columnBg,
                borderRadius: 14,
                padding: "12px 10px",
                border: `1px solid ${colors.cardBorder}`,
                minHeight: 380,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 8px 8px",
                  borderBottom: `1px solid ${colors.cardBorder}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: stg.color,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{stg.label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 10,
                      backgroundColor: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
                      color: colors.muted,
                    }}
                  >
                    {stageDeals.length}
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: colors.muted }}>
                  {(stageValue / 1000).toFixed(0)}k ETB
                </span>
              </div>

              {/* Deals List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {stageDeals.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px 10px",
                      color: colors.muted,
                      fontSize: 12,
                      fontStyle: "italic",
                    }}
                  >
                    No deals in {stg.label.toLowerCase()}
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const sec = SECTORS_CATALOG.find((s) => s.id === deal.sectorId);

                    return (
                      <div
                        key={deal.id}
                        style={{
                          backgroundColor: colors.dealBg,
                          border: `1px solid ${colors.dealBorder}`,
                          borderRadius: 12,
                          padding: "12px 14px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {/* Top: Sector tag & Delete */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: 5,
                              backgroundColor: `${sec?.color || "#2563eb"}1c`,
                              color: sec?.color || "#2563eb",
                            }}
                          >
                            {sec?.shortName || deal.sectorId}
                          </span>

                          <button
                            type="button"
                            onClick={() => dispatch(deleteDeal(deal.id))}
                            title="Delete deal"
                            style={{
                              background: "none",
                              border: "none",
                              color: colors.muted,
                              cursor: "pointer",
                              padding: 2,
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Title & Company */}
                        <div>
                          <h4 style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                            {deal.title}
                          </h4>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: colors.muted }}>
                            <Building size={12} />
                            <span>{deal.company}</span>
                          </div>
                        </div>

                        {/* Value ETB */}
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#2563eb" }}>
                          {deal.valueETB.toLocaleString()} ETB
                        </div>

                        {/* Contact details */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: colors.muted }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Phone size={11} />
                            <span>{deal.phone}</span>
                          </div>
                        </div>

                        {deal.notes && (
                          <p style={{ margin: 0, fontSize: 11, color: colors.muted, lineHeight: 1.3, fontStyle: "italic" }}>
                            &ldquo;{deal.notes}&rdquo;
                          </p>
                        )}

                        {/* Stage Movers Buttons */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderTop: `1px solid ${colors.dealBorder}`,
                            paddingTop: 8,
                            marginTop: 2,
                          }}
                        >
                          <button
                            type="button"
                            disabled={stageIdx === 0}
                            onClick={() => moveStage(deal, "prev")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              fontSize: 10.5,
                              padding: "3px 6px",
                              borderRadius: 6,
                              border: `1px solid ${colors.dealBorder}`,
                              backgroundColor: "transparent",
                              color: stageIdx === 0 ? colors.muted : colors.ink,
                              cursor: stageIdx === 0 ? "default" : "pointer",
                              opacity: stageIdx === 0 ? 0.4 : 1,
                            }}
                          >
                            <ChevronLeft size={11} /> Prev
                          </button>

                          <button
                            type="button"
                            disabled={stageIdx === STAGES.length - 1}
                            onClick={() => moveStage(deal, "next")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              fontSize: 10.5,
                              padding: "3px 6px",
                              borderRadius: 6,
                              border: `1px solid ${colors.dealBorder}`,
                              backgroundColor: "transparent",
                              color: stageIdx === STAGES.length - 1 ? colors.muted : "#2563eb",
                              fontWeight: 600,
                              cursor: stageIdx === STAGES.length - 1 ? "default" : "pointer",
                              opacity: stageIdx === STAGES.length - 1 ? 0.4 : 1,
                            }}
                          >
                            Next <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Deal Modal */}
      {isNewDealOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backgroundColor: dark ? "rgba(0,0,0,0.7)" : "rgba(15,23,42,0.45)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsNewDealOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              color: colors.ink,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "rgba(37,99,235,0.15)",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Capture New B2B Deal</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDealOpen(false)}
                style={{ background: "none", border: "none", color: colors.muted, cursor: "pointer", padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bulk Medical Supply tender 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    backgroundColor: dark ? "#070c17" : "#ffffff",
                    color: colors.ink,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Client Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Selam Hospital"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: dark ? "#070c17" : "#ffffff",
                      color: colors.ink,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Estimated Value (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450000"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: dark ? "#070c17" : "#ffffff",
                      color: colors.ink,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Aster Kebede"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: dark ? "#070c17" : "#ffffff",
                      color: colors.ink,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+251 9..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: dark ? "#070c17" : "#ffffff",
                      color: colors.ink,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Target Sector
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: dark ? "#070c17" : "#ffffff",
                      color: colors.ink,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {SECTORS_CATALOG.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Initial Stage
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${colors.cardBorder}`,
                      backgroundColor: dark ? "#070c17" : "#ffffff",
                      color: colors.ink,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  Notes &amp; Deal Brief
                </label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, tender status, pricing nuances..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    backgroundColor: dark ? "#070c17" : "#ffffff",
                    color: colors.ink,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsNewDealOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${colors.cardBorder}`,
                    backgroundColor: "transparent",
                    color: colors.ink,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

