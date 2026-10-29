export function BarcodeDisplay({ value }: { value: string }) {
  const bars = value.split("").flatMap((char) => {
    const code = char.charCodeAt(0);
    return [
      { width: (code % 3) + 1, gap: true },
      { width: (code % 4) + 2, gap: false },
      { width: ((code >> 2) % 3) + 1, gap: true }
    ];
  });
  return (
    <div className="barcode-display">
      <div className="barcode-bars">
        {bars.map((bar, i) =>
          bar.gap ? null : <span key={i} style={{ width: `${bar.width * 3}px` }} />
        )}
      </div>
      <span className="barcode-number">{value}</span>
    </div>
  );
}
