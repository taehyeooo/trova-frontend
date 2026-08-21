"use client";

import { useState } from "react";
import type { SavedPlace } from "@/lib/types";
import { groupByDay } from "@/lib/itinerary";
import { KakaoMap } from "@/components/KakaoMap";
import { PlaceCard } from "@/components/PlaceCard";

export function ItineraryView({ places }: { places: SavedPlace[] }) {
  const days = groupByDay(places);
  const dayNumbers = Array.from(days.keys()).sort((a, b) => a - b);
  // 호출 측(page.tsx)이 isItineraryGroup()로 걸러서 dayNumbers가 비지 않는 그룹만 넘겨준다는
  // 전제 + key={sourceUrl}로 그룹이 바뀔 때마다 이 컴포넌트가 새로 마운트된다는 전제 위에서
  // activeDay를 한 번만 초기화한다.
  const [activeDay, setActiveDay] = useState(dayNumbers[0]);

  const activePlaces = days.get(activeDay) ?? [];
  const unassignedPlaces = places.filter((place) => place.dayNumber === null);

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
      <p className="text-xs text-ink-muted">
        핀은 영상에 나온 순서대로 직선으로 이었어요 — 실제 이동 경로는 아니에요.
      </p>

      <ul className="flex flex-col gap-3">
        {activePlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </ul>

      {unassignedPlaces.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border-subtle pt-4">
          <p className="text-sm font-medium text-ink-muted">일자 미분류</p>
          <ul className="flex flex-col gap-3">
            {unassignedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
