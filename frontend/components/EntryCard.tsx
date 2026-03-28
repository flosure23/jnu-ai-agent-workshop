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
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{entry.title}</h2>
        <time className="text-sm text-gray-400 shrink-0">{entry.date}</time>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{preview}</p>
    </Link>
  );
}
