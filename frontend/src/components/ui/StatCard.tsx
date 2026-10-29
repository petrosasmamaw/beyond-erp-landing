export function StatCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "green" | "red" | "gold";
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
