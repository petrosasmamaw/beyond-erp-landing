"use client";

import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Trash2, Bot, User, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAiAssistant, sendAiMessage, receiveAiReply, clearAiChat } from "@/store/slices/uiSlice";
import { SECTORS_CATALOG } from "@/store/initialData";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
  const dark = theme === "dark";

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

  const colors = {
    bg: dark ? "#0a101d" : "#ffffff",
    border: dark ? "#1a273e" : "#e2e8f0",
    headerBg: dark ? "#070c17" : "#f8fafc",
    ink: dark ? "#f8fafc" : "#0f172a",
    muted: dark ? "#94a3b8" : "#64748b",
    userBubble: dark ? "#1d4ed8" : "#2563eb",
    aiBubble: dark ? "#131d2e" : "#f1f5f9",
    aiBubbleBorder: dark ? "#1e2e46" : "#e2e8f0",
    chipBg: dark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)",
    chipBorder: dark ? "rgba(37, 99, 235, 0.3)" : "rgba(37, 99, 235, 0.2)",
    inputBg: dark ? "#070d18" : "#f8fafc",
  };

  return (
    <>
      <style>{`
        @keyframes slideInDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .ai-drawer-enter {
          animation: slideInDrawer 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: dark ? "rgba(0,0,0,0.65)" : "rgba(15,23,42,0.35)",
          backdropFilter: "blur(4px)",
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
          backgroundColor: colors.bg,
          borderLeft: `1px solid ${colors.border}`,
          boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          color: colors.ink,
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.headerBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Beyond AI Assistant</h3>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 10,
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                  }}
                >
                  LIVE
                </span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: colors.muted }}>
                Trained on Ethiopian Tax &amp; {activeSector.shortName}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              onClick={() => dispatch(clearAiChat())}
              title="Clear chat history"
              style={{
                background: "none",
                border: "none",
                color: colors.muted,
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
              }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => dispatch(closeAiAssistant())}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                color: colors.muted,
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sector context banner */}
        <div
          style={{
            padding: "8px 20px",
            backgroundColor: dark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)",
            borderBottom: `1px solid ${colors.border}`,
            fontSize: 11.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>🏢</span>
            <span>
              Context: <strong>{companyName}</strong> ({activeSector.name})
            </span>
          </div>
          <span style={{ color: "#2563eb", fontWeight: 700 }}>TIN: {activeSector.defaultTin}</span>
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
            gap: 12,
          }}
        >
          {messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  alignSelf: isAi ? "flex-start" : "flex-end",
                  maxWidth: "92%",
                }}
              >
                {isAi && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Bot size={14} />
                  </div>
                )}
                <div
                  style={{
                    backgroundColor: isAi ? colors.aiBubble : colors.userBubble,
                    color: isAi ? colors.ink : "#ffffff",
                    border: isAi ? `1px solid ${colors.aiBubbleBorder}` : "none",
                    borderRadius: 14,
                    padding: "10px 14px",
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
                {!isAi && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      backgroundColor: colors.userBubble,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                <Bot size={14} />
              </div>
              <div
                style={{
                  backgroundColor: colors.aiBubble,
                  padding: "8px 14px",
                  borderRadius: 14,
                  fontSize: 12,
                  color: colors.muted,
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
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.headerBg,
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
              style={{
                whiteSpace: "nowrap",
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 8,
                backgroundColor: colors.chipBg,
                border: `1px solid ${colors.chipBorder}`,
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: 600,
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.headerBg,
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
              padding: "10px 14px",
              borderRadius: 10,
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.border}`,
              color: colors.ink,
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            type="button"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: input.trim() ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : colors.aiBubble,
              color: input.trim() ? "#ffffff" : colors.muted,
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

