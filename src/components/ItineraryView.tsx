"use client";

import { useState } from "react";
import type { SavedPlace } from "@/lib/types";
import { groupByDay } from "@/lib/itinerary";
import { KakaoMap } from "@/components/KakaoMap";
import { PlaceCard } from "@/components/PlaceCard";

export function ItineraryView({ places }: { places: SavedPlace[] }) {
  const days = groupByDay(places);
  const dayNumbers = Array.from(days.keys()).sort((a, b) => a - b);
  const [activeDay, setActiveDay] = useState(dayNumbers[0]);

  const activePlaces = days.get(activeDay) ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle p-4">
      <div className="flex flex-wrap gap-2">
        {dayNumbers.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              day === activeDay
                ? "bg-accent text-white"
                : "bg-bg-muted text-ink-muted hover:text-ink"
            }`}
          >
            {day}일차
          </button>
        ))}
      </div>

      <KakaoMap
        pins={activePlaces.map((place) => ({
          id: place.id,
          latitude: place.latitude,
          longitude: place.longitude,
        }))}
      />

      <ul className="flex flex-col gap-3">
        {activePlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </ul>
    </div>
  );
}
