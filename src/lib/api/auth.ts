export type CurrentUser = {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getMe(): Promise<CurrentUser | null> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`GET /api/auth/me failed: ${res.status}`);
  }
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`POST /api/auth/logout failed: ${res.status}`);
  }
}

export function loginUrl(provider: "google" | "kakao"): string {
  return `${API_BASE_URL}/oauth2/authorization/${provider}`;
}
