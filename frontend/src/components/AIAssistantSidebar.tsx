"use client";

import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Trash2, Bot, Building2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAiAssistant, sendAiMessage, receiveAiReply, clearAiChat } from "@/store/slices/uiSlice";
import { SECTORS_CATALOG } from "@/store/initialData";
import type { Transaction, Employee } from "@/types/erp";

export function AIAssistantSidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAiAssistantOpen);
  const messages = useAppSelector((state) => state.ui.aiMessages);
  const activeSectorId = useAppSelector((state) => state.sectors.activeSectorId);
  const transactions: Transaction[] = useAppSelector((state) => state.transactions.items);
  const employees: Employee[] = useAppSelector((state) => state.employees.items);
  const deals = useAppSelector((state) => state.crm.deals);
  const companyName = useAppSelector((state) => state.auth.user?.companyName ?? "Beyond ERP Enterprise");

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSector = SECTORS_CATALOG.find((s) => s.id === activeSectorId) || SECTORS_CATALOG[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Calculate live numbers for AI context
  const totalIncome = transactions
    .filter((t: Transaction) => t.type === "INCOME")
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t: Transaction) => t.type === "EXPENSE")
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const totalVat = transactions.reduce((sum: number, t: Transaction) => sum + (t.vatAmount || 0), 0);
  const totalPayroll = employees.reduce((sum: number, e: Employee) => sum + e.salary, 0);
  const employeePension = totalPayroll * 0.07;
  const employerPension = totalPayroll * 0.11;
  const totalPipeline = deals.reduce((sum, d) => sum + d.valueETB, 0);

  const generateReply = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes("vat") || q.includes("tax") || q.includes("erca")) {
      return `📊 **ERCA 15% VAT Analysis for ${companyName}**:
• Total Standard-Rated Supplies (Income): **${totalIncome.toLocaleString()} ETB**
• Estimated Output VAT Collected (15%): **${(totalIncome * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB**
• Total Input VAT on Purchases: **${totalVat.toLocaleString()} ETB**
• **Net VAT Payable to ERCA**: **${Math.max(0, totalIncome * 0.15 - totalVat).toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB**
*Note: Due on the 30th day following the Ethiopian fiscal month. Exempt supplies apply to specified medical/agricultural inputs.*`;
    }

    if (q.includes("profit") || q.includes("margin") || q.includes("revenue") || q.includes("financial")) {
      const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0.0";
      return `📈 **Executive Financial Summary**:
• Gross Revenue: **${totalIncome.toLocaleString()} ETB**
• Total Operating Expenses: **${totalExpense.toLocaleString()} ETB**
• Net Operating Profit: **${netProfit.toLocaleString()} ETB**
• Net Profit Margin: **${margin}%**
• Status: Healthy liquidity across CBE and Telebirr merchant accounts with positive operational cash flow.`;
    }

    if (q.includes("pension") || q.includes("payroll") || q.includes("salary") || q.includes("labor")) {
      return `👥 **Ethiopian Labor & Pension Breakdown**:
• Active Headcount: **${employees.length} employees**
• Monthly Gross Payroll: **${totalPayroll.toLocaleString()} ETB**
• Mandatory Employee Pension (7%): **${employeePension.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB**
• Mandatory Employer Contribution (11%): **${employerPension.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB**
• Total Social Security Obligation (18%): **${(employeePension + employerPension).toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB**
*All Ethiopian tax brackets (0% up to 600 ETB, scaling to 35% above 10,900 ETB) are pre-calculated.*`;
    }

    if (q.includes("crm") || q.includes("pipeline") || q.includes("deal") || q.includes("sales")) {
      const wonDeals = deals.filter((d) => d.stage === "WON");
      return `💼 **CRM Sales Pipeline (${activeSector.name})**:
• Total Pipeline Value: **${totalPipeline.toLocaleString()} ETB**
• Active Opportunities: **${deals.length} deals**
• Closed Won Revenue: **${wonDeals.reduce((sum, d) => sum + d.valueETB, 0).toLocaleString()} ETB**
• Top Opportunity: **${deals[0]?.title || "N/A"}** valued at **${deals[0]?.valueETB?.toLocaleString() || 0} ETB** (${deals[0]?.company || ""}).`;
    }

    if (q.includes("sector") || q.includes("industry") || q.includes("selam") || q.includes("merkato")) {
      return `🏢 **Active Sector: ${activeSector.name}**:
• Workspace: **${companyName}**
• TIN: **${activeSector.defaultTin}**
• Core Modules: **${activeSector.keyModules.join(", ")}**
• Features enabled: ERCA 15% VAT compliance, Telebirr merchant QR collections, offline-first sync ledger.`;
    }

    return `I have reviewed your inquiry regarding **${companyName}** in the **${activeSector.name}** sector. 
Your current in-memory ledger shows **${transactions.length} transactions**, **${employees.length} staff members**, and a CRM pipeline of **${totalPipeline.toLocaleString()} ETB**.
You can ask me to calculate ERCA 15% VAT liability, analyze profit margins, inspect pension brackets, or review deals!`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    dispatch(sendAiMessage(text));
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(text);
      dispatch(receiveAiReply(reply));
      setIsTyping(false);
    }, 450);
  };

  const promptChips = [
    "Calculate my ERCA 15% VAT liability for this month",
    "Summarize net profit and operating margins",
    "How do Ethiopian pension brackets affect this payroll?",
    "Show top revenue opportunities in CRM pipeline",
  ];

  return (
    <>
      <style>{`
        @keyframes slideInDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .ai-drawer-enter {
          animation: slideInDrawer 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Scrim Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(9, 13, 22, 0.5)",
          zIndex: 9998,
        }}
        onClick={() => dispatch(closeAiAssistant())}
      />

      {/* Drawer */}
      <div
        className="ai-drawer-enter"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(440px, 94vw)",
          backgroundColor: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-line)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          color: "var(--text-primary)",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border-line)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--accent-blue)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: "20px" }}>
                Beyond AI Assistant
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span className="status-dot positive" />
                <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: "16px" }}>
                  Online · Active Context
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              onClick={() => dispatch(clearAiChat())}
              title="Clear chat history"
              className="icon-button"
              type="button"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={() => dispatch(closeAiAssistant())}
              aria-label="Close"
              className="icon-button"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Sector context banner (2-column key/value list) */}
        <div
          style={{
            padding: "8px 20px",
            borderBottom: "1px solid var(--border-line)",
            backgroundColor: "var(--bg-canvas)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Workspace
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {companyName} ({activeSector.shortName})
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              TIN
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
              {activeSector.defaultTin}
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((m) => {
            const isAi = m.sender === "ai";
            if (!isAi) {
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "88%",
                    backgroundColor: "var(--accent-blue)",
                    color: "#ffffff",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    lineHeight: "20px",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              );
            }

            // AI message - text directly on the surface, no box
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                  maxWidth: "96%",
                }}
              >
                <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}>
                  <Bot size={16} />
                </div>
                <div
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 13,
                    lineHeight: "20px",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <Bot size={16} />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                Calculating Ethiopian tax &amp; sector ledger...
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid var(--border-line)",
            backgroundColor: "var(--bg-canvas)",
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              type="button"
              className="chip"
              style={{
                height: 28,
                padding: "0 10px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                flexShrink: 0,
                textTransform: "none",
                fontSize: 12,
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Composer Input area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-line)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about ERCA VAT, payroll pension, CRM deals..."
            style={{
              flex: 1,
              height: 36,
              padding: "0 12px",
              borderRadius: 6,
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-line)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-line)")}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            type="button"
            className="primary-button"
            style={{
              height: 36,
              padding: "0 12px",
              opacity: input.trim() ? 1 : 0.4,
              cursor: input.trim() ? "pointer" : "not-allowed",
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
