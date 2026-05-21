import Link from "next/link";

export default function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-4 w-4 text-white"
          aria-hidden="true"
        >
          <path
            d="M5 4h9a4 4 0 0 1 0 8H5V4Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M5 12h11a4 4 0 0 1 0 8H5v-8Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`text-xl font-extrabold tracking-tight ${
          inverted ? "text-white" : "text-ink-900"
        }`}
      >
        Bazam
      </span>
    </Link>
  );
}

