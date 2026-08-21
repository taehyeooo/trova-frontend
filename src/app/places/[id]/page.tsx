"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlaces } from "@/lib/api/places";
import { useAuth } from "@/lib/auth/AuthContext";
import { isItineraryGroup } from "@/lib/itinerary";
import { ItineraryView } from "@/components/ItineraryView";
import { PlaceCard } from "@/components/PlaceCard";
import { KakaoMap } from "@/components/KakaoMap";
import { LoadingProgress } from "@/components/LoadingProgress";
import type { SavedPlace } from "@/lib/types";

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const sourceUrl = decodeURIComponent(params.id);
  const { user, loading: authLoading } = useAuth();
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;
    getPlaces()
      .then((result) => {
        if (!cancelled) setPlaces(result);
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const loading = authLoading || (!!user && dataLoading);
  const group = places.filter((place) => place.sourceUrl === sourceUrl);
  const title = group.find((place) => place.title)?.title ?? "제목 없음";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/places" className="text-sm text-ink-muted hover:text-ink">
        ← 저장한 장소
      </Link>

      {loading ? (
        <div className="mt-6">
          <LoadingProgress />
        </div>
      ) : !user ? (
        <p className="mt-6 text-sm text-ink-muted">
          이 페이지를 보려면{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            로그인
          </Link>
          이 필요해요.
        </p>
      ) : group.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">해당 영상을 찾을 수 없어요.</p>
      ) : (
        <>
          <h1 className="mb-6 mt-4 text-xl font-semibold text-ink">{title}</h1>
          {isItineraryGroup(group) ? (
            <ItineraryView places={group} />
          ) : (
            <div className="flex flex-col gap-4">
              <KakaoMap
                pins={group.map((place) => ({
                  id: place.id,
                  latitude: place.latitude,
                  longitude: place.longitude,
                }))}
              />
              <p className="text-xs text-ink-muted">
                핀은 영상에 나온 순서대로 직선으로 이었어요 — 실제 이동 경로는 아니에요.
              </p>
              <ul className="flex flex-col gap-3">
                {group.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </main>
  );
}
