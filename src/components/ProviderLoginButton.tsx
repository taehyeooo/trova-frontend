import { loginUrl } from "@/lib/api/auth";

const PROVIDER_STYLE = {
  kakao: {
    label: "카카오로 시작하기",
    className: "bg-kakao text-ink hover:brightness-95",
  },
  google: {
    label: "Google로 계속하기",
    className: "bg-bg text-ink border border-border hover:bg-bg-muted",
  },
} as const;

function ProviderIcon({ provider }: { provider: "kakao" | "google" }) {
  if (provider === "kakao") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <ellipse cx="9" cy="8.2" rx="8" ry="6.6" fill="#191919" />
        <path d="M5 13.5 L4 17 L7.6 14.3" fill="#191919" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" fill="none" stroke="#DEDED8" strokeWidth="1.5" />
      <path d="M9 5.5 L9 9 L12.5 9" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ProviderLoginButton({ provider }: { provider: "kakao" | "google" }) {
  const style = PROVIDER_STYLE[provider];
  return (
    <a
      href={loginUrl(provider)}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors ${style.className}`}
    >
      <ProviderIcon provider={provider} />
      {style.label}
    </a>
  );
}
