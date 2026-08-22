"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPlaces } from "@/lib/api/places";
import { VideoCard } from "@/components/VideoCard";
import { LoadingProgress } from "@/components/LoadingProgress";
import { useAuth } from "@/lib/auth/AuthContext";
import { buildVideoSummaries } from "@/lib/videoGroups";
import type { SavedPlace } from "@/lib/types";

export default function PlacesPage() {
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
  const videos = buildVideoSummaries(places);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-ink">저장한 장소</h1>

      {loading ? (
        <LoadingProgress />
      ) : !user ? (
        <p className="text-sm text-ink-muted">
          저장한 장소를 보려면{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            로그인
          </Link>
          이 필요해요.
        </p>
      ) : videos.length === 0 ? (
        <p className="text-sm text-ink-muted">아직 저장한 장소가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {videos.map((video) => (
            <VideoCard key={video.sourceUrl} video={video} />
          ))}
        </ul>
      )}
    </main>
  );
}
