"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Wordmark from "./Wordmark";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Our Team" },
  { href: "/journal", label: "Journal" },
  { href: "/try-it", label: "Ellipsis" },
];

function AuthControl({ compact = false }: { compact?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-9" />;
  }

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className={`rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-royal-deep ${
          compact ? "w-full" : ""
        }`}
      >
        Sign in
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${compact ? "w-full" : ""}`}>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-charcoal hover:text-royal"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : null}
        <span className={compact ? "" : "sr-only sm:not-sr-only"}>
          Dashboard
        </span>
      </Link>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Wordmark className="text-2xl" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 sm:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-royal text-white"
                      : "text-stone hover:text-royal"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2">
            <AuthControl />
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal sm:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 rounded bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul
          id="mobile-nav-menu"
          className="border-t border-white/40 bg-white/70 px-5 pb-4 pt-2 backdrop-blur-lg sm:hidden"
        >
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold ${
                    active ? "bg-royal text-white" : "text-stone"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2">
            <AuthControl compact />
          </li>
        </ul>
      )}
    </header>
  );
}
