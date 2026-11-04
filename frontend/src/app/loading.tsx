export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      fontFamily: "var(--font-sans), sans-serif",
      color: "#0f172a"
    }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid #e2e8f0",
          borderTopColor: "#2563eb",
          animation: "spin 0.8s linear infinite"
        }} />
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>BeyondERP</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Loading your workspace...</p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
