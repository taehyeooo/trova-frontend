import type { SavedPlace } from "@/lib/types";

const LATENCY_MS = 500;

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let places: SavedPlace[] = [
  {
    id: "1",
    sourceUrl: "https://www.instagram.com/reel/example1",
    sourcePlatform: "INSTAGRAM",
    placeName: "onion 안국",
    region: "서울 종로구",
    category: "카페",
    latitude: 37.5758,
    longitude: 126.9853,
    status: "DONE",
    createdAt: "2026-08-10T09:00:00.000Z",
  },
  {
    id: "2",
    sourceUrl: "https://www.youtube.com/shorts/example2",
    sourcePlatform: "YOUTUBE",
    placeName: "흰여울문화마을",
    region: "부산 영도구",
    category: "명소",
    latitude: 35.075,
    longitude: 129.0306,
    status: "DONE",
    createdAt: "2026-08-18T13:20:00.000Z",
  },
  {
    id: "3",
    sourceUrl: "https://www.instagram.com/reel/example3",
    sourcePlatform: "INSTAGRAM",
    placeName: "송정 씨앗호떡",
    region: "부산 해운대구",
    category: "맛집",
    latitude: 35.1785,
    longitude: 129.1996,
    status: "PROCESSING",
    createdAt: "2026-08-19T08:40:00.000Z",
  },
  {
    id: "4",
    sourceUrl: "https://www.instagram.com/reel/example4",
    sourcePlatform: "INSTAGRAM",
    placeName: "",
    region: "",
    category: "",
    latitude: 0,
    longitude: 0,
    status: "FAILED",
    createdAt: "2026-08-17T11:05:00.000Z",
  },
];

// TODO: connect real API — POST /api/shares
export function createShare(url: string): Promise<SavedPlace> {
  const newPlace: SavedPlace = {
    id: String(Date.now()),
    sourceUrl: url,
    sourcePlatform: url.includes("youtube.com") || url.includes("youtu.be")
      ? "YOUTUBE"
      : "INSTAGRAM",
    placeName: "",
    region: "",
    category: "",
    latitude: 0,
    longitude: 0,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  places = [newPlace, ...places];
  return delay(newPlace);
}

// TODO: connect real API — GET /api/places
export function getPlaces(): Promise<SavedPlace[]> {
  return delay(places);
}

// TODO: connect real API — GET /api/places/{id}
export function getPlace(id: string): Promise<SavedPlace | undefined> {
  return delay(places.find((place) => place.id === id));
}

// TODO: connect real API — DELETE /api/places/{id}
export function deletePlace(id: string): Promise<void> {
  places = places.filter((place) => place.id !== id);
  return delay(undefined);
}

// TODO: connect real API — GET /api/places/pending
// 백엔드 스펙에 정확한 정의가 없어서, 처리 대기열 화면에 필요한
// PENDING/PROCESSING 상태만 우선 반환하도록 가정. 실제 API 연동 시 확인 필요.
export function getPendingPlaces(): Promise<SavedPlace[]> {
  return delay(
    places.filter((place) => place.status === "PENDING" || place.status === "PROCESSING")
  );
}
