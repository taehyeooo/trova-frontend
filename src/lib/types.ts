export type SavedPlace = {
  id: string;
  sourceUrl: string;
  sourcePlatform: "INSTAGRAM" | "YOUTUBE";
  placeName: string;
  region: string;
  // 백엔드는 영어 enum(restaurant/cafe/attraction/lodging/shopping/other)을 반환 —
  // src/lib/api/places.ts에서 한글 라벨로 변환해서 여기 담는다.
  category: string;
  latitude: number;
  longitude: number;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  createdAt: string;
};
