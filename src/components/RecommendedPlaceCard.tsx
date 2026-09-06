import type { RecommendedPlace } from "@/lib/api/recommendations";
import { CategoryBadge } from "@/components/CategoryBadge";

const MOOD_LABEL: Record<string, string> = {
  CALM: "차분함",
  LIVELY: "활기참",
  ROMANTIC: "로맨틱",
  TRENDY: "트렌디",
  COZY: "아늑함",
  LUXURIOUS: "고급스러움",
};

const SPACE_LABEL: Record<string, string> = {
  INDOOR: "실내",
  OUTDOOR: "실외",
  MIXED: "실내외",
};

export function RecommendedPlaceCard({
  place,
  bookmarked,
  pending,
  onToggleBookmark,
}: {
  place: RecommendedPlace;
  bookmarked: boolean;
  pending?: boolean;
  onToggleBookmark: () => void;
}) {
  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{place.name}</p>
          {place.address && <p className="mt-0.5 truncate text-sm text-ink-muted">{place.address}</p>}
        </div>
        <button
          type="button"
          onClick={onToggleBookmark}
          disabled={pending}
          aria-label={bookmarked ? "찜 해제" : "찜하기"}
          aria-pressed={bookmarked}
          className="shrink-0 text-xl leading-none disabled:opacity-40"
        >
          {bookmarked ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {place.category && <CategoryBadge category={place.category} />}
        {place.mood && (
          <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs text-ink-muted">
            {MOOD_LABEL[place.mood] ?? place.mood}
          </span>
        )}
        {place.space && (
          <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs text-ink-muted">
            {SPACE_LABEL[place.space] ?? place.space}
          </span>
        )}
      </div>

      {(place.rating !== null || place.userRatingCount !== null) && (
        <p className="mt-2 text-xs text-ink-muted">
          {place.rating !== null && `⭐ ${place.rating.toFixed(1)}`}
          {place.userRatingCount !== null && ` (리뷰 ${place.userRatingCount}개)`}
        </p>
      )}
    </div>
  );
}
