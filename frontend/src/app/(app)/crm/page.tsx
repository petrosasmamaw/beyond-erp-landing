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

const STAGES: { key: DealStage; label: string }[] = [
  { key: "PROSPECT", label: "Prospect" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "PROPOSAL", label: "Proposal" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "WON", label: "Closed Won" },
  { key: "LOST", label: "Closed Lost" },
];

function getStageDotColor(stage: DealStage): string {
  if (stage === "WON") return "var(--positive)";
  if (stage === "LOST") return "var(--negative)";
  return "var(--text-muted)";
}

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
    <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "var(--text-primary)" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <Briefcase size={16} />
            <span>Commercial Operations</span>
          </div>
          <h1 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 600, lineHeight: "28px", letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
            CRM &amp; Sales Pipeline
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "20px", color: "var(--text-secondary)", maxWidth: 640 }}>
            Track client opportunities, institutional contracts, and B2B deals across Ethiopian sectors.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Sector filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} style={{ color: "var(--text-muted)" }} />
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid var(--border-line)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: 13,
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
            className="btn-primary"
          >
            <Plus size={16} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip (Single-Surface 4-Cell Pattern) */}
      <div className="kpi-strip" style={{ marginBottom: 0 }}>
        <div className="kpi-cell">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Total Pipeline
            </span>
            <DollarSign size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
            {totalPipeline.toLocaleString()} ETB
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {filteredDeals.length} total opportunities
          </div>
        </div>

        <div className="kpi-cell">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Closed Won Revenue
            </span>
            <CheckCircle2 size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
            {wonTotal.toLocaleString()} ETB
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {wonDeals.length} won contracts
          </div>
        </div>

        <div className="kpi-cell">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Active Negotiations
            </span>
            <Briefcase size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
            {activeCount} deals
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>In progress</div>
        </div>

        <div className="kpi-cell">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Win Rate
            </span>
            <TrendingUp size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
            {winRate}%
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Conversion efficiency</div>
        </div>
      </div>

      {/* 6-Stage Kanban Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(240px, 1fr))",
          gap: 16,
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
                backgroundColor: "transparent",
                borderRadius: 0,
                padding: 0,
                border: "none",
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
                  padding: "4px 0 8px",
                  borderBottom: "1px solid var(--border-line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: getStageDotColor(stg.key),
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{stg.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {stageDeals.length}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
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
                      color: "var(--text-muted)",
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
                        className="ui-surface"
                        style={{
                          padding: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          marginBottom: 8,
                        }}
                      >
                        {/* Top: Sector tag & Delete */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span className="chip">
                            {sec?.shortName || deal.sectorId}
                          </span>

                          <button
                            type="button"
                            onClick={() => dispatch(deleteDeal(deal.id))}
                            title="Delete deal"
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--negative)",
                              cursor: "pointer",
                              padding: 4,
                              width: 28,
                              height: 28,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 4,
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Title & Company */}
                        <div>
                          <h4 style={{ margin: "2px 0 2px", fontSize: 13, fontWeight: 500, lineHeight: 1.3, color: "var(--text-primary)" }}>
                            {deal.title}
                          </h4>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)" }}>
                            <Building size={12} />
                            <span>{deal.company}</span>
                          </div>
                        </div>

                        {/* Value ETB */}
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                          {deal.valueETB.toLocaleString()} ETB
                        </div>

                        {/* Contact details */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Phone size={11} />
                            <span>{deal.phone}</span>
                          </div>
                        </div>

                        {deal.notes && (
                          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.3, fontStyle: "italic" }}>
                            &ldquo;{deal.notes}&rdquo;
                          </p>
                        )}

                        {/* Stage Movers Buttons */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderTop: "1px solid var(--border-line)",
                            paddingTop: 8,
                            marginTop: 4,
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
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 4,
                              border: "1px solid var(--border-line)",
                              backgroundColor: "transparent",
                              color: stageIdx === 0 ? "var(--text-muted)" : "var(--text-primary)",
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
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 4,
                              border: "1px solid var(--border-line)",
                              backgroundColor: "transparent",
                              color: stageIdx === STAGES.length - 1 ? "var(--text-muted)" : "var(--accent-blue)",
                              fontWeight: 500,
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
            backgroundColor: "rgba(9, 13, 22, 0.5)",
          }}
          onClick={() => setIsNewDealOpen(false)}
        >
          <div
            className="ui-surface"
            style={{
              width: "min(520px, 92vw)",
              borderRadius: 8,
              padding: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              color: "var(--text-primary)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Capture New B2B Deal</h3>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsNewDealOpen(false)}
                style={{ width: 32, height: 32 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
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
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border-line)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
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
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-line)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
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
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-line)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Aster Kebede"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    style={{
                      width: "100%",
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-line)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+251 9..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{
                      width: "100%",
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-line)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
                    Target Sector
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    style={{
                      width: "100%",
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-line)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
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
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
                    Initial Stage
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    style={{
                      width: "100%",
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-line)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
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
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Notes &amp; Deal Brief
                </label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, tender status, pricing nuances..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 88,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border-line)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8, paddingTop: 16, borderTop: "1px solid var(--border-line)" }}>
                <button
                  type="button"
                  onClick={() => setIsNewDealOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
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

