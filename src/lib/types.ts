export type SavedPlace = {
  id: string;
  sourceUrl: string;
  sourcePlatform: "INSTAGRAM" | "YOUTUBE";
  placeName: string;
  region: string;
  // 백엔드 파이프라인 추출 결과에 이미 포함되는 필드(name/region/category/confidence)를
  // 앞당겨 반영 — 실제 SavedPlace 엔티티에는 아직 없음, API 연동 시 확인 필요
  category: string;
  latitude: number;
  longitude: number;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  createdAt: string;
};
