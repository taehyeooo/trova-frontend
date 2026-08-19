import Image from "next/image";
import Link from "next/link";
import { AuthStatus } from "@/components/AuthStatus";

export function Header() {
  return (
    <header className="border-b border-border-subtle">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/trova-icon.svg" alt="" width={24} height={24} priority />
          <span className="text-base font-semibold text-ink">Trova</span>
        </Link>
        <AuthStatus />
      </div>
    </header>
  );
}
