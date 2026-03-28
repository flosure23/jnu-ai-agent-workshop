import { Entry } from "./types";
import { mockEntries, mockCurrentUser } from "./mockData";

let entries: Entry[] = [...mockEntries];
let nextId = 11;
const listeners: Set<() => void> = new Set();

/** Cached sorted list for useSyncExternalStore — must be referentially stable until data changes. */
let entriesSnapshot: Entry[] | null = null;

function invalidateEntriesSnapshot() {
  entriesSnapshot = null;
}

function notify() {
  invalidateEntriesSnapshot();
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getEntries(): Entry[] {
  if (entriesSnapshot === null) {
    entriesSnapshot = [...entries].sort((a, b) =>
      b.date > a.date ? 1 : b.date < a.date ? -1 : 0,
    );
  }
  return entriesSnapshot;
}

export function getEntryById(id: string): Entry | undefined {
  return entries.find((e) => e.id === id);
}

export function addEntry(data: { title: string; content: string; date: string }): Entry {
  const entry: Entry = {
    id: `entry-${String(nextId++).padStart(3, "0")}`,
    user_id: mockCurrentUser.id,
    title: data.title,
    content: data.content,
    date: data.date,
    created_at: new Date().toISOString(),
  };
  entries = [entry, ...entries];
  notify();
  return entry;
}

export function updateEntry(
  id: string,
  data: { title: string; content: string; date: string },
): Entry | null {
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entries[idx] = { ...entries[idx], ...data };
  entries = [...entries];
  notify();
  return entries[idx];
}

export function deleteEntry(id: string): boolean {
  const before = entries.length;
  entries = entries.filter((e) => e.id !== id);
  if (entries.length < before) {
    notify();
    return true;
  }
  return false;
}
