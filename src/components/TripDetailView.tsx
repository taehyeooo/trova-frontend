"use client";

import { useState } from "react";
import { KakaoMap, type MapPin } from "@/components/KakaoMap";
import { getDayColor } from "@/lib/itinerary";
import {
  addTripPlace,
  checkWeather,
  getTrip,
  removeTripPlace,
  reorderTripPlace,
  type TripDetail,
} from "@/lib/api/trips";

export function TripDetailView({ trip: initialTrip }: { trip: TripDetail }) {
  const [trip, setTrip] = useState(initialTrip);
  const [activeDay, setActiveDay] = useState(trip.days[0]?.day ?? 1);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherMessage, setWeatherMessage] = useState<string | null>(null);

  const dayColor = getDayColor(activeDay);
  const activeDayData = trip.days.find((d) => d.day === activeDay);
  const places = activeDayData?.places ?? [];
  const pins: MapPin[] = places
    .filter((p) => p.latitude !== null && p.longitude !== null)
    .map((p) => ({ id: String(p.id), latitude: p.latitude as number, longitude: p.longitude as number }));

  async function reload() {
    const fresh = await getTrip(trip.id);
    setTrip(fresh);
  }

  async function handleAddPlace(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await addTripPlace(trip.id, activeDay, query.trim());
      await reload();
      setQuery("");
    } catch {
      setError("장소를 찾지 못했어요. 다른 검색어로 시도해보세요.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(placeId: number) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await removeTripPlace(placeId);
      await reload();
    } catch {
      setError("장소를 삭제하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReorder(placeId: number, direction: "UP" | "DOWN") {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await reorderTripPlace(placeId, direction);
      await reload();
    } catch {
      setError("순서를 바꾸지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckWeather() {
    if (busy) return;
    setBusy(true);
    setWeatherMessage(null);
    try {
      const result = await checkWeather(trip.id, activeDay);
      setWeatherMessage(result.message);
    } catch {
      setWeatherMessage("날씨 확인에 실패했어요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {trip.days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveDay(d.day)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                d.day === activeDay ? "bg-accent text-white" : "bg-bg-muted text-ink-muted hover:text-ink"
              }`}
            >
              {d.day}일차{d.date ? ` (${d.date.slice(5)})` : ""}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCheckWeather}
          disabled={busy || !activeDayData?.date}
          className="text-sm font-medium text-accent hover:underline disabled:opacity-40 disabled:hover:no-underline"
        >
          날씨 확인
        </button>
      </div>

      {weatherMessage && (
        <p className="rounded-lg bg-accent-bg px-3 py-2 text-sm text-ink">{weatherMessage}</p>
      )}
      {error && <p className="text-sm text-accent">{error}</p>}

      {pins.length > 0 && <KakaoMap pins={pins} color={dayColor} />}

      <ul className="flex flex-col gap-2">
        {places.map((place, index) => (
          <li
            key={place.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {place.visitOrder}. {place.placeName}
              </p>
              {place.address && <p className="truncate text-xs text-ink-muted">{place.address}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => handleReorder(place.id, "UP")}
                disabled={busy || index === 0}
                className="text-xs text-ink-muted hover:text-ink disabled:opacity-30"
                aria-label="위로 이동"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => handleReorder(place.id, "DOWN")}
                disabled={busy || index === places.length - 1}
                className="text-xs text-ink-muted hover:text-ink disabled:opacity-30"
                aria-label="아래로 이동"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => handleRemove(place.id)}
                disabled={busy}
                className="text-xs text-ink-muted hover:text-accent"
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
        {places.length === 0 && (
          <li className="rounded-lg border border-dashed border-border-subtle p-4 text-center text-sm text-ink-muted">
            아직 장소가 없어요. 아래에서 검색해서 추가해보세요.
          </li>
        )}
      </ul>

      <form onSubmit={handleAddPlace} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="장소 이름으로 검색 (예: 강남역 스타벅스)"
          className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy || !query.trim()}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          추가
        </button>
      </form>
    </div>
  );
}
