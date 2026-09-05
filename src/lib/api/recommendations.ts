const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type RecommendedPlace = {
  id: number;
  googlePlaceId: string;
  name: string;
  category: string | null;
  mood: string | null;
  space: string | null;
  rating: number | null;
  userRatingCount: number | null;
  priceLevel: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
};

export async function recommend(
  latitude: number,
  longitude: number,
  radiusMeters?: number
): Promise<RecommendedPlace[]> {
  const res = await fetch(`${API_BASE_URL}/api/recommendations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude, radiusMeters }),
  });
  if (!res.ok) {
    throw new Error(`POST /api/recommendations failed: ${res.status}`);
  }
  return res.json();
}
