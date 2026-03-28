import Link from "next/link";
import { Entry } from "@/lib/types";

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const preview =
    entry.content.length > 80 ? entry.content.slice(0, 80) + "…" : entry.content;

  return (
    <Link
      href={`/entries/${entry.id}`}
      className="block bg-surface rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-muted/60 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-lg font-semibold tracking-tight text-ink line-clamp-1">
          {entry.title}
        </h2>
        <time className="text-sm text-subtle tabular-nums shrink-0">{entry.date}</time>
      </div>
      <p className="text-sm leading-relaxed text-muted line-clamp-2">{preview}</p>
    </Link>
  );
}
