"use client";

import { useState } from "react";
import type { SavedPlace } from "@/lib/types";
import { groupByDay } from "@/lib/itinerary";
import { PlaceMapSection } from "@/components/PlaceMapSection";
import { moveToDay, reorderPlace } from "@/lib/api/places";

export function ItineraryView({ places }: { places: SavedPlace[] }) {
  const [localPlaces, setLocalPlaces] = useState(places);
  const [editing, setEditing] = useState(false);
  const [emptyDayNumbers, setEmptyDayNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const days = groupByDay(localPlaces);
  const dayNumbers = Array.from(new Set([...days.keys(), ...emptyDayNumbers])).sort((a, b) => a - b);
  // 호출 측(page.tsx)이 isItineraryGroup()로 걸러서 dayNumbers가 비지 않는 그룹만 넘겨준다는
  // 전제 + key={sourceUrl}로 그룹이 바뀔 때마다 이 컴포넌트가 새로 마운트된다는 전제 위에서
  // activeDay를 한 번만 초기화한다.
  const [activeDay, setActiveDay] = useState(dayNumbers[0]);

  const activePlaces = days.get(activeDay) ?? [];
  const unassignedPlaces = localPlaces.filter((place) => place.dayNumber === null);

  async function handleMoveDay(place: SavedPlace, dayNumber: number) {
    const previous = localPlaces;
    setError(null);
    setLocalPlaces((current) =>
      current.map((p) => (p.id === place.id ? { ...p, dayNumber } : p))
    );
    setEmptyDayNumbers((current) => current.filter((d) => d !== dayNumber));
    try {
      const updated = await moveToDay(place.id, dayNumber);
      setLocalPlaces((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      setLocalPlaces(previous);
      setError("장소를 옮기지 못했어요. 다시 시도해주세요.");
    }
  }

  async function handleReorder(place: SavedPlace, direction: "UP" | "DOWN") {
    const previous = localPlaces;
    setError(null);
    try {
      const updated = await reorderPlace(place.id, direction);
      setLocalPlaces((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      setLocalPlaces(previous);
      setError("순서를 바꾸지 못했어요. 다시 시도해주세요.");
    }
  }

  function handleAddDay() {
    const maxDay = dayNumbers.length > 0 ? Math.max(...dayNumbers) : 0;
    const nextDay = maxDay + 1;
    setEmptyDayNumbers((current) => [...current, nextDay]);
    setActiveDay(nextDay);
  }

  function handleDeleteDay(day: number) {
    setEmptyDayNumbers((current) => current.filter((d) => d !== day));
    if (activeDay === day) {
      const remaining = dayNumbers.filter((d) => d !== day);
      setActiveDay(remaining[0]);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {dayNumbers.map((day) => {
            const count = (days.get(day) ?? []).length;
            return (
              <div key={day} className="flex items-center gap-1">
                <button
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
                {editing && count === 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteDay(day)}
                    aria-label={`${day}일차 삭제`}
                    className="text-xs text-ink-muted hover:text-accent"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
          {editing && (
            <button
              type="button"
              onClick={handleAddDay}
              className="rounded-full border border-dashed border-border-subtle px-4 py-1.5 text-sm text-ink-muted hover:text-ink"
            >
              + 날짜 추가
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing((current) => !current)}
          className="text-sm font-medium text-accent hover:underline"
        >
          {editing ? "편집 완료" : "편집"}
        </button>
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <PlaceMapSection
        key={activeDay}
        places={activePlaces}
        editable={editing}
        availableDayNumbers={dayNumbers}
        onMoveDay={handleMoveDay}
        onReorder={handleReorder}
      />

      {unassignedPlaces.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border-subtle pt-4">
          <p className="text-sm font-medium text-ink-muted">일자 미분류</p>
          <PlaceMapSection
            places={unassignedPlaces}
            editable={editing}
            availableDayNumbers={dayNumbers}
            onMoveDay={handleMoveDay}
          />
        </div>
      )}
    </div>
  );
}
