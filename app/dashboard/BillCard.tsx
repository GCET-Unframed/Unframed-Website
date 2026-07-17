import type { ScoredBill } from "@/types/bills";

const STATUS_LABELS: Record<ScoredBill["status"], string> = {
  introduced: "Introduced",
  in_committee: "In Committee",
  passed_chamber: "Passed Chamber",
  signed_into_law: "Signed into Law",
  vetoed: "Vetoed",
  failed: "Failed",
  unknown: "Status Unknown",
};

function formatDate(iso: string | null): string {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BillCard({
  bill,
  saved,
  onSave,
  onDismiss,
}: {
  bill: ScoredBill;
  saved: boolean;
  onSave: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-2xl border border-stone/15 bg-white/70 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-stone">
            {bill.billNumber} · {bill.scope === "state" ? bill.state : "Federal"}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold leading-snug tracking-tight">
            {bill.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-royal-soft px-3 py-1 text-xs font-semibold text-royal-deep">
          {STATUS_LABELS[bill.status]}
        </span>
      </div>

      <p className="mt-3 text-base leading-relaxed text-charcoal">{bill.summary}</p>

      <p className="mt-3 text-sm font-semibold text-orange-deep">{bill.relevanceReason}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone">
        <div className="flex items-center gap-4">
          <span>Last updated {formatDate(bill.lastActionDate)}</span>
          <a
            href={bill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-royal hover:text-royal-deep"
          >
            Full bill text ↗
          </a>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              saved
                ? "bg-royal text-white"
                : "bg-white/70 text-stone hover:text-royal"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone hover:text-orange-deep"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
