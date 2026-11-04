export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>404 - Page Not Found</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px" }}>The page you are looking for does not exist or has been moved.</p>
      <a href="/dashboard" style={{ background: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
        Return to Dashboard
      </a>
    </div>
  );
}
