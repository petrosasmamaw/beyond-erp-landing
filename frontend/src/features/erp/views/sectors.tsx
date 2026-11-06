"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Barcode, BriefcaseBusiness, Check, ChevronRight, Plus, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, getInitials } from "@/lib/format";
import type { DomainWorkflow, Sector, TeamMember } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { iconMap, sectorWorkflowTemplates, t } from "../config";
import { useApp } from "@/contexts/AppContext";

export function SectorsView({
  sectors,
  language = "English"
}: {
  sectors: Sector[];
  language?: string;
}) {
  const router = useRouter();
  const { openTransactionModal, openAdminModal } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            12 {t("sectors", language)}
          </p>
          <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: "28px" }}>
            {t("sectors", language)}
          </h2>
        </div>
        <button
          className="icon-button"
          onClick={() => openTransactionModal()}
          aria-label="Add transaction"
          type="button"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Sectors Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {sectors.map((sector) => {
          const Icon = iconMap[sector.icon as keyof typeof iconMap] ?? BriefcaseBusiness;
          return (
            <div
              key={sector.id}
              onClick={() => router.push(`/sectors/${sector.id}`)}
              className="ui-surface"
              style={{
                padding: 16,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      {sector.name}
                    </h3>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button
                    className="icon-button"
                    onClick={(e) => { e.stopPropagation(); openAdminModal(sector); }}
                    aria-label={`Add admin to ${sector.name}`}
                    type="button"
                  >
                    <UserPlus size={14} />
                  </button>
                  <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: "16px" }}>
                {sector.description}
              </p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
                <span className="chip">{sector.features.length} features</span>
                <span className="chip">{sector.teamMembers.length} members</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SectorDetail({
  sector,
  language = "English"
}: {
  sector: Sector;
  language?: string;
}) {
  const router = useRouter();
  const {
    openAdminModal, openManagerModal, openTransactionModal,
    openWorkItemModal, openSectorRecordModal, openDomainWorkflowModal,
    openBarcodeModal, openConfirmModal, showToast, triggerRefresh, refreshTrigger: _rt
  } = useApp();
  void _rt;

  const Icon = iconMap[sector.icon as keyof typeof iconMap] ?? BriefcaseBusiness;
  const admins = sector.teamMembers.filter((m) => m.type === "ADMIN");
  const managers = sector.teamMembers.filter((m) => m.type === "MANAGER");
  const templates = sectorWorkflowTemplates[sector.id] ?? [];
  const [domainWorkflows, setDomainWorkflows] = useState<DomainWorkflow[]>([]);

  useEffect(() => {
    api.domainWorkflows(sector.id)
      .then((r) => setDomainWorkflows(r.workflows))
      .catch(() => setDomainWorkflows([]));
  }, [sector.id]);

  const removeMember = (member: TeamMember) => {
    openConfirmModal(`Remove ${member.fullName} from this sector?`, async () => {
      await api.deleteTeamMember(member.id);
      showToast("Member removed");
      triggerRefresh();
    });
  };

  const sectorRevenue = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top back button */}
      <div>
        <button
          type="button"
          onClick={() => router.push("/sectors")}
          className="secondary-button"
          style={{ height: 32, padding: "0 10px", gap: 6, fontSize: 12 }}
        >
          <ArrowLeft size={14} />
          Sectors
        </button>
      </div>

      {/* Sector Hero */}
      <div
        className="ui-surface"
        style={{
          padding: 20,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}>
            <Icon size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: "28px" }}>
              {sector.name}
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: "20px", maxWidth: 640 }}>
              {sector.description}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button className="primary-button" onClick={() => openAdminModal(sector)} style={{ height: 36, padding: "0 14px" }}>
            <ShieldCheck size={14} />
            {t("manageAdmins", language)}
          </button>
          <button className="secondary-button" onClick={() => openTransactionModal()} style={{ height: 36, padding: "0 14px" }}>
            <Plus size={14} />
            {t("addTransaction", language)}
          </button>
          {sector.id === "retail-trading" && (
            <button className="secondary-button" onClick={openBarcodeModal} style={{ height: 36, padding: "0 14px" }}>
              <Barcode size={14} />
              Generate Barcode
            </button>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="kpi-cell">
          <span className="kpi-label">{t("activeTask", language)}</span>
          <span className="kpi-value">{String(sector.workItems?.filter((i) => i.status !== "DONE").length ?? 0)}</span>
        </div>
        <div className="kpi-cell" style={{ borderLeft: "1px solid var(--border-line)" }}>
          <span className="kpi-label">{t("sectorRevenue", language)}</span>
          <span className="kpi-value">{sectorRevenue > 0 ? formatCurrency(sectorRevenue) : "ETB 0"}</span>
        </div>
        <div className="kpi-cell" style={{ borderLeft: "1px solid var(--border-line)" }}>
          <span className="kpi-label">{t("pendingRecords", language)}</span>
          <span className="kpi-value">{String(sector.sectorRecords?.filter((r) => r.status === "PENDING").length ?? 0)}</span>
        </div>
      </div>

      {/* Tasks section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {t("workflow", language)}
            </p>
            <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              {sector.workItems?.length ?? 0} {t("activeTask", language).toLowerCase()}
            </h3>
          </div>
          <button className="icon-button" onClick={() => openWorkItemModal(sector)} aria-label="Add task" type="button">
            <Plus size={16} />
          </button>
        </div>

        <div className="ui-surface" style={{ display: "flex", flexDirection: "column" }}>
          {(sector.workItems ?? []).length === 0 ? (
            <div style={{ padding: "32px 16px" }}>
              <EmptyState title="No sector tasks yet" action="Add Task" onAction={() => openWorkItemModal(sector)} />
            </div>
          ) : (
            sector.workItems?.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: idx === (sector.workItems?.length ?? 0) - 1 ? "none" : "1px solid var(--border-line)",
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{item.title}</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>{item.description ?? "Sector workflow item"}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="chip">{item.status.toLowerCase().replace(/_/g, " ")}</span>
                  <span className="chip" style={{ color: item.priority === "HIGH" || item.priority === "URGENT" ? "var(--negative)" : "var(--text-secondary)" }}>
                    {item.priority.toLowerCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sector Records Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Sector Records
            </p>
            <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              {sector.sectorRecords?.length ?? 0} module records
            </h3>
          </div>
          <button className="icon-button" onClick={() => openSectorRecordModal(sector)} aria-label="Add record" type="button">
            <Plus size={16} />
          </button>
        </div>

        {/* Templates row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {templates.map((template) => (
            <button
              key={template.recordType}
              type="button"
              className="chip"
              style={{ height: 28, padding: "0 12px", cursor: "pointer", textTransform: "none", fontSize: 12 }}
              onClick={() => openSectorRecordModal(sector, template)}
            >
              {template.recordType}
            </button>
          ))}
        </div>

        {/* Domain workflows */}
        {domainWorkflows.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
            {domainWorkflows.map((workflow) => (
              <button
                key={workflow.key}
                type="button"
                className="ui-surface"
                onClick={() => openDomainWorkflowModal(sector, workflow)}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <strong style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{workflow.recordType}</strong>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{workflow.description}</span>
              </button>
            ))}
          </div>
        )}

        {/* Compact List */}
        <div className="ui-surface" style={{ display: "flex", flexDirection: "column" }}>
          {(sector.sectorRecords ?? []).length === 0 ? (
            <div style={{ padding: "32px 16px" }}>
              <EmptyState title="No module records yet" action="Add Record" onAction={() => openSectorRecordModal(sector)} />
            </div>
          ) : (
            sector.sectorRecords?.slice(0, 6).map((record, idx) => (
              <div
                key={record.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 16px",
                  borderBottom: idx === Math.min((sector.sectorRecords?.length ?? 0), 6) - 1 ? "none" : "1px solid var(--border-line)",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{record.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{record.recordType} - {record.ownerName ?? "Unassigned"}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {record.value ? <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(record.value)}</span> : null}
                  <span className="chip">{record.status.toLowerCase()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Operational modules features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {t("features", language)}
        </p>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
          Operational modules
        </h3>
        <div
          className="ui-surface"
          style={{
            padding: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 10,
          }}
        >
          {sector.features.map((feature) => (
            <div key={feature} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-primary)" }}>
              <Check size={14} style={{ color: "var(--positive)", flexShrink: 0 }} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Team
            </p>
            <h3 style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              {sector.teamMembers.length} members
            </h3>
          </div>
          <button className="icon-button" onClick={() => openManagerModal(sector)} aria-label="Add manager" type="button">
            <UserPlus size={16} />
          </button>
        </div>

        <div className="ui-surface" style={{ display: "flex", flexDirection: "column" }}>
          {sector.teamMembers.length === 0 ? (
            <div style={{ padding: "32px 16px" }}>
              <EmptyState title="No members added yet" action="Add Manager" onAction={() => openManagerModal(sector)} />
            </div>
          ) : (
            [...admins, ...managers].map((member, idx) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 16px",
                  borderBottom: idx === (admins.length + managers.length - 1) ? "none" : "1px solid var(--border-line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--bg-subtle)",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(member.fullName)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{member.fullName}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{member.department ?? member.contact ?? "Team member"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="chip">{member.type.toLowerCase()}</span>
                  <button className="icon-button" onClick={() => removeMember(member)} aria-label="Remove" type="button">
                    <Trash2 size={14} style={{ color: "var(--negative)" }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
