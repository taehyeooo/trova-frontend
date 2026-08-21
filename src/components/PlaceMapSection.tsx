"use client";

import { useState } from "react";
import type { SavedPlace } from "@/lib/types";
import { KakaoMap } from "@/components/KakaoMap";
import { PlaceCard } from "@/components/PlaceCard";

export function PlaceMapSection({ places }: { places: SavedPlace[] }) {
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
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            selected={place.id === selectedId}
            onClick={() => setSelectedId(place.id)}
          />
        ))}
      </ul>
    </div>
  );
}
