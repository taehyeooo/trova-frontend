import type { SavedPlace } from "@/lib/types";

export function groupBySourceUrl(places: SavedPlace[]): Map<string, SavedPlace[]> {
  const groups = new Map<string, SavedPlace[]>();
  for (const place of places) {
    const existing = groups.get(place.sourceUrl) ?? [];
    existing.push(place);
    groups.set(place.sourceUrl, existing);
  }
  return groups;
}

export function isItineraryGroup(places: SavedPlace[]): boolean {
  return places.some((place) => place.dayNumber !== null);
}

export function groupByDay(places: SavedPlace[]): Map<number, SavedPlace[]> {
  const days = new Map<number, SavedPlace[]>();
  for (const place of places) {
    if (place.dayNumber === null) continue;
    const existing = days.get(place.dayNumber) ?? [];
    existing.push(place);
    days.set(place.dayNumber, existing);
  }
  for (const dayPlaces of days.values()) {
    dayPlaces.sort((a, b) => (a.orderInDay ?? 0) - (b.orderInDay ?? 0));
  }
  return days;
}
