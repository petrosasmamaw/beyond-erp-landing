"use client";

import { type ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus } from "lucide-react";

type StatDef = { label: string; value?: number | string };

type ModulePageProps = {
  title: string;
  icon: string;
  color?: string;
  description: string;
  stats: StatDef[];
  emptyMessage?: string;
  addLabel?: string;
  onAdd?: () => void;
  children?: ReactNode;
};

export function ModulePage({
  title,
  icon,
  description,
  stats,
  emptyMessage,
  addLabel,
  onAdd,
  children,
}: ModulePageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            <i className={icon} />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                lineHeight: "28px",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: "20px",
                maxWidth: 640,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {addLabel && onAdd ? (
          <button className="primary-button" type="button" onClick={onAdd} style={{ height: 36, padding: "0 16px" }}>
            <Plus size={14} style={{ marginRight: 6 }} />
            {addLabel}
          </button>
        ) : null}
      </div>

      {/* KPI Strip */}
      {stats && stats.length > 0 && (
        <div
          className="kpi-strip"
          style={{
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          }}
        >
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className="kpi-cell"
              style={{
                borderLeft: idx === 0 ? "none" : "1px solid var(--border-line)",
              }}
            >
              <span className="kpi-label">{s.label}</span>
              <span className="kpi-value">{s.value ?? 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {children ?? (
        <EmptyState
          title={emptyMessage ?? `No ${title.toLowerCase()} records yet`}
          action="Records will appear here once added"
        />
      )}
    </div>
  );
}
