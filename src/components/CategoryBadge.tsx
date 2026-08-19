export function CategoryBadge({ category }: { category: string }) {
  if (!category) {
    return null;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-muted px-2.5 py-1 text-xs text-ink-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      {category}
    </span>
  );
}
