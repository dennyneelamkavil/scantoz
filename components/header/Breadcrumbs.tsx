"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isMongoId } from "@/lib/utils";

const trimMongoId = (id: string, start = 3, end = 2) =>
  `${id.slice(0, start)}…${id.slice(-end)}`;

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    const label = isMongoId(segment)
      ? trimMongoId(segment)
      : segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return { href, label };
  });

  const showEllipsis = breadcrumbs.length > 3;

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-3 pb-3 text-sm text-gray-500 lg:px-6 dark:text-gray-400"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-brand-500">
            Home
          </Link>
        </li>

        {/* Ellipsis (mobile only) */}
        {showEllipsis && (
          <li className="flex items-center gap-2 md:hidden text-gray-400">
            <span>/</span>
            <span>…</span>
          </li>
        )}

        {breadcrumbs.map((crumb, i) => {
          const isMobileHidden =
            breadcrumbs.length > 3 && i < breadcrumbs.length - 3;

          return (
            <li
              key={crumb.href}
              className={`items-center gap-2 ${
                isMobileHidden ? "hidden sm:flex" : "flex"
              }`}
            >
              <span>/</span>
              {i === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 dark:text-gray-200">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-brand-500">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
