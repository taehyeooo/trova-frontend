"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export function AuthStatus() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="h-5 w-16 animate-pulse rounded bg-bg-muted" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-accent hover:underline"
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.profileImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- 카카오/구글 CDN 도메인이라 next/image 설정 없이 바로 사용
        <img
          src={user.profileImageUrl}
          alt=""
          className="h-6 w-6 rounded-full"
        />
      )}
      <span className="text-sm text-ink-muted">{user.nickname ?? "사용자"}님</span>
      <button
        type="button"
        onClick={() => logout()}
        className="text-sm font-medium text-ink-muted hover:text-ink"
      >
        로그아웃
      </button>
    </div>
  );
}
