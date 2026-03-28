import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type EntryRow = Database["public"]["Tables"]["entries"]["Row"];

export const ENTRIES_PAGE_SIZE = 10;

/** PostgREST ilike 패턴용: % _ \ 이스케이프 */
export function escapeIlike(pattern: string): string {
  return pattern.replace(/[%_\\]/g, "\\$&");
}

export async function fetchEntriesPage(
  supabase: SupabaseClient<Database>,
  userId: string,
  page: number,
  search: string,
): Promise<{ rows: EntryRow[]; total: number; error: Error | null }> {
  const from = (page - 1) * ENTRIES_PAGE_SIZE;
  const to = from + ENTRIES_PAGE_SIZE - 1;

  let q = supabase
    .from("entries")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("date", { ascending: false });

  const term = search.trim().replace(/,/g, " ");
  if (term.length > 0) {
    const e = escapeIlike(term);
    q = q.or(`title.ilike.%${e}%,content.ilike.%${e}%`);
  }

  const { data, error, count } = await q.range(from, to);

  if (error) {
    return { rows: [], total: 0, error: new Error(error.message) };
  }

  return { rows: data ?? [], total: count ?? 0, error: null };
}

export async function fetchEntryById(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
): Promise<{ row: EntryRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { row: null, error: new Error(error.message) };
  }

  return { row: data, error: null };
}
