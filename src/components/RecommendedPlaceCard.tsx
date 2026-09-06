import { useState } from "react";
import { getPlaceDetails, type PlaceDetail, type RecommendedPlace } from "@/lib/api/recommendations";
import { CategoryBadge } from "@/components/CategoryBadge";
import { getCategoryVisual } from "@/lib/placeCategoryVisual";

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDetail, setReviewDetail] = useState<PlaceDetail | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const visual = getCategoryVisual(place.category);

  async function handleOpenReviews() {
    setShowReviewModal(true);
    if (reviewDetail) return;
    setReviewLoading(true);
    try {
      const detail = await getPlaceDetails(place.id);
      setReviewDetail(detail);
    } catch {
      setReviewDetail({ ...place, reviewSummary: "리뷰를 불러오지 못했어요.", reviewSnippets: [] });
    } finally {
      setReviewLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <div
        className={`mb-3 flex h-20 items-center justify-center rounded-lg text-3xl ${visual.bgClass}`}
        aria-hidden="true"
      >
        {visual.icon}
      </div>

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

      <button
        type="button"
        onClick={handleOpenReviews}
        className="mt-2 text-xs font-medium text-accent hover:underline"
      >
        리뷰 보기
      </button>

      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-border-subtle bg-bg p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{place.name}</p>
                {place.address && <p className="truncate text-xs text-ink-muted">{place.address}</p>}
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                aria-label="닫기"
                className="shrink-0 text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            {reviewLoading ? (
              <p className="text-sm text-ink-muted">리뷰를 불러오는 중...</p>
            ) : (
              <>
                <p className="text-sm text-ink-muted">{reviewDetail?.reviewSummary}</p>
                {reviewDetail && reviewDetail.reviewSnippets.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {reviewDetail.reviewSnippets.map((snippet, i) => (
                      <li
                        key={`${place.id}-${i}`}
                        className="border-l-2 border-border-subtle pl-2 text-xs text-ink-muted"
                      >
                        “{snippet}”
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
