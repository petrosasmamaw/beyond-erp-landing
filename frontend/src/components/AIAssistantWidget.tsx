"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User, CheckCircle, RefreshCw } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Message {
  sender: "ai" | "user";
  text: string;
}

export function AIAssistantWidget({ sectorName }: { sectorName: string }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { showToast, triggerRefresh } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: `Hello! I'm your BeyondERP AI Assistant for ${sectorName}. I can answer questions, generate financial summaries, or write/update records (e.g. "Add a $1,500 revenue transaction for consulting"). How can I help?` }
  ]);

  const surface = dark ? "#111c2e" : "#ffffff";
  const bg = dark ? "#0b1120" : "#f8fafc";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#94a3b8" : "#64748b";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, currentData: { sector: sectorName } })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { sender: "ai", text: data.reply || "Done!" }]);

      if (data.action) {
        showToast(`AI executed action: ${data.action.type}`);
        triggerRefresh();
      }
    } catch {
      setMessages(prev => [...prev, { sender: "ai", text: "I encountered an error connecting to the AI assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isOpen ? 12 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb18", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: text, margin: 0 }}>BeyondERP AI Assistant (Read & Write)</h3>
            <p style={{ fontSize: 11, color: muted, margin: 0 }}>Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "6px 12px", borderRadius: 8, background: isOpen ? bg : "#2563eb",
            color: isOpen ? text : "#fff", border: isOpen ? `1px solid ${border}` : 0,
            fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}
        >
          {isOpen ? "Collapse" : "Open Copilot"}
        </button>
      </div>

      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${border}`, paddingTop: 12 }}>
          <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%"
                }}
              >
                {m.sender === "ai" && (
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Bot size={12} />
                  </div>
                )}
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: m.sender === "user" ? "#2563eb" : bg,
                    color: m.sender === "user" ? "#fff" : text,
                    fontSize: 12,
                    lineHeight: 1.4,
                    border: m.sender === "ai" ? `1px solid ${border}` : 0
                  }}
                >
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: muted, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={12} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: muted, fontStyle: "italic" }}>
                <RefreshCw size={12} className="animate-spin" /> AI is thinking & processing request...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder='Ask AI or give command (e.g., "Summarize revenue" or "Add $2000 invoice")'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                flex: 1, height: 36, borderRadius: 8, border: `1px solid ${border}`,
                background: bg, padding: "0 12px", color: text, fontSize: 13, outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 36, padding: "0 16px", borderRadius: 8, background: "#2563eb",
                color: "#fff", border: 0, fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <Send size={13} /> Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
