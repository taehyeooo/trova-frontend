"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { KakaoMap } from "@/components/KakaoMap";
import { RecommendedPlaceCard } from "@/components/RecommendedPlaceCard";
import { LoadingProgress } from "@/components/LoadingProgress";
import { recommend, type RecommendedPlace } from "@/lib/api/recommendations";
import { addBookmark, listBookmarks, removeBookmark } from "@/lib/api/bookmarks";

// 서울시청 — 위치 접근을 거부했거나 사용할 수 없을 때 지도의 기본 중심
const DEFAULT_CENTER = { latitude: 37.5665, longitude: 126.978 };

export default function DiscoverPage() {
  const { user, loading: authLoading } = useAuth();
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [picked, setPicked] = useState<{ latitude: number; longitude: number } | null>(null);
  const [places, setPlaces] = useState<RecommendedPlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // placeId -> bookmarkId. 값이 있으면 찜한 상태, Map에 키가 없으면 찜 안 한 상태.
  const [bookmarksByPlaceId, setBookmarksByPlaceId] = useState<Map<number, number>>(new Map());
  const [pendingPlaceId, setPendingPlaceId] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      },
      () => {
        // 거부/실패 시 기본 중심(서울시청) 그대로 사용
      },
      { timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    listBookmarks().then((bookmarks) => {
      setBookmarksByPlaceId(new Map(bookmarks.map((b) => [b.placeId, b.id])));
    });
  }, [authLoading, user]);

  async function handleMapClick(latitude: number, longitude: number) {
    setPicked({ latitude, longitude });
    setSearching(true);
    setError(null);
    try {
      const result = await recommend(latitude, longitude);
      setPlaces(result);
    } catch {
      setError("추천 장소를 불러오지 못했어요. 다시 시도해주세요.");
    } finally {
      setSearching(false);
    }
  }

  async function handleToggleBookmark(place: RecommendedPlace) {
    if (pendingPlaceId !== null) return;
    setPendingPlaceId(place.id);
    const existingBookmarkId = bookmarksByPlaceId.get(place.id);
    try {
      if (existingBookmarkId !== undefined) {
        await removeBookmark(existingBookmarkId);
        setBookmarksByPlaceId((current) => {
          const next = new Map(current);
          next.delete(place.id);
          return next;
        });
      } else {
        const created = await addBookmark(place.id);
        setBookmarksByPlaceId((current) => new Map(current).set(place.id, created.id));
      }
    } catch {
      setError("찜하기에 실패했어요. 다시 시도해주세요.");
    } finally {
      setPendingPlaceId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">장소 추천</h1>
        {user && (
          <Link href="/bookmarks" className="text-sm font-medium text-accent hover:underline">
            찜한 장소
          </Link>
        )}
      </div>
      <p className="mb-6 text-sm text-ink-muted">지도를 클릭하면 그 주변의 추천 장소를 보여줘요.</p>

      {authLoading ? (
        <LoadingProgress />
      ) : !user ? (
        <p className="text-sm text-ink-muted">
          장소 추천을 받으려면{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            로그인
          </Link>
          이 필요해요.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <KakaoMap
            center={mapCenter}
            pins={picked ? [{ id: "picked", latitude: picked.latitude, longitude: picked.longitude }] : []}
            onMapClick={handleMapClick}
          />

          {error && <p className="text-sm text-accent">{error}</p>}

          {searching ? (
            <LoadingProgress />
          ) : places.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {places.map((place) => (
                <li key={place.id}>
                  <RecommendedPlaceCard
                    place={place}
                    bookmarked={bookmarksByPlaceId.has(place.id)}
                    pending={pendingPlaceId === place.id}
                    onToggleBookmark={() => handleToggleBookmark(place)}
                  />
                </li>
              ))}
            </ul>
          ) : picked ? (
            <p className="text-sm text-ink-muted">주변에서 추천할 만한 장소를 찾지 못했어요.</p>
          ) : (
            <p className="text-sm text-ink-muted">지도를 클릭해서 시작해보세요.</p>
          )}
        </div>
      )}
    </main>
  );
}
