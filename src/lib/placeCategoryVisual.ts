// 구글 플레이스가 반환하는 원시 카테고리(예: "cafe", "tourist_attraction")를
// 아이콘+배경색으로 매핑한다. 실사진 대신 쓰는 이유: 구글 Photos 필드는
// Enterprise 티어라 검색할 때마다 비용이 발생해서(0원 유지 원칙에 위배) 채택하지 않음.
export type CategoryVisual = { icon: string; bgClass: string };

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  cafe: { icon: "☕", bgClass: "bg-amber-100" },
  coffee_shop: { icon: "☕", bgClass: "bg-amber-100" },
  bakery: { icon: "🥐", bgClass: "bg-amber-100" },
  restaurant: { icon: "🍽️", bgClass: "bg-orange-100" },
  meal_takeaway: { icon: "🍱", bgClass: "bg-orange-100" },
  meal_delivery: { icon: "🍱", bgClass: "bg-orange-100" },
  food: { icon: "🍽️", bgClass: "bg-orange-100" },
  bar: { icon: "🍸", bgClass: "bg-rose-100" },
  night_club: { icon: "🎶", bgClass: "bg-violet-100" },
  tourist_attraction: { icon: "🏛️", bgClass: "bg-indigo-100" },
  museum: { icon: "🖼️", bgClass: "bg-indigo-100" },
  art_gallery: { icon: "🖼️", bgClass: "bg-indigo-100" },
  park: { icon: "🌳", bgClass: "bg-emerald-100" },
  natural_feature: { icon: "⛰️", bgClass: "bg-emerald-100" },
  campground: { icon: "🏕️", bgClass: "bg-emerald-100" },
  zoo: { icon: "🦁", bgClass: "bg-emerald-100" },
  lodging: { icon: "🛏️", bgClass: "bg-sky-100" },
  shopping_mall: { icon: "🛍️", bgClass: "bg-pink-100" },
  store: { icon: "🛍️", bgClass: "bg-pink-100" },
  clothing_store: { icon: "👕", bgClass: "bg-pink-100" },
  spa: { icon: "💆", bgClass: "bg-teal-100" },
  gym: { icon: "🏋️", bgClass: "bg-teal-100" },
  amusement_park: { icon: "🎢", bgClass: "bg-fuchsia-100" },
  movie_theater: { icon: "🎬", bgClass: "bg-fuchsia-100" },
  church: { icon: "⛪", bgClass: "bg-slate-100" },
  hindu_temple: { icon: "🛕", bgClass: "bg-slate-100" },
  mosque: { icon: "🕌", bgClass: "bg-slate-100" },
  place_of_worship: { icon: "🛐", bgClass: "bg-slate-100" },
  bus_station: { icon: "🚌", bgClass: "bg-slate-100" },
  train_station: { icon: "🚉", bgClass: "bg-slate-100" },
  airport: { icon: "✈️", bgClass: "bg-slate-100" },
};

const DEFAULT_VISUAL: CategoryVisual = { icon: "📍", bgClass: "bg-bg-muted" };

export function getCategoryVisual(category: string | null): CategoryVisual {
  if (!category) return DEFAULT_VISUAL;
  return CATEGORY_VISUALS[category] ?? DEFAULT_VISUAL;
}
