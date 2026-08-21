"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoMaps } from "@/lib/kakaoMapLoader";

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
};

// 카카오맵 SDK에는 마커 bounce 애니메이션(Animation.BOUNCE) 같은 API가 없다 —
// 구글맵과 달리 CustomOverlay로 직접 하이라이트 링을 그려서 선택 표시를 한다.
const HIGHLIGHT_HTML =
  '<div style="width:28px;height:28px;border-radius:9999px;background:rgba(225,74,43,0.28);border:2px solid #e14a2b;"></div>';

export function KakaoMap({
  pins,
  selectedId,
  onSelect,
}: {
  pins: MapPin[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<InstanceType<typeof window.kakao.maps.Map> | null>(null);
  const markersRef = useRef<Map<string, InstanceType<typeof window.kakao.maps.Marker>>>(
    new Map()
  );
  const highlightRef = useRef<InstanceType<typeof window.kakao.maps.CustomOverlay> | null>(
    null
  );
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // pins는 호출 측에서 매 렌더마다 새 배열로 넘어오는 경우가 많아, 참조가 아니라
  // 내용(id+좌표)이 실제로 바뀔 때만 지도를 다시 만들도록 키로 비교한다 — 그래야
  // selectedId가 바뀌어 부모가 리렌더돼도 지도가 통째로 재생성되며 panTo가 씹히지 않는다.
  const pinsKey = pins.map((pin) => `${pin.id}:${pin.latitude}:${pin.longitude}`).join("|");
  const validPins = useMemo(
    () => pins.filter((pin) => pin.latitude !== 0 || pin.longitude !== 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinsKey]
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
        mapRef.current = map;

        const bounds = new window.kakao.maps.LatLngBounds();
        const markers = new Map<string, InstanceType<typeof window.kakao.maps.Marker>>();
        const path = validPins.map((pin) => {
          const position = new window.kakao.maps.LatLng(pin.latitude, pin.longitude);
          const marker = new window.kakao.maps.Marker({ position, map });
          window.kakao.maps.event.addListener(marker, "click", () => {
            onSelectRef.current?.(pin.id);
          });
          markers.set(pin.id, marker);
          bounds.extend(position);
          return position;
        });
        markersRef.current = markers;

        highlightRef.current = new window.kakao.maps.CustomOverlay({
          position: validPins[0]
            ? new window.kakao.maps.LatLng(validPins[0].latitude, validPins[0].longitude)
            : center,
          content: HIGHLIGHT_HTML,
          zIndex: 1,
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

  useEffect(() => {
    const highlight = highlightRef.current;
    if (!highlight) return;

    if (!selectedId) {
      highlight.setMap(null);
      return;
    }

    const map = mapRef.current;
    const marker = markersRef.current.get(selectedId);
    if (!map || !marker) return;

    map.panTo(marker.getPosition());
    highlight.setPosition(marker.getPosition());
    highlight.setMap(map);
  }, [selectedId]);

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
