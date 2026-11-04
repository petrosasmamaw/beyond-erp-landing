export default function AppLoading() {
  return (
    <div style={{
      flex: 1,
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      fontFamily: "var(--font-sans), sans-serif",
    }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid rgba(37,99,235,0.2)",
          borderTopColor: "#2563eb",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600, margin: 0 }}>Loading dashboard modules...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
