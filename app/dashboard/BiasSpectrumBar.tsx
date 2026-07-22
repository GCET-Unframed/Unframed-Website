import type { BiasDistribution } from "@/types/digest";

const SEGMENTS: { key: keyof BiasDistribution; label: string; barClass: string; dotClass: string }[] = [
  { key: "minimal", label: "Minimal", barClass: "bg-stone/25", dotClass: "bg-stone/40" },
  { key: "low", label: "Low", barClass: "bg-royal-soft", dotClass: "bg-royal-soft" },
  { key: "moderate", label: "Moderate", barClass: "bg-royal", dotClass: "bg-royal" },
  { key: "high", label: "High", barClass: "bg-orange", dotClass: "bg-orange" },
];

// Ellipsis measures bias-cue strength per dimension (minimal/low/moderate/high),
// not political direction — it deliberately doesn't classify left vs. right.
export default function BiasSpectrumBar({ distribution }: { distribution: BiasDistribution }) {
  const total = distribution.minimal + distribution.low + distribution.moderate + distribution.high;

  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-stone/10">
        {total > 0 &&
          SEGMENTS.map(({ key, barClass }) => {
            const pct = (distribution[key] / total) * 100;
            if (pct === 0) return null;
            return <div key={key} className={barClass} style={{ width: `${pct}%` }} />;
          })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone">
        {SEGMENTS.map(({ key, label, dotClass }) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${dotClass}`} />
            {label} {total === 0 ? "0%" : `${Math.round((distribution[key] / total) * 100)}%`}
          </span>
        ))}
      </div>
    </div>
  );
}
