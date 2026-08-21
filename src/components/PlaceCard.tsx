import type { SavedPlace } from "@/lib/types";
import { CategoryBadge } from "@/components/CategoryBadge";

const STATUS_LABEL: Record<SavedPlace["status"], string> = {
  PENDING: "대기중",
  PROCESSING: "처리중",
  DONE: "완료",
  FAILED: "실패",
};

const PLATFORM_LABEL: Record<SavedPlace["sourcePlatform"], string> = {
  INSTAGRAM: "인스타그램",
  YOUTUBE: "유튜브",
};

export function PlaceCard({
  place,
  selected = false,
  onClick,
}: {
  place: SavedPlace;
  selected?: boolean;
  onClick?: () => void;
}) {
  const isDone = place.status === "DONE";

  return (
    <li
      onClick={onClick}
      className={`rounded-xl border p-4 transition-colors ${
        selected ? "border-accent bg-accent-bg" : "border-border-subtle"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">
            {place.placeName || "장소명 추출 중"}
          </p>
          {place.region && (
            <p className="mt-0.5 text-sm text-ink-muted">{place.region}</p>
          )}
        </div>
        {!isDone && (
          <span className="shrink-0 text-xs text-ink-muted">
            {STATUS_LABEL[place.status]}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={place.category} />
          <span className="text-xs text-ink-muted">
            {PLATFORM_LABEL[place.sourcePlatform]}
          </span>
        </div>
        <time
          dateTime={place.createdAt}
          className="font-mono text-xs text-ink-muted"
        >
          {new Date(place.createdAt).toISOString().slice(0, 10)}
        </time>
      </div>
    </li>
  );
}
