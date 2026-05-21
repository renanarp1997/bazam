import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page mt-4 sm:mt-6">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-500">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-ink-100 hover:text-ink-800"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Início</span>
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
            {c.href && i < items.length - 1 ? (
              <Link
                href={c.href}
                className="rounded-md px-1.5 py-1 transition-colors hover:bg-ink-100 hover:text-ink-800"
              >
                {c.label}
              </Link>
            ) : (
              <span className="rounded-md px-1.5 py-1 font-semibold text-ink-800">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
