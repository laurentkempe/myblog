import type { CollectionEntry, DataEntryMap } from 'astro:content';

export function getLatestEntries<T extends keyof DataEntryMap>(
  entries: CollectionEntry<T>[],
  limit: number = 8
): CollectionEntry<T>[] {
  return entries
    .sort((a, b) => 
      new Date(b.data.date as Date).getTime() - new Date(a.data.date as Date).getTime()
    )
    .slice(0, limit);
}