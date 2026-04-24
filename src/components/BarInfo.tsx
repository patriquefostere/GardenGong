export function BarInfo({
  bar,
  freq,
}: {
  bar: { id: number; length: number };
  freq: number;
}) {
  return (
    <span className="text-xs text-zinc-400">
      Length: {Math.round(bar.length)} px · Frequency: {freq.toFixed(1)} Hz
    </span>
  );
}
