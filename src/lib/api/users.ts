const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const PROVIDER_LABEL: Record<string, string> = {
  google: "구글",
  kakao: "카카오",
};

function toProviderLabel(provider: string): string {
  return PROVIDER_LABEL[provider] ?? provider;
}

export type MyPageInfo = {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
  provider: string;
  createdAt: string;
};

type MyPageResponse = {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
  provider: string;
  createdAt: string;
};

export async function getMyPage(): Promise<MyPageInfo> {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`GET /api/users/me failed: ${res.status}`);
  }

  const body: MyPageResponse = await res.json();
  return { ...body, provider: toProviderLabel(body.provider) };
}

export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`DELETE /api/users/me failed: ${res.status}`);
  }
}
