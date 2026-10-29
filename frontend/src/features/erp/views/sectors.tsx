"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Barcode, BriefcaseBusiness, Check, ChevronRight, Plus, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, getInitials } from "@/lib/format";
import type { DomainWorkflow, Sector, TeamMember } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
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
    <div className="screen stack">
      <div className="section-title">
        <div>
          <p className="eyebrow">12 {t("sectors", language)}</p>
          <h2>{t("sectors", language)}</h2>
        </div>
        <button className="icon-button plain" onClick={() => openTransactionModal()} aria-label="Add transaction">
          <Plus size={18} />
        </button>
      </div>
      <div className="sector-list">
        {sectors.map((sector) => {
          const Icon = iconMap[sector.icon as keyof typeof iconMap] ?? BriefcaseBusiness;
          return (
            <article className="sector-card" key={sector.id} onClick={() => router.push(`/sectors/${sector.id}`)}>
              <div className="sector-icon" style={{ background: sector.lightColor, color: sector.textColor }}>
                <Icon size={22} />
              </div>
              <div>
                <h3>{sector.name}</h3>
                <p>{sector.description}</p>
                <div className="tiny-row">
                  <span>{sector.features.length} features</span>
                  <span>{sector.teamMembers.length} members</span>
                </div>
              </div>
              <button
                className="icon-button small"
                onClick={(e) => { e.stopPropagation(); openAdminModal(sector); }}
                aria-label={`Add admin to ${sector.name}`}
              >
                <UserPlus size={16} />
              </button>
              <ChevronRight size={18} />
            </article>
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
    <div className="screen stack">
      <button className="back-button" onClick={() => router.push("/sectors")}>
        <ArrowLeft size={18} />
        Sectors
      </button>
      <section className="sector-hero" style={{ background: sector.lightColor }}>
        <div className="sector-icon large" style={{ color: sector.textColor }}>
          <Icon size={32} />
        </div>
        <h2>{sector.name}</h2>
        <p>{sector.description}</p>
      </section>
      <div className="quick-actions">
        <button className="primary-button purple" onClick={() => openAdminModal(sector)}>
          <ShieldCheck size={18} />
          {t("manageAdmins", language)}
        </button>
        <button className="secondary-button" onClick={() => openTransactionModal()}>
          <Plus size={18} />
          {t("addTransaction", language)}
        </button>
        {sector.id === "retail-trading" ? (
          <button className="secondary-button compact" onClick={openBarcodeModal} style={{ gridColumn: "1 / -1" }}>
            <Barcode size={18} />
            Generate Barcode
          </button>
        ) : null}
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{t("workflow", language)}</p>
            <h2>{sector.workItems?.length ?? 0} {t("activeTask", language).toLowerCase()}</h2>
          </div>
          <button className="icon-button plain" onClick={() => openWorkItemModal(sector)} aria-label="Add task">
            <Plus size={18} />
          </button>
        </div>
        <div className="workflow-list">
          {(sector.workItems ?? []).length === 0 ? (
            <EmptyState title="No sector tasks yet" action="Add Task" onAction={() => openWorkItemModal(sector)} />
          ) : (
            sector.workItems?.map((item) => (
              <article className="workflow-card" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description ?? "Sector workflow item"}</p>
                </div>
                <span className="badge">{item.status.toLowerCase().replace("_", " ")}</span>
                <span className={`badge ${item.priority === "HIGH" || item.priority === "URGENT" ? "gold" : "green"}`}>
                  {item.priority.toLowerCase()}
                </span>
              </article>
            ))
          )}
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Sector Records</p>
            <h2>{sector.sectorRecords?.length ?? 0} module records</h2>
          </div>
          <button className="icon-button plain" onClick={() => openSectorRecordModal(sector)} aria-label="Add record">
            <Plus size={18} />
          </button>
        </div>
        <div className="template-grid">
          {templates.map((template) => (
            <button className="secondary-button compact" key={template.recordType} onClick={() => openSectorRecordModal(sector, template)}>
              {template.recordType}
            </button>
          ))}
        </div>
        <div className="domain-grid">
          {domainWorkflows.map((workflow) => (
            <button className="domain-button" key={workflow.key} onClick={() => openDomainWorkflowModal(sector, workflow)}>
              <strong>{workflow.recordType}</strong>
              <span>{workflow.description}</span>
            </button>
          ))}
        </div>
        <div className="compact-list">
          {(sector.sectorRecords ?? []).length === 0 ? (
            <EmptyState title="No module records yet" action="Add Record" onAction={() => openSectorRecordModal(sector)} />
          ) : (
            sector.sectorRecords?.slice(0, 6).map((record) => (
              <article className="compact-row" key={record.id}>
                <div>
                  <strong>{record.title}</strong>
                  <span>{record.recordType} - {record.ownerName ?? "Unassigned"}</span>
                </div>
                {record.value ? <b>{formatCurrency(record.value)}</b> : null}
                <span className="badge green">{record.status.toLowerCase()}</span>
              </article>
            ))
          )}
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{t("features", language)}</p>
            <h2>Operational modules</h2>
          </div>
          <Check size={20} />
        </div>
        <div className="feature-grid">
          {sector.features.map((feature) => (
            <span key={feature}><Check size={14} />{feature}</span>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Team</p>
            <h2>{sector.teamMembers.length} members</h2>
          </div>
          <button className="icon-button plain" onClick={() => openManagerModal(sector)} aria-label="Add manager">
            <UserPlus size={18} />
          </button>
        </div>
        {sector.teamMembers.length === 0 ? (
          <EmptyState title="No members added yet" action="Add Manager" onAction={() => openManagerModal(sector)} />
        ) : (
          <div className="member-list">
            {[...admins, ...managers].map((member) => (
              <article className={`member-card ${member.type === "ADMIN" ? "admin" : "manager"}`} key={member.id}>
                <div className="avatar">{getInitials(member.fullName)}</div>
                <div>
                  <h3>{member.fullName}</h3>
                  <p>{member.department ?? member.contact ?? "Team member"}</p>
                </div>
                <span className="badge">{member.type.toLowerCase()}</span>
                <button className="icon-button small danger" onClick={() => removeMember(member)} aria-label="Remove">
                  <Trash2 size={15} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="stat-grid three">
        <StatCard label={t("activeTask", language)} value={String(sector.workItems?.filter((i) => i.status !== "DONE").length ?? 0)} tone="green" />
        <StatCard label={t("sectorRevenue", language)} value={sectorRevenue > 0 ? formatCurrency(sectorRevenue) : "ETB 0"} tone="gold" />
        <StatCard label={t("pendingRecords", language)} value={String(sector.sectorRecords?.filter((r) => r.status === "PENDING").length ?? 0)} tone="red" />
      </section>
    </div>
  );
}
