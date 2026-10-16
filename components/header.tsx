"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SHOW_URL } from "@/lib/site";

const PAGES = [
  { href: "/", label: "Home", exact: true },
  { href: "/how-it-works", label: "How It Works", exact: false },
  { href: "/pricing", label: "Pricing", exact: false },
  { href: "/roi-calculator", label: "ROI", exact: false },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-mk-fg/10 bg-mk-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-5 py-3.5 md:px-10 lg:px-14">
        {/* Lovable sets a text wordmark here; swapped for the real stacked mark.
            It's two lines tall, so it needs more height than a single-line
            lockup — h-8 on phones, h-10 once there's room. */}
        <Link href="/" className="shrink-0" aria-label="Market Better — home">
          <Image
            src="/mb-logo.png"
            alt="Market Better"
            width={1247}
            height={717}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <nav
          className="ml-auto hidden items-center gap-7 text-[0.9rem] lg:flex"
          aria-label="Main navigation"
        >
          {PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={`mk-nav-link ${
                isActive(page.href, page.exact) ? "text-mk-accent" : ""
              }`}
            >
              {page.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto lg:ml-4">
          <a
            href={SHOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-mk bg-mk-accent px-4 text-[0.8rem] font-semibold text-white transition-colors hover:bg-mk-accent/90 sm:px-5"
          >
            Market Better Show
          </a>
        </div>
      </div>

      <nav
        className="flex gap-6 overflow-x-auto border-t border-mk-fg/10 px-5 py-2.5 text-[0.8rem] lg:hidden"
        aria-label="Mobile navigation"
      >
        {PAGES.map((page) => (
          <Link key={page.href} href={page.href} className="mk-nav-link">
            {page.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
