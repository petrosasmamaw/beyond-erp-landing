"use client";

import { type ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";


type StatDef = { label: string; value?: number | string };

type ModulePageProps = {
  title: string;
  icon: string;
  color: string;
  description: string;
  stats: StatDef[];
  emptyMessage?: string;
  addLabel?: string;
  onAdd?: () => void;
  children?: ReactNode;
};

export function ModulePage({
  title, icon, color, description, stats,
  emptyMessage, addLabel, onAdd, children
}: ModulePageProps) {
  return (
    <div className="screen-wrapper">
      <div className="section-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="sector-pick-icon"
            style={{ background: color + "18", color, flexShrink: 0, width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
          >
            <i className={icon} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <p className="subtle" style={{ margin: 0 }}>{description}</p>
          </div>
        </div>
        {addLabel && onAdd ? (
          <button className="primary-button" type="button" onClick={onAdd}>
            <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />{addLabel}
          </button>
        ) : null}
      </div>

      <div className="stats-row">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span>{s.label}</span>
            <strong>{s.value ?? 0}</strong>
          </div>
        ))}
      </div>

      {children ?? (
        <EmptyState
          title={emptyMessage ?? `No ${title.toLowerCase()} records yet`}
          action="Records will appear here once added"
        />
      )}
    </div>
  );
}
