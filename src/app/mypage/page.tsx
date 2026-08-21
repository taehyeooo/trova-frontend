"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteAccount, getMyPage, type MyPageInfo } from "@/lib/api/users";
import { useAuth } from "@/lib/auth/AuthContext";

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading, refresh } = useAuth();
  const [info, setInfo] = useState<MyPageInfo | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;
    getMyPage()
      .then((result) => {
        if (!cancelled) setInfo(result);
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  async function handleWithdraw() {
    if (withdrawing) return;
    if (!window.confirm("정말 탈퇴하시겠어요? 저장한 장소가 모두 삭제되고 되돌릴 수 없어요.")) {
      return;
    }

    setWithdrawing(true);
    try {
      await deleteAccount();
      await refresh();
      router.push("/");
    } finally {
      setWithdrawing(false);
    }
  }

  const loading = authLoading || (!!user && dataLoading);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold text-ink">마이페이지</h1>

      {loading ? (
        <p className="text-sm text-ink-muted">불러오는 중...</p>
      ) : !user || !info ? (
        <p className="text-sm text-ink-muted">
          마이페이지를 보려면{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            로그인
          </Link>
          이 필요해요.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 rounded-xl border border-border-subtle p-4">
            {info.profileImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- 카카오/구글 CDN 도메인이라 next/image 설정 없이 바로 사용
              <img
                src={info.profileImageUrl}
                alt=""
                className="h-12 w-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-ink">{info.nickname ?? "사용자"}</p>
              <p className="mt-0.5 text-sm text-ink-muted">
                {info.provider} 로그인 · {new Date(info.createdAt).toISOString().slice(0, 10)} 가입
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle p-4">
            <p className="mb-3 text-sm font-medium text-ink">계정 관리</p>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="text-sm font-medium text-accent hover:underline disabled:opacity-60"
            >
              {withdrawing ? "탈퇴 처리 중..." : "회원탈퇴"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
