"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoMaps } from "@/lib/kakaoMapLoader";

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
};

export function KakaoMap({ pins }: { pins: MapPin[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const validPins = useMemo(
    () => pins.filter((pin) => pin.latitude !== 0 || pin.longitude !== 0),
    [pins]
  );

  useEffect(() => {
    if (validPins.length === 0) return;

    let cancelled = false;

    loadKakaoMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        const center = new window.kakao.maps.LatLng(
          validPins[0].latitude,
          validPins[0].longitude
        );
        const map = new window.kakao.maps.Map(containerRef.current, {
          center,
          level: 6,
        });

        const bounds = new window.kakao.maps.LatLngBounds();
        const path = validPins.map((pin) => {
          const position = new window.kakao.maps.LatLng(pin.latitude, pin.longitude);
          new window.kakao.maps.Marker({ position, map });
          bounds.extend(position);
          return position;
        });

        if (path.length > 1) {
          new window.kakao.maps.Polyline({
            path,
            strokeWeight: 3,
            strokeColor: "#FF6B4A",
            strokeOpacity: 0.8,
          }).setMap(map);
        }

        map.setBounds(bounds);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "지도를 불러오지 못했어요.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [validPins]);

  if (validPins.length === 0) {
    return null;
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border-subtle text-sm text-ink-muted">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-64 w-full rounded-xl border border-border-subtle"
    />
  );
}
