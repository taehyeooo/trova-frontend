"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProviderLoginButton } from "@/components/ProviderLoginButton";

function LoginError() {
  const searchParams = useSearchParams();
  if (searchParams.get("error") !== "oauth_failed") {
    return null;
  }
  return (
    <p className="mb-6 rounded-lg bg-accent-bg px-4 py-3 text-sm text-accent">
      로그인에 실패했어요. 다시 시도해주세요.
    </p>
  );
}

function EmailLoginSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 border-t border-border-subtle pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-ink-muted hover:text-ink"
      >
        이메일로 로그인 {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-4 space-y-3">
          {/* TODO: connect real API — 이메일 로그인은 백엔드 미지원, 준비 중 */}
          <input
            type="email"
            placeholder="이메일"
            disabled
            className="w-full rounded-lg border border-border bg-bg-muted px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted disabled:cursor-not-allowed"
          />
          <p className="text-xs text-ink-muted">이메일 로그인은 준비 중입니다.</p>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-1 text-2xl font-semibold text-ink">
        <span className="text-accent">Trova</span>에 로그인
      </h1>
      <p className="mb-8 text-sm text-ink-muted">
        저장한 여행 장소를 확인하려면 로그인해주세요.
      </p>

      <Suspense fallback={null}>
        <LoginError />
      </Suspense>

      <div className="flex flex-col gap-3">
        <ProviderLoginButton provider="kakao" />
        <ProviderLoginButton provider="google" />
      </div>

      <EmailLoginSection />
    </main>
  );
}
