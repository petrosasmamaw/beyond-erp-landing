"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Pager } from "@/components/ui/Pager";
import { paginate } from "@/features/erp/helpers";
import { mockDrugs, getDrugStatus, STATUS_COLORS, type Drug } from "../data";
import { useTheme } from "@/contexts/ThemeContext";

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    surface: dark ? "#111827" : "#ffffff",
    alt:     dark ? "#0d1828" : "#f8fafc",
    border:  dark ? "#1a2d3d" : "#e8edf5",
    ink:     dark ? "#e2e8f0" : "#0f172a",
    muted:   dark ? "#566070" : "#64748b",
  };
}

const CATEGORIES = ["Antidiabetic", "Antihypertensive", "Antibiotic", "Analgesic", "Statin", "Bronchodilator", "PPI", "Diuretic", "Insulin", "Anxiolytic", "Corticosteroid", "Antifungal", "Antiretroviral"];
const SUPPLIERS = ["Ethiopian Pharm", "Medico Ethiopia", "MedPharm PLC", "Addis Pharm"];

export function Pharmacy() {
  const c = useColors();
  const [drugs, setDrugs] = useState<Drug[]>(mockDrugs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", genericName: "", category: CATEGORIES[0], unit: "Tablet", stock: "", reorderLevel: "", expiryDate: "", costPrice: "", sellingPrice: "", supplier: SUPPLIERS[0] });

  const enriched = drugs.map((d) => ({ ...d, computedStatus: getDrugStatus(d) }));

  const filtered = enriched.filter((d) => {
    const term = search.toLowerCase();
    return (
      (!term || d.name.toLowerCase().includes(term) || d.genericName.toLowerCase().includes(term)) &&
      (!categoryFilter || d.category === categoryFilter) &&
      (!stockFilter || d.computedStatus === stockFilter)
    );
  });

  const paged = paginate(filtered, page);

  const totalValue = drugs.reduce((sum, d) => sum + d.stock * d.costPrice, 0);
  const stats = {
    total:        drugs.length,
    lowStock:     enriched.filter((d) => d.computedStatus === "Low Stock").length,
    outOfStock:   enriched.filter((d) => d.computedStatus === "Out of Stock").length,
    expiringSoon: enriched.filter((d) => d.computedStatus === "Expiring Soon").length,
  };

  const kpis = [
    { label: "Total Drugs",      value: String(stats.total),        color: "#2563eb", bg: c.dark ? "#08121e" : "#eff6ff", bdr: c.dark ? "#142338" : "#bfdbfe", icon: "fa-solid fa-pills" },
    { label: "Low Stock",        value: String(stats.lowStock),     color: "#f59e0b", bg: c.dark ? "#150f02" : "#fffbeb", bdr: c.dark ? "#2e2008" : "#fde68a", icon: "fa-solid fa-triangle-exclamation" },
    { label: "Out of Stock",     value: String(stats.outOfStock),   color: "#f43f5e", bg: c.dark ? "#1c0a10" : "#fff1f2", bdr: c.dark ? "#3a1520" : "#fecdd3", icon: "fa-solid fa-ban" },
    { label: "Expiring <60 days",value: String(stats.expiringSoon), color: "#f97316", bg: c.dark ? "#180a02" : "#fff7ed", bdr: c.dark ? "#2e1502" : "#fed7aa", icon: "fa-solid fa-clock" },
  ];

  const handleAdd = () => {
    if (!form.name || !form.stock || !form.expiryDate) return;
    const next: Drug = {
      id: `d-${Date.now()}`,
      name: form.name,
      genericName: form.genericName,
      category: form.category,
      unit: form.unit,
      stock: Number(form.stock),
      reorderLevel: Number(form.reorderLevel) || 20,
      expiryDate: form.expiryDate,
      costPrice: Number(form.costPrice) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      supplier: form.supplier,
    };
    setDrugs((prev) => [next, ...prev]);
    setForm({ name: "", genericName: "", category: CATEGORIES[0], unit: "Tablet", stock: "", reorderLevel: "", expiryDate: "", costPrice: "", sellingPrice: "", supplier: SUPPLIERS[0] });
    setShowModal(false);
  };

  const inp = {
    height: 36, width: "100%", borderRadius: 8, border: `1px solid ${c.border}`,
    background: c.alt, padding: "0 10px", color: c.ink, fontSize: 13,
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Healthcare</p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: c.ink }}>Pharmacy</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> Add Drug
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }} className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} style={{ padding: "13px 15px", borderRadius: 10, border: `1px solid ${k.bdr}`, background: k.bg }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</span>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${k.color}18`, color: k.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                <i className={k.icon} />
              </div>
            </div>
            <div style={{ fontSize: "clamp(13px,1.8vw,17px)", fontWeight: 800, color: c.ink }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: c.muted, pointerEvents: "none" }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search drug name, generic…"
            style={{ ...inp, paddingLeft: 30 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = c.border)}
          />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} style={{ ...inp, width: "auto", minWidth: 140 }}>
          <option value="">All categories</option>
          {CATEGORIES.map((c2) => <option key={c2}>{c2}</option>)}
        </select>
        <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }} style={{ ...inp, width: "auto", minWidth: 140 }}>
          <option value="">All stock status</option>
          {["In Stock", "Low Stock", "Out of Stock", "Expiring Soon"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setSearch(""); setCategoryFilter(""); setStockFilter(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
      </div>

      {/* Drug list */}
      {paged.items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: c.muted, fontSize: 13 }}>No drugs match your search.</div>
      ) : (
        <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, overflow: "hidden" }}>
          {paged.items.map((d, i) => {
            const isLast = i === paged.items.length - 1;
            const statusColor = STATUS_COLORS[d.computedStatus] as string;
            const isAlert = d.computedStatus !== "In Stock";
            return (
              <div
                key={d.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: isLast ? "none" : `1px solid ${c.border}`, transition: "background 0.12s", borderLeft: isAlert ? `3px solid ${statusColor}` : "3px solid transparent" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = c.alt)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{d.name}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4, background: c.alt, border: `1px solid ${c.border}`, fontSize: 9.5, fontWeight: 700, color: c.muted }}>{d.category}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, height: 16, padding: "0 6px", borderRadius: 4, background: `${statusColor}18`, color: statusColor, fontSize: 9.5, fontWeight: 700, textTransform: "uppercase" }}>
                      {isAlert && <AlertTriangle size={9} />}{d.computedStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{d.genericName} · {d.supplier}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 12, flexWrap: "wrap" }}>
                    <span style={{ color: c.ink }}><strong>{d.stock}</strong> {d.unit}</span>
                    <span style={{ color: c.muted }}>Reorder at {d.reorderLevel}</span>
                    <span style={{ color: c.muted }}>Expires: {d.expiryDate}</span>
                    <span style={{ color: c.ink }}>ETB {d.sellingPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock value footer */}
      <div style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.alt, fontSize: 12, color: c.muted, display: "flex", justifyContent: "space-between" }}>
        <span>Total stock value</span>
        <strong style={{ color: c.ink }}>ETB {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
      </div>

      <Pager page={paged.page} totalPages={paged.totalPages} total={filtered.length} onPage={setPage} />

      <Modal title="Add Drug to Pharmacy" isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Brand Name *<input style={inp} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Metformin 500mg" /></label>
            <label style={lbl(c)}>Generic Name<input style={inp} value={form.genericName} onChange={(e) => setForm((f) => ({ ...f, genericName: e.target.value }))} placeholder="e.g. Metformin HCl" /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Category<select style={inp} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>{CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}</select></label>
            <label style={lbl(c)}>Unit<input style={inp} value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="Tablet / Vial / Inhaler" /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Opening Stock *<input type="number" min="0" style={inp} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} /></label>
            <label style={lbl(c)}>Reorder Level<input type="number" min="0" style={inp} value={form.reorderLevel} onChange={(e) => setForm((f) => ({ ...f, reorderLevel: e.target.value }))} /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Cost Price (ETB)<input type="number" min="0" style={inp} value={form.costPrice} onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value }))} /></label>
            <label style={lbl(c)}>Selling Price (ETB)<input type="number" min="0" style={inp} value={form.sellingPrice} onChange={(e) => setForm((f) => ({ ...f, sellingPrice: e.target.value }))} /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={lbl(c)}>Expiry Date *<input type="date" style={inp} value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} /></label>
            <label style={lbl(c)}>Supplier<select style={inp} value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}>{SUPPLIERS.map((s) => <option key={s}>{s}</option>)}</select></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ height: 36, borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="button" onClick={handleAdd} style={{ height: 36, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Add Drug</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function lbl(c: ReturnType<typeof useColors>) {
  return { display: "flex" as const, flexDirection: "column" as const, gap: 4, fontSize: 12, fontWeight: 600, color: c.muted };
}
