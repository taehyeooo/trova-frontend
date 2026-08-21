import type { SavedPlace } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: "맛집",
  cafe: "카페",
  attraction: "명소",
  lodging: "숙소",
  shopping: "쇼핑",
  other: "기타",
};

function toCategoryLabel(category: string | null): string {
  if (!category) return "";
  return CATEGORY_LABEL[category] ?? category;
}

type PlaceResponse = {
  id: number;
  placeName: string;
  region: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  sourceUrl: string;
  sourcePlatform: "INSTAGRAM" | "YOUTUBE";
  createdAt: string;
};

type PendingJobResponse = {
  jobId: number;
  sourceUrl: string;
  sourcePlatform: "INSTAGRAM" | "YOUTUBE";
  status: "PENDING" | "PROCESSING";
  createdAt: string;
};

function fromPlaceResponse(place: PlaceResponse): SavedPlace {
  return {
    id: String(place.id),
    sourceUrl: place.sourceUrl,
    sourcePlatform: place.sourcePlatform,
    placeName: place.placeName,
    region: place.region ?? "",
    category: toCategoryLabel(place.category),
    latitude: place.latitude ?? 0,
    longitude: place.longitude ?? 0,
    status: "DONE",
    createdAt: place.createdAt,
  };
}

function fromPendingJobResponse(job: PendingJobResponse): SavedPlace {
  return {
    id: String(job.jobId),
    sourceUrl: job.sourceUrl,
    sourcePlatform: job.sourcePlatform,
    placeName: "",
    region: "",
    category: "",
    latitude: 0,
    longitude: 0,
    status: job.status,
    createdAt: job.createdAt,
  };
}

export async function createShare(url: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/shares`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요해요.");
  }
  if (res.status === 400) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "지원하지 않는 URL입니다.");
  }
  if (!res.ok) {
    throw new Error(`POST /api/shares failed: ${res.status}`);
  }
}

export async function getPlaces(): Promise<SavedPlace[]> {
  const [placesRes, pendingRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/places`, { credentials: "include" }),
    fetch(`${API_BASE_URL}/api/places/pending`, { credentials: "include" }),
  ]);

  if (!placesRes.ok) {
    throw new Error(`GET /api/places failed: ${placesRes.status}`);
  }
  if (!pendingRes.ok) {
    throw new Error(`GET /api/places/pending failed: ${pendingRes.status}`);
  }

  const places: PlaceResponse[] = await placesRes.json();
  const pending: PendingJobResponse[] = await pendingRes.json();

  return [...pending.map(fromPendingJobResponse), ...places.map(fromPlaceResponse)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPlace(id: string): Promise<SavedPlace | undefined> {
  const res = await fetch(`${API_BASE_URL}/api/places/${id}`, {
    credentials: "include",
  });

  if (res.status === 404) {
    return undefined;
  }
  if (!res.ok) {
    throw new Error(`GET /api/places/${id} failed: ${res.status}`);
  }
  return fromPlaceResponse(await res.json());
}

export async function deletePlace(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/places/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`DELETE /api/places/${id} failed: ${res.status}`);
  }
}
