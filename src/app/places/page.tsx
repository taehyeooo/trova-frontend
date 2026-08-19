import { getPlaces } from "@/lib/api/mock";
import { PlaceCard } from "@/components/PlaceCard";

export default async function PlacesPage() {
  const places = await getPlaces();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-ink">저장한 장소</h1>

      {places.length === 0 ? (
        <p className="text-sm text-ink-muted">아직 저장한 장소가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </ul>
      )}
    </main>
  );
}
