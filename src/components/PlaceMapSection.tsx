"use client";

import { Fragment, useState } from "react";
import type { SavedPlace } from "@/lib/types";
import { KakaoMap } from "@/components/KakaoMap";
import { PlaceCard } from "@/components/PlaceCard";

type PlaceMapSectionProps = {
  places: SavedPlace[];
  editable?: boolean;
  availableDayNumbers?: number[];
  onMoveDay?: (place: SavedPlace, dayNumber: number) => void;
  onReorder?: (place: SavedPlace, direction: "UP" | "DOWN") => void;
};

export function PlaceMapSection({
  places,
  editable = false,
  availableDayNumbers = [],
  onMoveDay,
  onReorder,
}: PlaceMapSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <KakaoMap
        pins={places.map((place) => ({
          id: place.id,
          latitude: place.latitude,
          longitude: place.longitude,
        }))}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <p className="text-xs text-ink-muted">
        핀은 영상에 나온 순서대로 직선으로 이었어요 — 실제 이동 경로는 아니에요.
      </p>

      <ul className="flex flex-col gap-3">
        {places.map((place, index) => (
          <Fragment key={place.id}>
            <PlaceCard
              place={place}
              selected={place.id === selectedId}
              onClick={() => setSelectedId(place.id)}
            />
            {editable && (
              <li className="-mt-2 flex list-none items-center gap-3 pl-1">
                {onReorder && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onReorder(place, "UP")}
                      className="rounded border border-border-subtle px-2 py-0.5 text-xs text-ink-muted hover:text-ink disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === places.length - 1}
                      onClick={() => onReorder(place, "DOWN")}
                      className="rounded border border-border-subtle px-2 py-0.5 text-xs text-ink-muted hover:text-ink disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                )}
                {onMoveDay && availableDayNumbers.length > 0 && (
                  <select
                    value={place.dayNumber ?? ""}
                    onChange={(e) => onMoveDay(place, Number(e.target.value))}
                    className="rounded border border-border-subtle bg-bg px-2 py-0.5 text-xs text-ink-muted"
                  >
                    <option value="" disabled>
                      날짜 선택
                    </option>
                    {availableDayNumbers.map((day) => (
                      <option key={day} value={day}>
                        {day}일차
                      </option>
                    ))}
                  </select>
                )}
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
