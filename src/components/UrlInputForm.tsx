"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShare } from "@/lib/api/mock";

export function UrlInputForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || submitting) return;

    setSubmitting(true);
    try {
      // TODO: connect real API — POST /api/shares
      await createShare(url.trim());
      router.push("/places");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <input
        type="url"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="인스타그램 또는 유튜브 링크를 붙여넣으세요"
        className="h-12 flex-1 rounded-xl border border-border bg-bg px-4 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="h-12 shrink-0 rounded-xl bg-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "추출 중..." : "장소 추출하기"}
      </button>
    </form>
  );
}
