"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateItinerary, getPlaces } from "@/lib/api/places";
import { useAuth } from "@/lib/auth/AuthContext";
import { isItineraryGroup } from "@/lib/itinerary";
import { ItineraryView } from "@/components/ItineraryView";
import { PlaceMapSection } from "@/components/PlaceMapSection";
import { LoadingProgress } from "@/components/LoadingProgress";
import type { SavedPlace } from "@/lib/types";

const POLL_INTERVAL_MS = 4000;

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const sourceUrl = decodeURIComponent(params.id);
  const { user, loading: authLoading } = useAuth();
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    // 이 영상이 아직 처리중이면 몇 초마다 다시 불러온다 — 탭을 오가지 않아도
    // "처리중"이 저절로 "완료"로 바뀌도록.
    async function loadAndSchedule() {
      const result = await getPlaces();
      if (cancelled) return;
      setPlaces(result);
      setDataLoading(false);

      const stillProcessing = result.some(
        (place) =>
          place.sourceUrl === sourceUrl &&
          (place.status === "PENDING" || place.status === "PROCESSING")
      );
      if (stillProcessing) {
        timeoutId = setTimeout(loadAndSchedule, POLL_INTERVAL_MS);
      }
    }

    loadAndSchedule();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [authLoading, user, sourceUrl]);

  const loading = authLoading || (!!user && dataLoading);
  const group = places.filter((place) => place.sourceUrl === sourceUrl);

  const canGenerateItinerary =
    group.length > 0 && group.every((place) => place.status === "DONE") && !isItineraryGroup(group);

  async function handleGenerateItinerary() {
    if (group.length === 0) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      await generateItinerary(group[0].jobId);
      router.push(`/processing/${group[0].jobId}`);
    } catch {
      setGenerateError("일정 생성 요청에 실패했어요. 다시 시도해주세요.");
      setGenerating(false);
    }
  }

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
          <h1 className="mt-4 text-xl font-semibold text-ink">{title}</h1>
          <a
            href={group[0].sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 mt-1 inline-block truncate text-sm text-ink-muted hover:text-accent hover:underline"
          >
            원본 영상 보기 ↗
          </a>
          {canGenerateItinerary && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGenerateItinerary}
                disabled={generating}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {generating ? "일정 생성 중..." : "일정 짜기"}
              </button>
              {generateError && <p className="mt-2 text-sm text-accent">{generateError}</p>}
            </div>
          )}
          {isItineraryGroup(group) ? (
            <ItineraryView places={group} />
          ) : (
            <PlaceMapSection places={group} />
          )}
        </>
      )}
    </main>
  );
}
